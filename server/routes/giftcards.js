import express from 'express';
import GiftCard from '../../src/models/GiftCard.ts';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Generate random gift card code
function generateGiftCardCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) code += '-';
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Purchase a gift card
router.post('/purchase', verifyToken, async (req, res) => {
    try {
        const { amount, recipientEmail, recipientName, message } = req.body;

        if (!amount || amount < 10) {
            return res.status(400).json({ error: 'Minimum gift card amount is $10' });
        }

        if (amount > 1000) {
            return res.status(400).json({ error: 'Maximum gift card amount is $1000' });
        }

        // Generate unique code
        let code;
        let isUnique = false;
        while (!isUnique) {
            code = generateGiftCardCode();
            const existing = await GiftCard.findOne({ code });
            if (!existing) isUnique = true;
        }

        const giftCard = await GiftCard.create({
            code,
            initialAmount: amount,
            currentBalance: amount,
            purchasedBy: req.userId,
            recipientEmail,
            recipientName,
            message,
            isActive: true,
        });

        res.json({
            success: true,
            gift_card: {
                id: giftCard._id.toString(),
                code: giftCard.code,
                amount: giftCard.initialAmount,
                balance: giftCard.currentBalance,
                recipient_email: giftCard.recipientEmail || null,
                recipient_name: giftCard.recipientName || null,
                message: giftCard.message || null,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Validate gift card
router.post('/validate', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Gift card code is required' });
        }

        const giftCard = await GiftCard.findOne({ code: code.toUpperCase() });

        if (!giftCard) {
            return res.status(404).json({ error: 'Invalid gift card code' });
        }

        if (!giftCard.isActive) {
            return res.status(400).json({ error: 'This gift card is no longer active' });
        }

        if (giftCard.expiresAt && new Date() > giftCard.expiresAt) {
            return res.status(400).json({ error: 'This gift card has expired' });
        }

        if (giftCard.currentBalance <= 0) {
            return res.status(400).json({ error: 'This gift card has no remaining balance' });
        }

        // Update isRedeemed if balance is zero
        if (giftCard.currentBalance === 0) {
            giftCard.isRedeemed = true;
            giftCard.redeemedAt = new Date();
        }

        res.json({
            valid: true,
            balance: giftCard.currentBalance,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Redeem gift card
router.post('/redeem', async (req, res) => {
    try {
        const { code, amount } = req.body;

        if (!code || !amount) {
            return res.status(400).json({ error: 'Gift card code and amount are required' });
        }

        const giftCard = await GiftCard.findOne({ code: code.toUpperCase() });

        if (!giftCard || !giftCard.isActive) {
            return res.status(400).json({ error: 'Invalid gift card code' });
        }

        if (giftCard.currentBalance < amount) {
            return res.status(400).json({
                error: `Insufficient balance. Available: $${giftCard.currentBalance}`
            });
        }

        // Deduct amount from balance
        giftCard.currentBalance -= amount;

        // Deactivate if balance is zero
        if (giftCard.currentBalance === 0) {
            giftCard.isActive = false;
        }

        await giftCard.save();

        res.json({
            success: true,
            redeemed_amount: amount,
            remaining_balance: giftCard.currentBalance,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check gift card balance
router.get('/balance/:code', async (req, res) => {
    try {
        const giftCard = await GiftCard.findOne({ code: req.params.code.toUpperCase() });

        if (!giftCard) {
            return res.status(404).json({ error: 'Invalid gift card code' });
        }

        res.json({
            code: giftCard.code,
            balance: giftCard.currentBalance,
            initial_amount: giftCard.initialAmount,
            is_active: giftCard.isActive,
            expires_at: giftCard.expiresAt ? giftCard.expiresAt.toISOString() : null,
            is_redeemed: giftCard.isRedeemed || false,
        });
    } catch (error) {
        console.error('Get gift card balance error:', error);
        res.status(500).json({ error: 'Failed to get gift card balance' });
    }
});

// Get user's purchased gift cards (protected)
router.get('/my-cards', verifyToken, async (req, res) => {
    try {
        const giftCards = await GiftCard.find({ purchasedBy: req.userId })
            .sort({ createdAt: -1 });

        res.json(giftCards.map(card => ({
            _id: card._id.toString(),
            code: card.code,
            amount: card.initialAmount,
            balance: card.currentBalance,
            recipient_email: card.recipientEmail || null,
            recipient_name: card.recipientName || null,
            message: card.message || null,
            expires_at: card.expiresAt ? card.expiresAt.toISOString() : null,
            is_redeemed: card.isRedeemed || false,
            is_active: card.isActive,
            created_at: card.createdAt.toISOString(),
        })));
    } catch (error) {
        console.error('Get user gift cards error:', error);
        res.status(500).json({ error: 'Failed to fetch gift cards' });
    }
});

export default router;
