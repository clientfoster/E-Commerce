import express from 'express';
import Product from '../../src/models/Product.ts';

const router = express.Router();

// Search products
router.get('/products', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, limit = 20 } = req.query;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const query = {
            isActive: true,
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
            ],
        };

        if (category) {
            query.categoryId = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const products = await Product.find(query)
            .populate('categoryId')
            .limit(parseInt(limit))
            .sort({ isFeatured: -1, createdAt: -1 });

        res.json({
            results: products.map(p => ({
                id: p._id.toString(),
                name: p.name,
                slug: p.slug,
                description: p.description || null,
                price: p.price,
                category_id: p.categoryId?._id?.toString() || null,
                category_name: p.categoryId?.name || null,
                images: p.images,
                stock_quantity: p.stockQuantity,
                is_featured: p.isFeatured,
            })),
            total: products.length,
            query: q,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get search suggestions (autocomplete)
router.get('/suggestions', async (req, res) => {
    try {
        const { q, limit = 5 } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json({ suggestions: [] });
        }

        const products = await Product.find({
            isActive: true,
            name: { $regex: q, $options: 'i' },
        })
            .select('name slug')
            .limit(parseInt(limit))
            .sort({ isFeatured: -1 });

        res.json({
            suggestions: products.map(p => ({
                name: p.name,
                slug: p.slug,
            })),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
