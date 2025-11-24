import express from 'express';
import Order from '../../src/models/Order.ts';
import OrderItem from '../../src/models/OrderItem.ts';

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const { userId, totalAmount, shippingAddress, billingAddress, items } = req.body;
    
    const order = await Order.create({
      userId,
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
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    
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
