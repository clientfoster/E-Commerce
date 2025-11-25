import express from 'express';
import Product from '../../src/models/Product.ts';
import Order from '../../src/models/Order.ts';
import OrderItem from '../../src/models/OrderItem.ts';
import User from '../../src/models/User.ts';
import Blog from '../../src/models/Blog.ts';
import SiteSettings from '../../src/models/SiteSettings.ts';
import Category from '../../src/models/Category.ts';
import Review from '../../src/models/Review.ts';

const router = express.Router();
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

// Admin setup - Create first super admin
router.post('/setup', async (req, res) => {
  try {
    const { email, password, fullName, secretKey } = req.body;

    // Verify secret key
    if (secretKey !== 'ATELIER_ADMIN_SETUP_2024') {
      return res.status(403).json({ error: 'Invalid secret key' });
    }

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin setup already completed' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create super admin
    const admin = await User.create({
      email,
      password,
      fullName,
      isAdmin: true,
    });

    res.json({
      success: true,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        fullName: admin.fullName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stats
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [productsCount, ordersCount, usersCount, blogsCount] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Blog.countDocuments(),
    ]);

    res.json({
      products: productsCount,
      orders: ordersCount,
      users: usersCount,
      blogs: blogsCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products
router.get('/products', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId').sort({ createdAt: -1 });

    res.json(products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      description: p.description || null,
      price: p.price,
      category_id: p.categoryId?._id?.toString() || null,
      category_name: p.categoryId?.name || null,
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
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/products/:productId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.productId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/products/:productId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
router.post('/products', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders
router.get('/orders', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId').sort({ createdAt: -1 });

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).populate('productId');

        return {
          id: order._id.toString(),
          user_id: order.userId._id.toString(),
          user_email: order.userId.email,
          user_name: order.userId.fullName || 'N/A',
          status: order.status,
          total_amount: order.totalAmount,
          shipping_address: order.shippingAddress,
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

// Update order status
router.put('/orders/:orderId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updateData = { status: req.body.status };
    if (req.body.status === 'delivered') {
      updateData.deliveredAt = new Date();
      // Set return window to 7 days from now
      const returnWindow = new Date();
      returnWindow.setDate(returnWindow.getDate() + 7);
      updateData.returnWindowClosedAt = returnWindow;
    }
    await Order.findByIdAndUpdate(req.params.orderId, updateData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json(users.map(u => ({
      id: u._id.toString(),
      email: u.email,
      full_name: u.fullName || null,
      avatar_url: u.avatarUrl || null,
      is_admin: u.isAdmin,
      created_at: u.createdAt.toISOString(),
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle user admin
router.put('/users/:userId/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { isAdmin: req.body.isAdmin });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:userId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== BLOG MANAGEMENT ==========

// Get all blogs (including unpublished)
router.get('/blogs', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs.map(b => ({
      id: b._id.toString(),
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      cover_image: b.coverImage,
      author: b.author,
      category: b.category,
      tags: b.tags,
      is_published: b.isPublished,
      views: b.views,
      created_at: b.createdAt.toISOString(),
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create blog
router.post('/blogs', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json({ success: true, id: blog._id.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update blog
router.put('/blogs/:blogId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.blogId, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete blog
router.delete('/blogs/:blogId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.blogId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle blog publish status
router.put('/blogs/:blogId/publish', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, is_published: blog.isPublished });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== SITE SETTINGS ==========

// Get site settings
router.get('/settings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    res.json({
      id: settings._id.toString(),
      site_name: settings.siteName,
      site_description: settings.siteDescription,
      logo: settings.logo,
      favicon: settings.favicon,
      contact_email: settings.contactEmail,
      contact_phone: settings.contactPhone,
      address: settings.address,
      social_media: settings.socialMedia,
      email_settings: settings.emailSettings,
      seo: settings.seo,
      shipping: settings.shipping,
      currency: settings.currency,
      maintenance: settings.maintenance,
      updated_at: settings.updatedAt.toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update site settings
router.put('/settings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    res.json({
      success: true,
      settings: {
        id: settings._id.toString(),
        site_name: settings.siteName,
        site_description: settings.siteDescription,
        updated_at: settings.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== CATEGORY MANAGEMENT ==========

// Get all categories
router.get('/categories', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories.map(c => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      description: c.description || null,
      image_url: c.imageUrl || null,
      created_at: c.createdAt.toISOString(),
    })));
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create category
router.post('/categories', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json({
      success: true,
      category: {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description || null,
        image_url: category.imageUrl || null,
        created_at: category.createdAt.toISOString(),
      }
    });
  } catch (error) {
    console.error('Category creation error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed: ' + errors.join(', ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A category with this slug already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update category
router.put('/categories/:categoryId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      success: true,
      category: {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description || null,
        image_url: category.imageUrl || null,
        created_at: category.createdAt.toISOString(),
      }
    });
  } catch (error) {
    console.error('Category update error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed: ' + errors.join(', ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A category with this slug already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete category
router.delete('/categories/:categoryId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Category deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== REVIEW MANAGEMENT ==========

// Get all reviews
router.get('/reviews', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reviews = await Review.find().populate('userId').populate('productId').sort({ createdAt: -1 });

    res.json(reviews.map(r => ({
      id: r._id.toString(),
      product_id: r.productId._id.toString(),
      product_name: r.productId.name,
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

// Delete review
router.delete('/reviews/:reviewId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
