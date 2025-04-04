const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['qr_pending', 'active', 'logged_out'],
        default: 'qr_pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActive: Date
});

module.exports = mongoose.model('Session', sessionSchema);