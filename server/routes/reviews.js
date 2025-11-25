import express from 'express';
import Review from '../../src/models/Review.js';
import Product from '../../src/models/Product.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a specific product
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate('userId', 'fullName email')
            .sort({ createdAt: -1 });

        res.json(reviews.map(r => ({
            id: r._id.toString(),
            product_id: r.productId.toString(),
            user_id: r.userId._id.toString(),
            user_name: r.userId.fullName || r.userId.email,
            rating: r.rating,
            title: r.title || null,
            comment: r.comment || null,
            created_at: r.createdAt.toISOString(),
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit a new review (protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { productId, rating, title, comment } = req.body;

        if (!productId || !rating) {
            return res.status(400).json({ error: 'Product ID and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            userId: req.userId,
            productId,
        });

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        const review = await Review.create({
            userId: req.userId,
            productId,
            rating,
            title,
            comment,
        });

        const populatedReview = await Review.findById(review._id).populate('userId', 'fullName email');

        res.json({
            id: populatedReview._id.toString(),
            product_id: populatedReview.productId.toString(),
            user_id: populatedReview.userId._id.toString(),
            user_name: populatedReview.userId.fullName || populatedReview.userId.email,
            rating: populatedReview.rating,
            title: populatedReview.title || null,
            comment: populatedReview.comment || null,
            created_at: populatedReview.createdAt.toISOString(),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update own review (protected)
router.put('/:reviewId', verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if user owns this review
        if (review.userId.toString() !== req.userId) {
            return res.status(403).json({ error: 'You can only update your own reviews' });
        }

        const { rating, title, comment } = req.body;

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        if (rating) review.rating = rating;
        if (title !== undefined) review.title = title;
        if (comment !== undefined) review.comment = comment;

        await review.save();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete own review (protected)
router.delete('/:reviewId', verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if user owns this review
        if (review.userId.toString() !== req.userId) {
            return res.status(403).json({ error: 'You can only delete your own reviews' });
        }

        await Review.findByIdAndDelete(req.params.reviewId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
