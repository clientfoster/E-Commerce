import express from 'express';
import Stripe from 'stripe';
import Order from '../../src/models/Order.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16',
});

// Create payment intent
router.post('/create-intent', verifyToken, async (req, res) => {
    try {
        const { amount, currency = 'usd', orderId } = req.body;

        if (!amount || amount < 50) {
            return res.status(400).json({ error: 'Minimum payment amount is $0.50' });
        }

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            metadata: {
                userId: req.userId,
                orderId: orderId || 'pending',
            },
        });

        // Update order with payment intent ID if orderId provided
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                stripePaymentIntentId: paymentIntent.id,
            });
        }

        res.json({
            client_secret: paymentIntent.client_secret,
            payment_intent_id: paymentIntent.id,
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Confirm payment
router.post('/confirm', verifyToken, async (req, res) => {
    try {
        const { paymentIntentId, orderId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ error: 'Payment intent ID is required' });
        }

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update order status to paid
            if (orderId) {
                await Order.findByIdAndUpdate(orderId, {
                    status: 'paid',
                    stripePaymentIntentId: paymentIntentId,
                });
            }

            res.json({
                success: true,
                status: 'succeeded',
                amount: paymentIntent.amount / 100,
            });
        } else {
            res.json({
                success: false,
                status: paymentIntent.status,
            });
        }
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get payment status
router.get('/status/:intentId', verifyToken, async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(req.params.intentId);

        res.json({
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            created: new Date(paymentIntent.created * 1000).toISOString(),
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint for Stripe events (for production)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return res.status(400).send('Webhook secret not configured');
    }

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('PaymentIntent succeeded:', paymentIntent.id);

                // Update order status
                if (paymentIntent.metadata.orderId) {
                    await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
                        status: 'paid',
                    });
                }
                break;

            case 'payment_intent.payment_failed':
                console.log('PaymentIntent failed:', event.data.object.id);
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

export default router;
