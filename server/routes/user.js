// server/routes/user.js
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
});

router.patch('/update', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['phone', 'subscription'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'تحديثات غير مسموحة' });
    }

    const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
    res.json(user);
});