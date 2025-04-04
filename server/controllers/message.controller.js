const { Webhook, MessageMedia } = require('whatsapp-web.js');
const Message = require('../models/message.model');
const User = require('../models/user.model');

exports.handleIncomingMessage = async (req, res) => {
    try {
        const { from, body, media } = req.body;

        // حفظ في قاعدة البيانات
        const newMessage = await Message.create({
            user: req.user.id,
            from,
            content: media ? await handleMedia(media) : body,
            type: media ? 'media' : 'text'
        });

        // إرسال تحديث عبر WebSocket
        req.io.to(req.user.id).emit('new-message', newMessage);

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Message handling error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const handleMedia = async (media) => {
    const mediaFile = await MessageMedia.fromUrl(media.url);
    const uploadedUrl = await uploadToCDN(mediaFile);
    return uploadedUrl;
};