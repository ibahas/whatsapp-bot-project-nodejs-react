require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);
const router = express.Router();
const auth = require('./middleware/auth');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100 // 100 طلب لكل IP
});

io.on('connection', (socket) => {
    socket.on('subscribe', (userId) => {
        socket.join(`user_${userId}`);
    });
});


// أعلى الملف
const whatsappClient = require('./services/whatsapp');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middlewares
app.use(cors(), limiter);
app.use(express.json());

// أضف هذا الجزء قبل تشغيل السيرفر
whatsappClient.on('message', msg => {
    console.log('Received message:', msg.body);
});
router.get('/stats/:messageId', async (req, res) => {
    const stats = await Message.aggregate([
        { $match: { _id: req.params.messageId } },
        {
            $lookup: {
                from: 'interactions',
                localField: '_id',
                foreignField: 'message',
                as: 'interactions'
            }
        }
    ]);
    res.json(stats);
});
router.get('/stats', auth, async (req, res) => {
    const campaigns = await Campaign.countDocuments({ user: req.userId });

    const messagesSent = await Message.countDocuments({
        user: req.userId,
        status: 'sent'
    });

    const messagesRead = await Message.countDocuments({
        user: req.userId,
        status: 'read'
    });

    const engagementRate = ((messagesRead / messagesSent) * 100).toFixed(2);

    const dailyStats = await Message.aggregate([
        { $match: { user: req.userId } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
        { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

    res.json({
        campaigns,
        messagesSent,
        engagementRate,
        data: dailyStats
    });
});

io.on('typing', (chatId) => {
    io.to(chatId).emit('user-typing', userId);
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));