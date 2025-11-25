import express from 'express';
import Category from '../../src/models/Category.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    
    res.json(categories.map(c => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      description: c.description || null,
      image_url: c.imageUrl || null,
      created_at: c.createdAt.toISOString(),
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
