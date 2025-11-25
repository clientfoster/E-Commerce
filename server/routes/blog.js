import express from 'express';
import Blog from '../../src/models/Blog.js';

const router = express.Router();

// Get all published blogs
router.get('/', async (req, res) => {
  try {
    const { category, tag, limit } = req.query;
    
    const query = { isPublished: true };
    if (category) query.category = category;
    if (tag) query.tags = tag;

    let blogsQuery = Blog.find(query).sort({ createdAt: -1 });
    if (limit) blogsQuery = blogsQuery.limit(parseInt(limit));

    const blogs = await blogsQuery;
    
    res.json(blogs.map(b => ({
      id: b._id.toString(),
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      cover_image: b.coverImage,
      author: b.author,
      category: b.category,
      tags: b.tags,
      views: b.views,
      created_at: b.createdAt.toISOString(),
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.json({
      id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      cover_image: blog.coverImage,
      author: blog.author,
      category: blog.category,
      tags: blog.tags,
      views: blog.views,
      created_at: blog.createdAt.toISOString(),
      updated_at: blog.updatedAt.toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get blog categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { isPublished: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get popular blogs
router.get('/meta/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const blogs = await Blog.find({ isPublished: true })
      .sort({ views: -1 })
      .limit(limit);
    
    res.json(blogs.map(b => ({
      id: b._id.toString(),
      title: b.title,
      slug: b.slug,
      cover_image: b.coverImage,
      views: b.views,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
