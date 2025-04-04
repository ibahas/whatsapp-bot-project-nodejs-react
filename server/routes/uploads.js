// routes/uploads.js
const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
    res.json({ url: `/uploads/${req.file.filename}` });
});

// الواجهة
const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axios.post('/api/upload', formData);
    socket.current.emit('send-message', {
        to: contact,
        message: data.url,
        type: 'file'
    });
};