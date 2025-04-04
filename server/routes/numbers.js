const XLSX = require('xlsx');
const express = require('express');
const router = express.Router();
const Number = require('../models/Number');
const { whatsappClient } = require('../services/whatsapp');

router.post('/upload', async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'لم يتم رفع ملف' });
    }

    const workbook = XLSX.read(req.files.file.data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const numbers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        .flat()
        .filter(num => num.toString().match(/^\d+$/));

    // التحقق من صحة الأرقام وحفظها
    const validatedNumbers = await Promise.all(
        numbers.map(async (number) => {
            const isValid = await whatsappClient.isRegisteredUser(number);
            return { number, isValid };
        })
    );

    await Number.insertMany(validatedNumbers);
    res.json({ numbers: validatedNumbers });
});

// حذف جميع الأرقام
router.delete('/', auth, async (req, res) => {
    await Number.deleteMany({ user: req.userId });
    res.json({ success: true });
});