const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    message: { type: String, required: true },
    buttons: [{
        text: String,
        id: String
    }],
    scheduledAt: Date,
    stats: {
        sent: { type: Number, default: 0 },
        delivered: { type: Number, default: 0 },
        read: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 }
    }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);