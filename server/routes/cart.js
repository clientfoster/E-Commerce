import express from 'express';
import CartItem from '../../src/models/CartItem.js';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Apply middleware to all routes
router.use(verifyToken);

// Get cart
router.get('/', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const items = await CartItem.find({ userId: req.userId }).populate('productId');

    // Filter out items where product was deleted
    const validItems = items.filter(item => item.productId);

    res.json(validItems.map(item => ({
      id: item._id.toString(),
      product_id: item.productId._id.toString(),
      quantity: item.quantity,
      size: item.size || null,
      color: item.color || null,
      material: item.material || null,
      product: {
        name: item.productId.name,
        price: item.productId.price,
        images: item.productId.images,
        slug: item.productId.slug,
      },
    })));
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart items: ' + error.message });
  }
});

// Add to cart
router.post('/', async (req, res) => {
  try {
    // Validate userId from token
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Debug log
    console.log('User ID from token:', req.userId);
    
    const { productId, quantity, size, color, material } = req.body;

    // Validate required fields
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    // Verify product exists
    const Product = (await import('../../src/models/Product.ts')).default;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check stock availability
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ 
        error: `Only ${product.stockQuantity} items available in stock` 
      });
    }

    // Debug log
    console.log('Creating cart item with data:', {
      userId: req.userId,
      productId,
      quantity,
      size,
      color,
      material,
    });
    
    const item = await CartItem.create({
      userId: req.userId,
      productId,
      quantity,
      size,
      color,
      material,
    });
    
    console.log('Cart item created successfully:', item._id);

    const populatedItem = await CartItem.findById(item._id).populate('productId');
    
    if (!populatedItem || !populatedItem.productId) {
      return res.status(404).json({ error: 'Product not found after adding to cart' });
    }

    res.json({
      id: populatedItem._id.toString(),
      product_id: populatedItem.productId._id.toString(),
      quantity: populatedItem.quantity,
      size: populatedItem.size || null,
      color: populatedItem.color || null,
      material: populatedItem.material || null,
      product: {
        name: populatedItem.productId.name,
        price: populatedItem.productId.price,
        images: populatedItem.productId.images,
        slug: populatedItem.productId.slug,
      },
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed: ' + errors.join(', ') });
    }
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Item already exists in cart' });
    }
    res.status(500).json({ error: 'Failed to add item to cart: ' + error.message });
  }
});

// Update quantity
router.put('/:itemId', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const { quantity } = req.body;
    
    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    const item = await CartItem.findOne({ _id: req.params.itemId, userId: req.userId });
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Check stock availability if product still exists
    const Product = (await import('../../src/models/Product.ts')).default;
    const product = await Product.findById(item.productId);
    if (product && product.stockQuantity < quantity) {
      return res.status(400).json({ 
        error: `Only ${product.stockQuantity} items available in stock` 
      });
    }

    await CartItem.findByIdAndUpdate(req.params.itemId, { quantity });
    res.json({ success: true });
  } catch (error) {
    console.error('Update cart quantity error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid item ID format' });
    }
    res.status(500).json({ error: 'Failed to update cart item quantity: ' + error.message });
  }
});

// Remove item
router.delete('/:itemId', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const item = await CartItem.findOne({ _id: req.params.itemId, userId: req.userId });
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await CartItem.findByIdAndDelete(req.params.itemId);
    res.json({ success: true });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Failed to remove cart item: ' + error.message });
  }
});

// Clear cart
router.delete('/', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    await CartItem.deleteMany({ userId: req.userId });
    res.json({ success: true });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart: ' + error.message });
  }
});

export default router;
