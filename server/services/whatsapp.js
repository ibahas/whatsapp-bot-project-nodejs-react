const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const { EventEmitter } = require('events');
const redis = require('redis');
const { v4: uuidv4 } = require('uuid');

class WhatsAppService extends EventEmitter {
    constructor() {
        super();
        this.clients = new Map(); // clientId -> WhatsApp Client
        this.sessions = new Map(); // sessionId -> { clientId, userId }
        this.redisClient = redis.createClient({
            url: process.env.REDIS_URL
        });
        this.connectRedis();
    }

    async connectRedis() {
        await this.redisClient.connect();
        this.redisClient.on('error', (err) => {
            console.log('Redis error:', err);
        });
    }

    async initClient(clientId, userId = null) {
        if (this.clients.has(clientId)) {
            return this.clients.get(clientId);
        }

        const client = new Client({
            authStrategy: new LocalAuth({ clientId }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage'
                ]
            },
            webVersionCache: {
                type: 'remote',
                remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${process.env.WA_VERSION || '2.2412.54'}.html`
            }
        });

        this.clients.set(clientId, client);
        if (userId) this.sessions.set(clientId, { userId });

        client.on('qr', async (qr) => {
            try {
                const qrImage = await qrcode.toDataURL(qr);
                const sessionId = uuidv4();
                await this.redisClient.setEx(
                    `wa:qr:${sessionId}`,
                    300, // 5 minutes expiry
                    JSON.stringify({ clientId, qr })
                );
                this.emit('qr', { clientId, sessionId, qrImage });
            } catch (err) {
                console.log('QR generation failed:', err);
            }
        });

        client.on('authenticated', (session) => {
            console.log(`Client ${clientId} authenticated`);
            this.emit('authenticated', { clientId, session });
        });

        client.on('ready', () => {
            console.log(`Client ${clientId} ready`);
            this.emit('ready', clientId);
            this.setupMessageHandlers(client);
        });

        client.on('disconnected', (reason) => {
            console.log(`Client ${clientId} disconnected:`, reason);
            this.cleanupClient(clientId);
            this.emit('disconnected', { clientId, reason });
        });

        client.initialize().catch(err => {
            console.log('Client initialization failed:', err);
            this.cleanupClient(clientId);
        });

        return client;
    }

    setupMessageHandlers(client) {
        client.on('message', async (msg) => {
            try {
                const messageData = {
                    id: msg.id._serialized,
                    from: msg.from,
                    to: msg.to,
                    body: msg.body,
                    timestamp: msg.timestamp,
                    hasMedia: msg.hasMedia,
                    isGroupMsg: msg.isGroupMsg
                };

                if (msg.hasMedia) {
                    const media = await msg.downloadMedia();
                    messageData.media = {
                        mimetype: media.mimetype,
                        data: media.data,
                        filename: media.filename
                    };
                }

                // Cache last message for quick reply
                await this.redisClient.setEx(
                    `wa:lastmsg:${msg.from}`,
                    86400, // 24 hours
                    JSON.stringify(messageData)
                );

                this.emit('message', messageData);
            } catch (err) {
                console.log('Message processing failed:', err);
            }
        });

        client.on('message_ack', (msg, ack) => {
            this.emit('acknowledgement', {
                messageId: msg.id._serialized,
                status: ack,
                timestamp: Date.now()
            });
        });
    }

    async sendMessage(clientId, to, content) {
        try {
            const client = this.clients.get(clientId);
            if (!client) throw new Error('Client not initialized');

            let message;
            if (content.media) {
                const media = new MessageMedia(
                    content.media.mimetype,
                    content.media.data,
                    content.media.filename
                );
                message = await client.sendMessage(to, media, {
                    caption: content.text,
                    sendMediaAsDocument: content.asDocument || false
                });
            } else {
                message = await client.sendMessage(to, content.text, {
                    linkPreview: content.linkPreview || false
                });
            }

            return {
                id: message.id._serialized,
                timestamp: message.timestamp,
                status: 'sent'
            };
        } catch (err) {
            console.log('Message sending failed:', err);
            throw new Error(`Failed to send message: ${err.message}`);
        }
    }

    async getClientStatus(clientId) {
        const client = this.clients.get(clientId);
        if (!client) return 'not_initialized';

        try {
            const state = await client.getState();
            return state === 'CONNECTED' ? 'connected' : state.toLowerCase();
        } catch (err) {
            return 'disconnected';
        }
    }

    async cleanupClient(clientId) {
        const client = this.clients.get(clientId);
        if (client) {
            try {
                await client.destroy();
            } catch (err) {
                console.log('Client cleanup failed:', err);
            }
            this.clients.delete(clientId);
        }
        this.sessions.delete(clientId);
    }

    async validateNumber(clientId, number) {
        try {
            const client = this.clients.get(clientId);
            if (!client) throw new Error('Client not initialized');

            const formattedNumber = number.replace(/[^0-9]/g, '');
            const isRegistered = await client.isRegisteredUser(formattedNumber);

            return {
                number: formattedNumber,
                isValid: isRegistered,
                timestamp: Date.now()
            };
        } catch (err) {
            console.log('Number validation failed:', err);
            return {
                number,
                isValid: false,
                error: err.message
            };
        }
    }

    async broadcastMessage(clientId, recipients, message) {
        const results = [];
        const batchSize = 10; // Process 10 messages at a time
        const client = this.clients.get(clientId);

        if (!client) throw new Error('Client not initialized');

        for (let i = 0; i < recipients.length; i += batchSize) {
            const batch = recipients.slice(i, i + batchSize);
            const batchResults = await Promise.allSettled(
                batch.map(async (recipient) => {
                    try {
                        const result = await this.sendMessage(clientId, recipient, message);
                        return { recipient, status: 'success', data: result };
                    } catch (err) {
                        return { recipient, status: 'failed', error: err.message };
                    }
                })
            );
            results.push(...batchResults);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
        }

        return results;
    }

    async getQRCode(sessionId) {
        try {
            const qrData = await this.redisClient.get(`wa:qr:${sessionId}`);
            if (!qrData) throw new Error('QR expired or invalid');

            const { qr } = JSON.parse(qrData);
            return await qrcode.toDataURL(qr);
        } catch (err) {
            console.log('QR retrieval failed:', err);
            throw new Error('Failed to generate QR code');
        }
    }
}

// Singleton pattern
module.exports = new WhatsAppService();