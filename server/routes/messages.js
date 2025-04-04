const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const { whatsappClient } = require('../services/whatsapp');

// إرسال رسالة
router.post('/send', auth, async (req, res) => {
    try {
        const { message, numbers, buttons } = req.body;

        for (const number of numbers) {
            // التحقق من صحة الرقم
            const isValid = await whatsappClient.isRegisteredUser(number);
            if (!isValid) {
                continue; // أو تسجيل خطأ
            }

            // إرسال الرسالة مع أزرار
            await whatsappClient.sendMessage(number, {
                text: message,
                buttons: buttons.map(btn => ({ id: btn.id, text: btn.text }))
            });

            // حفظ في قاعدة البيانات
            const newMsg = new Message({
                user: req.userId,
                number,
                content: message,
                status: 'sent'
            });
            await newMsg.save();
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/', auth, (req, res) => {
    res.json({ messages: [] });
});
router.post('/broadcast', async (req, res) => {
    const { message, users } = req.body;

    users.forEach(async (user) => {
        await whatsappClient.sendMessage(user.phone, message);
    });

    res.json({ success: true });
});