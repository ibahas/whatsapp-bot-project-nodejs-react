const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['info', 'warning', 'error', 'success'],
        default: 'info'
    },
    read: { type: Boolean, default: false },
    link: String // رابط مرتبط بالإشعار (مثال: /campaigns/123)
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);