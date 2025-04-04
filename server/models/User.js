const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: { type: String },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => /^[0-9]{10,15}$/.test(v),
      message: 'رقم هاتف غير صالح'
    }
  },
  whatsappSession: {
    clientId: String,
    session: Object,
    qrCode: String,
    status: { type: String, enum: ['pending', 'active', 'expired'], default: 'pending' }
  },
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    expiresAt: Date
  },
  contacts: [{
    phone: String,
    name: String,
    tags: [String],
    lastInteraction: Date
  }]
}, { timestamps: true });

userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ 'subscription.expiresAt': 1 });

module.exports = mongoose.model('User', userSchema);
