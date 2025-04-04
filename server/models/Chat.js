// models/Chat.js
const chatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contact: String, // رقم العميل
    messages: [{
        content: String,
        timestamp: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read'],
            default: 'sent'
        },
        direction: { type: String, enum: ['in', 'out'] },
        attachments: [String]
    }],
    unreadCount: { type: Number, default: 0 }
});