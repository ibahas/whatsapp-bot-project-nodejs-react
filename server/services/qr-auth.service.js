const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

class QRAuthService {
    constructor() {
        this.sessions = new Map();
    }

    async generateQR(userId) {
        const sessionId = uuidv4();
        const client = new Client({
            authStrategy: new LocalAuth({ clientId: sessionId }),
            puppeteer: { headless: true }
        });

        this.sessions.set(sessionId, { client, userId });

        return new Promise((resolve, reject) => {
            client.on('qr', async (qr) => {
                try {
                    const qrImage = await qrcode.toDataURL(qr);
                    resolve({ sessionId, qrImage });
                } catch (err) {
                    reject(err);
                }
            });

            client.initialize();
        });
    }

    async linkDevice(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) throw new Error('Invalid session');

        return new Promise((resolve) => {
            session.client.on('ready', () => {
                const userData = {
                    phone: session.client.info.wid.user,
                    sessionId
                };
                resolve(userData);
            });
        });
    }
}

module.exports = new QRAuthService();