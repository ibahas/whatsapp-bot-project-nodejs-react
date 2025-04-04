const mongoose = require('mongoose');
const AI = require('../utils/ai-helper');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  template: {
    text: String,
    buttons: [{
      type: { type: String, enum: ['reply', 'url'] },
      title: String,
      payload: String
    }]
  },
  recipients: [{
    phone: String,
    status: { 
      type: String, 
      enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
      default: 'pending'
    }
  }],
  analytics: {
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    read: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 }
  },
  aiGenerated: { type: Boolean, default: false }
}, { timestamps: true });

// Middleware لتوليد النصوص بالذكاء الاصطناعي
campaignSchema.pre('save', async function(next) {
  if (this.isModified('template') && !this.template.text) {
    this.template.text = await AI.generateCampaignText(this);
    this.aiGenerated = true;
  }
  next();
});

module.exports = mongoose.model('Campaign', campaignSchema);