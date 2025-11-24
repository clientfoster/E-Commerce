import express from 'express';
import CartItem from '../../src/models/CartItem.ts';

const router = express.Router();

// Get cart
router.get('/:userId', async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.params.userId }).populate('productId');
    
    res.json(items.map(item => ({
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
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
router.post('/', async (req, res) => {
  try {
    const { userId, productId, quantity, size, color, material } = req.body;
    
    const item = await CartItem.create({
      userId,
      productId,
      quantity,
      size,
      color,
      material,
    });

    const populatedItem = await CartItem.findById(item._id).populate('productId');
    
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
    res.status(500).json({ error: error.message });
  }
});

// Update quantity
router.put('/:itemId', async (req, res) => {
  try {
    await CartItem.findByIdAndUpdate(req.params.itemId, { quantity: req.body.quantity });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item
router.delete('/:itemId', async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.itemId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.delete('/user/:userId', async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.params.userId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
