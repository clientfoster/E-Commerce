import express from 'express';
import Coupon from '../../src/models/Coupon.ts';

const router = express.Router();

// Validate coupon code
router.post('/validate', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code || typeof code !== 'string' || code.trim().length === 0) {
            return res.status(400).json({ error: 'Coupon code is required' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

        if (!coupon) {
            return res.status(404).json({ error: 'Invalid coupon code' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ error: 'This coupon is no longer active' });
        }

        const now = new Date();
        if (coupon.startDate && now < coupon.startDate) {
            return res.status(400).json({ error: 'This coupon is not yet valid' });
        }

        if (coupon.endDate && now > coupon.endDate) {
            return res.status(400).json({ error: 'This coupon has expired' });
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ error: 'This coupon has reached its usage limit' });
        }

        res.json({
            valid: true,
            coupon: {
                id: coupon._id.toString(),
                code: coupon.code,
                discount_type: coupon.discountType,
                discount_value: coupon.discountValue,
                min_purchase: coupon.minimumAmount || 0,
                max_discount: coupon.maximumDiscount || null,
            },
        });
    } catch (error) {
        console.error('Validate coupon error:', error);
        res.status(500).json({ error: 'Failed to validate coupon' });
    }
});

// Apply coupon (increment usage count)
router.post('/apply', async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        if (!code || !orderAmount) {
            return res.status(400).json({ error: 'Coupon code and order amount are required' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon || !coupon.isActive) {
            return res.status(400).json({ error: 'Invalid coupon code' });
        }

        // Check minimum purchase requirement
        if (coupon.minimumAmount && orderAmount < coupon.minimumAmount) {
            return res.status(400).json({
                error: `Minimum purchase of $${coupon.minimumAmount} required`
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (orderAmount * coupon.discountValue) / 100;
            if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
                discountAmount = coupon.maximumDiscount;
            }
        } else {
            discountAmount = coupon.discountValue;
        }

        // Increment usage count
        coupon.usedCount += 1;
        await coupon.save();

        res.json({
            success: true,
            discount_amount: discountAmount,
            final_amount: orderAmount - discountAmount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
