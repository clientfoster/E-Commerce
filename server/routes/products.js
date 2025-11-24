import express from 'express';
import Product from '../../src/models/Product.ts';

const router = express.Router();

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { categoryId, isActive, isFeatured, limit, page = 1 } = req.query;
    
    const query = {};
    if (categoryId) query.categoryId = categoryId;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

    const limitNum = parseInt(limit) || 12;
    const pageNum = parseInt(page) || 1;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limitNum),
      Product.countDocuments(query)
    ]);
    
    res.json({
      products: products.map(p => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        description: p.description || null,
        price: p.price,
        category_id: p.categoryId?.toString() || null,
        images: p.images,
        model_url: p.modelUrl || null,
        sizes: p.sizes,
        colors: p.colors,
        materials: p.materials,
        stock_quantity: p.stockQuantity,
        is_featured: p.isFeatured,
        is_active: p.isActive,
        created_at: p.createdAt.toISOString(),
        updated_at: p.updatedAt.toISOString(),
      })),
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description || null,
      price: product.price,
      category_id: product.categoryId?.toString() || null,
      images: product.images,
      model_url: product.modelUrl || null,
      sizes: product.sizes,
      colors: product.colors,
      materials: product.materials,
      stock_quantity: product.stockQuantity,
      is_featured: product.isFeatured,
      is_active: product.isActive,
      created_at: product.createdAt.toISOString(),
      updated_at: product.updatedAt.toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
