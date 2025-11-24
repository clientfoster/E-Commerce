import mongoose from 'mongoose';
import Blog from '../src/models/Blog.ts';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.VITE_MONGODB_URI;

const sampleBlogs = [
  {
    title: 'The Art of Minimalist Fashion',
    slug: 'art-of-minimalist-fashion',
    excerpt: 'Discover how less is more when it comes to building a timeless wardrobe that speaks volumes.',
    content: `
      <h2>Introduction</h2>
      <p>Minimalist fashion isn't just about owning fewer clothes—it's about making intentional choices that reflect your personal style while maintaining versatility and quality.</p>
      
      <h2>Key Principles</h2>
      <p>The foundation of minimalist fashion lies in understanding what works for you. Start by identifying your core colors, preferred silhouettes, and the lifestyle you lead.</p>
      
      <h2>Building Your Capsule Wardrobe</h2>
      <p>A capsule wardrobe typically consists of 30-40 pieces that can be mixed and matched to create endless outfit combinations. Focus on quality over quantity, investing in well-made pieces that will last for years.</p>
      
      <h2>Sustainable Choices</h2>
      <p>Minimalism and sustainability go hand in hand. By choosing timeless pieces and caring for them properly, you reduce waste and contribute to a more sustainable fashion industry.</p>
    `,
    coverImage: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    category: 'Style Guide',
    tags: ['minimalism', 'fashion', 'wardrobe', 'sustainability'],
    isPublished: true,
    views: 234,
  },
  {
    title: 'Spring/Summer 2025 Trends',
    slug: 'spring-summer-2025-trends',
    excerpt: 'Get ahead of the curve with our comprehensive guide to the hottest trends for the upcoming season.',
    content: `
      <h2>Color Palette</h2>
      <p>This season brings a fresh perspective with soft pastels mixing with bold, vibrant hues. Think lavender, mint green, and sunset orange creating unexpected but harmonious combinations.</p>
      
      <h2>Silhouettes to Watch</h2>
      <p>Oversized blazers continue to dominate, while fluid, feminine dresses make a strong comeback. The key is balancing proportions and creating visual interest through layering.</p>
      
      <h2>Sustainable Materials</h2>
      <p>Eco-conscious fashion takes center stage with innovative fabrics made from recycled materials and organic fibers. Brands are increasingly transparent about their supply chains.</p>
      
      <h2>Must-Have Pieces</h2>
      <p>Invest in a statement blazer, wide-leg trousers, and versatile midi dresses that can transition from day to night effortlessly.</p>
    `,
    coverImage: 'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg',
    author: {
      name: 'Emma Davis',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    category: 'Trends',
    tags: ['trends', 'spring', 'summer', '2025', 'fashion-week'],
    isPublished: true,
    views: 567,
  },
  {
    title: 'Caring for Your Premium Fabrics',
    slug: 'caring-for-premium-fabrics',
    excerpt: 'Learn the essential techniques to maintain the quality and longevity of your investment pieces.',
    content: `
      <h2>Understanding Fabric Types</h2>
      <p>Different fabrics require different care approaches. Silk, wool, cashmere, and linen each have unique properties that demand specific handling.</p>
      
      <h2>Washing Guidelines</h2>
      <p>Always read care labels carefully. When in doubt, hand washing in cold water with gentle detergent is often the safest option for delicate fabrics.</p>
      
      <h2>Storage Solutions</h2>
      <p>Proper storage extends the life of your garments. Use padded hangers for structured pieces, fold knitwear to prevent stretching, and store in breathable garment bags.</p>
      
      <h2>Professional Care</h2>
      <p>Some pieces are worth the investment in professional cleaning. Find a reputable dry cleaner who specializes in luxury fabrics.</p>
    `,
    coverImage: 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg',
    author: {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    category: 'Care Guide',
    tags: ['fabric-care', 'maintenance', 'luxury', 'sustainability'],
    isPublished: true,
    views: 189,
  },
  {
    title: 'The Evolution of Sustainable Fashion',
    slug: 'evolution-of-sustainable-fashion',
    excerpt: 'From niche movement to mainstream revolution—how sustainable fashion is reshaping the industry.',
    content: `
      <h2>Historical Context</h2>
      <p>Sustainable fashion has evolved from a small movement of conscious consumers to a major force reshaping the entire industry.</p>
      
      <h2>Current Innovations</h2>
      <p>Technology plays a crucial role with innovations like lab-grown leather, recycled ocean plastics, and biodegradable fabrics leading the way.</p>
      
      <h2>Consumer Impact</h2>
      <p>Your purchasing decisions matter. Supporting brands committed to sustainability sends a powerful message to the industry.</p>
      
      <h2>The Future</h2>
      <p>The next decade will see even more radical changes as circular fashion models, rental services, and zero-waste design become the norm.</p>
    `,
    coverImage: 'https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg',
    author: {
      name: 'Olivia Martinez',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    category: 'Sustainability',
    tags: ['sustainability', 'eco-friendly', 'future', 'innovation'],
    isPublished: true,
    views: 412,
  },
  {
    title: 'Accessorizing Like a Pro',
    slug: 'accessorizing-like-a-pro',
    excerpt: 'Master the art of accessories and transform simple outfits into stunning ensembles.',
    content: `
      <h2>The Power of Accessories</h2>
      <p>Accessories can completely transform an outfit. The right pieces add personality, create focal points, and elevate even the simplest looks.</p>
      
      <h2>Building Your Collection</h2>
      <p>Start with versatile classics: a quality watch, statement earrings, a leather belt, and a structured bag. These form the foundation of endless styling possibilities.</p>
      
      <h2>Mixing Metals and Textures</h2>
      <p>Don't be afraid to mix gold and silver, or combine different textures. The key is maintaining balance and ensuring pieces complement rather than compete.</p>
      
      <h2>Seasonal Updates</h2>
      <p>Accessories are an affordable way to update your wardrobe seasonally without buying entirely new outfits.</p>
    `,
    coverImage: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
    author: {
      name: 'Sophie Anderson',
      avatar: 'https://i.pravatar.cc/150?img=16',
    },
    category: 'Style Guide',
    tags: ['accessories', 'jewelry', 'styling', 'fashion-tips'],
    isPublished: true,
    views: 328,
  },
  {
    title: 'Behind the Scenes: Our Design Process',
    slug: 'behind-the-scenes-design-process',
    excerpt: 'Take an exclusive look at how we bring our collections from concept to reality.',
    content: `
      <h2>Inspiration</h2>
      <p>Every collection begins with inspiration—from art, architecture, nature, or cultural movements. Our designers create mood boards that capture the essence of the season.</p>
      
      <h2>Sketch to Sample</h2>
      <p>Initial sketches are refined and developed into technical drawings. We create multiple samples, adjusting fit, fabric, and details until perfection.</p>
      
      <h2>Material Selection</h2>
      <p>We source the finest materials from around the world, prioritizing quality and sustainability. Each fabric is carefully tested for durability and comfort.</p>
      
      <h2>Quality Control</h2>
      <p>Before any piece reaches you, it undergoes rigorous quality checks to ensure it meets our exacting standards.</p>
    `,
    coverImage: 'https://images.pexels.com/photos/3755511/pexels-photo-3755511.jpeg',
    author: {
      name: 'James Wilson',
      avatar: 'https://i.pravatar.cc/150?img=14',
    },
    category: 'Behind the Brand',
    tags: ['design', 'process', 'craftsmanship', 'quality'],
    isPublished: true,
    views: 276,
  },
];

async function seedBlogs() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing blogs...');
    await Blog.deleteMany({});
    
    console.log('📝 Creating sample blogs...');
    const createdBlogs = await Blog.insertMany(sampleBlogs);
    
    console.log(`✅ Successfully created ${createdBlogs.length} blog posts!`);
    
    createdBlogs.forEach(blog => {
      console.log(`   - ${blog.title} (${blog.category})`);
    });

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
    process.exit(1);
  }
}

seedBlogs();
