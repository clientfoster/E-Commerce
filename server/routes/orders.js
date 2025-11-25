import express from 'express';
import Order from '../../src/models/Order.ts';
import OrderItem from '../../src/models/OrderItem.ts';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Apply middleware to all routes
router.use(verifyToken);

// Create order
router.post('/', async (req, res) => {
  try {
    const { totalAmount, shippingAddress, billingAddress, items } = req.body;

    // Validate required fields
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid order amount' });
    }
    if (!shippingAddress || !billingAddress) {
      return res.status(400).json({ error: 'Shipping and billing addresses are required' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Validate each order item
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: 'Invalid order item data' });
      }
      
      // Verify product exists and is active
      const Product = (await import('../../src/models/Product.ts')).default;
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      if (!product.isActive) {
        return res.status(400).json({ error: `Product ${product.name} is no longer available` });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Only ${product.stockQuantity} available` 
        });
      }
    }

    const order = await Order.create({
      userId: req.userId,
      status: 'pending',
      totalAmount,
      shippingAddress,
      billingAddress,
    });

    await OrderItem.insertMany(
      items.map(item => ({
        orderId: order._id,
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        material: item.material,
        priceAtTime: item.priceAtTime,
      }))
    );

    res.json({
      id: order._id.toString(),
      user_id: order.userId.toString(),
      status: order.status,
      total_amount: order.totalAmount,
      shipping_address: order.shippingAddress,
      billing_address: order.billingAddress,
      created_at: order.createdAt.toISOString(),
      updated_at: order.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Create order error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed: ' + errors.join(', ') });
    }
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).populate('productId');

        return {
          id: order._id.toString(),
          status: order.status,
          total_amount: order.totalAmount,
          created_at: order.createdAt.toISOString(),
          order_items: items.map(item => ({
            quantity: item.quantity,
            price_at_time: item.priceAtTime,
            products: item.productId ? {
              name: item.productId.name,
              images: item.productId.images,
            } : null,
          })),
        };
      })
    );

    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
