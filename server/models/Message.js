const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'document', 'button'],
        default: 'text'
    },
    media: {
        mimetype: String,
        data: String,
        filename: String
    },
    buttonsClicked: [{
        type: String
    }],
    isGroupMsg: {
        type: Boolean,
        default: false
    },
    quotedMsg: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
