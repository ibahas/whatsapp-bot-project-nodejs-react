const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/Subscription');

router.post('/create-subscription', async (req, res) => {
    const { paymentMethodId, plan } = req.body;
    try {
        const customer = await stripe.customers.create({
            payment_method: paymentMethodId,
            invoice_settings: { default_payment_method: paymentMethodId }
        });

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: process.env[`STRIPE_${plan.toUpperCase()}_PRICE_ID`] }],
            expand: ['latest_invoice.payment_intent']
        });
        await Subscription.create({
            user: req.userId,
            plan,
            stripeSubscriptionId: subscription.id,
            renewalDate: new Date(subscription.current_period_end * 1000)
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

