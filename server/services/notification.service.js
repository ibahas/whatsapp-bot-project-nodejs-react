const webpush = require('web-push');
const { io } = require('../server');
const User = require('../models/user.model');

class NotificationService {
    constructor() {
        webpush.setVapidDetails(
            `mailto:${process.env.VAPID_EMAIL}`,
            process.env.VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        );
    }

    async send(userId, notification) {
        // إرسال عبر WebSocket
        io.to(`user_${userId}`).emit('notification', notification);

        // إرسال Push Notification
        const user = await User.findById(userId);
        if (user.pushSubscription) {
            await webpush.sendNotification(
                user.pushSubscription,
                JSON.stringify(notification)
            );
        }
    }
}

module.exports = new NotificationService();