const mongoose = require('mongoose');

const numberSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    number: { type: String, required: true },
    isValid: { type: Boolean, default: false },
    lastChecked: Date
});

module.exports = mongoose.model('Number', numberSchema);