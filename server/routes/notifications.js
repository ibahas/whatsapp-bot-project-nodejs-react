const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// الحصول على جميع الإشعارات
router.get('/', auth, async (req, res) => {
    const notifications = await Notification.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .limit(50);
    res.json(notifications);
});

// تحديث حالة الإشعار كمقروء
router.patch('/:id/read', auth, async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
});

// عدد الإشعارات غير المقروءة
router.get('/unread-count', auth, async (req, res) => {
    const count = await Notification.countDocuments({
        user: req.userId,
        read: false
    });
    res.json({ count });
});

module.exports = router;