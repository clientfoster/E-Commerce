import express from 'express';
import Newsletter from '../../src/models/Newsletter.js';

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if already subscribed
        const existing = await Newsletter.findOne({ email: email.toLowerCase() });

        if (existing) {
            if (existing.isActive) {
                return res.status(400).json({ error: 'This email is already subscribed' });
            } else {
                // Reactivate subscription
                existing.isActive = true;
                await existing.save();
                return res.json({
                    success: true,
                    message: 'Subscription reactivated successfully'
                });
            }
        }

        const subscription = await Newsletter.create({
            email: email.toLowerCase(),
            name,
            isActive: true,
        });

        res.json({
            success: true,
            message: 'Successfully subscribed to newsletter',
            subscription: {
                id: subscription._id.toString(),
                email: subscription.email,
                name: subscription.name,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const subscription = await Newsletter.findOne({ email: email.toLowerCase() });

        if (!subscription) {
            return res.status(404).json({ error: 'Email not found in newsletter list' });
        }

        subscription.isActive = false;
        await subscription.save();

        res.json({
            success: true,
            message: 'Successfully unsubscribed from newsletter',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check subscription status
router.get('/status/:email', async (req, res) => {
    try {
        const subscription = await Newsletter.findOne({
            email: req.params.email.toLowerCase()
        });

        if (!subscription) {
            return res.json({ subscribed: false });
        }

        res.json({
            subscribed: subscription.isActive,
            email: subscription.email,
            name: subscription.name,
            subscribed_at: subscription.createdAt ? subscription.createdAt.toISOString() : null,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
