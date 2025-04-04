const { Server } = require('socket.io');
const NotificationService = require('./notification.service');

class SocketService {
    constructor(httpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL,
                methods: ["GET", "POST"]
            },
            connectionStateRecovery: {
                maxDisconnectionDuration: 2 * 60 * 1000 // 2 minutes
            }
        });

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`Client connected: ${socket.id}`);

            socket.on('authenticate', (token) => {
                // Verify JWT and join user-specific room
                const userId = verifyToken(token);
                socket.join(`user_${userId}`);
            });

            socket.on('message-typing', (data) => {
                // Broadcast typing indicator
                socket.to(`chat_${data.chatId}`).emit('user-typing', {
                    userId: data.userId,
                    isTyping: data.isTyping
                });
            });

            socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });
    }

    sendToUser(userId, event, data) {
        this.io.to(`user_${userId}`).emit(event, data);
    }
}

module.exports = SocketService;