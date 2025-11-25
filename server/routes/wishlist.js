import express from 'express';
import Wishlist from '../../src/models/Wishlist.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's wishlist
router.get('/', verifyToken, async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: 'User ID is required' });
        }

        const items = await Wishlist.find({ userId: req.userId }).populate('productId');

        // Filter out items where product was deleted
        const validItems = items.filter(item => item.productId);

        res.json(validItems.map(item => ({
            id: item._id.toString(),
            product_id: item.productId._id.toString(),
            product: {
                name: item.productId.name,
                price: item.productId.price,
                images: item.productId.images,
                slug: item.productId.slug,
                stock_quantity: item.productId.stockQuantity,
            },
            created_at: item.createdAt.toISOString(),
        })));
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

// Add item to wishlist
router.post('/', verifyToken, async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;

        // Validate input
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        if (!userId) {
            return res.status(401).json({ error: 'User ID is required' });
        }

        // Verify product exists
        const Product = (await import('../../src/models/Product.ts')).default;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if item already exists in wishlist
        const existing = await Wishlist.findOne({ userId, productId });
        if (existing) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }

        const item = await Wishlist.create({ userId, productId });
        const populatedItem = await Wishlist.findById(item._id).populate('productId');

        if (!populatedItem.productId) {
            return res.status(404).json({ error: 'Product not found after adding to wishlist' });
        }

        res.json({
            id: populatedItem._id.toString(),
            product_id: populatedItem.productId._id.toString(),
            product: {
                name: populatedItem.productId.name,
                price: populatedItem.productId.price,
                images: populatedItem.productId.images,
                slug: populatedItem.productId.slug,
                stock_quantity: populatedItem.productId.stockQuantity,
            },
            created_at: populatedItem.createdAt.toISOString(),
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: 'Validation failed: ' + errors.join(', ') });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }
        res.status(500).json({ error: 'Failed to add item to wishlist' });
    }
});

// Remove item from wishlist
router.delete('/:itemId', verifyToken, async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: 'User ID is required' });
        }

        const item = await Wishlist.findById(req.params.itemId);

        if (!item) {
            return res.status(404).json({ error: 'Wishlist item not found' });
        }

        // Verify user owns this wishlist item
        if (item.userId.toString() !== req.userId) {
            return res.status(403).json({ error: 'You can only remove from your own wishlist' });
        }

        await Wishlist.findByIdAndDelete(req.params.itemId);
        res.json({ success: true });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid wishlist item ID format' });
        }
        res.status(500).json({ error: 'Failed to remove item from wishlist' });
    }
});

// Clear entire wishlist
router.delete('/', verifyToken, async (req, res) => {
    try {
        await Wishlist.deleteMany({ userId: req.userId });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
