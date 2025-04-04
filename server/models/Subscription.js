const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['basic', 'premium'], default: 'basic' },
    status: { type: String, enum: ['active', 'canceled'], default: 'active' },
    renewalDate: Date,
    stripeSubscriptionId: String
});
module.exports = mongoose.model('Subscription', subscriptionSchema);

