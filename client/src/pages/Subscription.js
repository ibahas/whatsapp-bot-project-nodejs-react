import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import Button from '../components/Button';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Subscription = () => {
    const [plan, setPlan] = useState('basic');

    const handleSubscribe = async () => {
        const stripe = await stripePromise;

        const { data } = await axios.post('/api/payment/create-subscription', {
            plan
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        await stripe.redirectToCheckout({
            sessionId: data.sessionId
        });
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">اختر خطة الاشتراك</h2>

            <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="plan"
                            value="basic"
                            checked={plan === 'basic'}
                            onChange={(e) => setPlan(e.target.value)}
                        />
                        <span className="font-medium">الباقة الأساسية ($10/شهر)</span>
                    </label>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="plan"
                            value="premium"
                            checked={plan === 'premium'}
                            onChange={(e) => setPlan(e.target.value)}
                        />
                        <span className="font-medium">الباقة المميزة ($25/شهر)</span>
                    </label>
                </div>

                <Button onClick={handleSubscribe} className="w-full">
                    اشترك الآن
                </Button>
            </div>
        </div>
    );
};

export default Subscription;