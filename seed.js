import mongoose from 'mongoose';
import Category from './src/models/Category.ts';
import Product from './src/models/Product.ts';
import User from './src/models/User.ts';

import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.VITE_MONGODB_URI;

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Outerwear',
        slug: 'outerwear',
        description: 'Premium jackets and coats',
        imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      },
      {
        name: 'Tops',
        slug: 'tops',
        description: 'Designer shirts and blouses',
        imageUrl: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg',
      },
      {
        name: 'Bottoms',
        slug: 'bottoms',
        description: 'Luxury pants and skirts',
        imageUrl: 'https://images.pexels.com/photos/1895943/pexels-photo-1895943.jpeg',
      },
    ]);
    console.log('Created categories');

    // Create products
    const products = await Product.insertMany([
      {
        name: 'Minimal Tailored Blazer',
        slug: 'minimal-tailored-blazer',
        description: 'A perfectly structured blazer in premium wool blend. Features clean lines, peak lapels, and a modern slim fit. Timeless sophistication for any occasion.',
        price: 299.00,
        categoryId: categories[0]._id,
        images: [
          'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
          'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Black', hex: '#1a1a1a' },
          { name: 'Navy', hex: '#1e3a5f' },
          { name: 'Charcoal', hex: '#36454f' },
        ],
        materials: [
          { name: 'Wool Blend' },
          { name: 'Pure Wool' },
        ],
        stockQuantity: 50,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Silk Draped Blouse',
        slug: 'silk-draped-blouse',
        description: 'Luxurious silk blouse with elegant draping and fluid movement. Features a relaxed fit, subtle sheen, and delicate button details. Pure elegance.',
        price: 189.00,
        categoryId: categories[1]._id,
        images: [
          'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg',
          'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg',
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [
          { name: 'Ivory', hex: '#f5f5dc' },
          { name: 'Blush', hex: '#de5d83' },
          { name: 'Sage', hex: '#9caf88' },
        ],
        materials: [
          { name: 'Pure Silk' },
          { name: 'Silk Satin' },
        ],
        stockQuantity: 40,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Wide-Leg Trousers',
        slug: 'wide-leg-trousers',
        description: 'Contemporary wide-leg trousers crafted from premium Italian fabric. High-waisted silhouette with a flowing leg and tailored pleats. Effortless sophistication.',
        price: 225.00,
        categoryId: categories[2]._id,
        images: [
          'https://images.pexels.com/photos/1895943/pexels-photo-1895943.jpeg',
          'https://images.pexels.com/photos/5706666/pexels-photo-5706666.jpeg',
        ],
        sizes: ['24', '26', '28', '30', '32'],
        colors: [
          { name: 'Black', hex: '#000000' },
          { name: 'Camel', hex: '#c19a6b' },
          { name: 'Slate', hex: '#708090' },
        ],
        materials: [
          { name: 'Crepe' },
          { name: 'Wool Crepe' },
        ],
        stockQuantity: 45,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Cashmere Turtleneck',
        slug: 'cashmere-turtleneck',
        description: 'Ultra-soft cashmere turtleneck with a relaxed fit. Lightweight yet warm, perfect for layering. Timeless piece for your capsule wardrobe.',
        price: 275.00,
        categoryId: categories[1]._id,
        images: [
          'https://images.pexels.com/photos/8148577/pexels-photo-8148577.jpeg',
          'https://images.pexels.com/photos/5868283/pexels-photo-5868283.jpeg',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Cream', hex: '#fffdd0' },
          { name: 'Charcoal', hex: '#36454f' },
          { name: 'Burgundy', hex: '#800020' },
        ],
        materials: [
          { name: 'Pure Cashmere' },
        ],
        stockQuantity: 30,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Leather Midi Skirt',
        slug: 'leather-midi-skirt',
        description: 'Butter-soft leather midi skirt with a sleek silhouette. Features a flattering A-line cut and invisible side zip. Modern luxury at its finest.',
        price: 349.00,
        categoryId: categories[2]._id,
        images: [
          'https://images.pexels.com/photos/3755769/pexels-photo-3755769.jpeg',
          'https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg',
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [
          { name: 'Black', hex: '#000000' },
          { name: 'Chocolate', hex: '#3f2616' },
          { name: 'Tan', hex: '#d2b48c' },
        ],
        materials: [
          { name: 'Lambskin' },
          { name: 'Vegan Leather' },
        ],
        stockQuantity: 25,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Oversized Trench Coat',
        slug: 'oversized-trench-coat',
        description: 'Contemporary take on the classic trench. Features dropped shoulders, oversized silhouette, and premium cotton gabardine. Statement outerwear piece.',
        price: 425.00,
        categoryId: categories[0]._id,
        images: [
          'https://images.pexels.com/photos/8148580/pexels-photo-8148580.jpeg',
          'https://images.pexels.com/photos/4937449/pexels-photo-4937449.jpeg',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Beige', hex: '#f5f5dc' },
          { name: 'Black', hex: '#000000' },
          { name: 'Khaki', hex: '#c3b091' },
        ],
        materials: [
          { name: 'Cotton Gabardine' },
          { name: 'Waterproof Cotton' },
        ],
        stockQuantity: 35,
        isFeatured: true,
        isActive: true,
      },
      // Additional products
      {
        name: 'Merino Wool Cardigan',
        slug: 'merino-wool-cardigan',
        description: 'Luxuriously soft merino wool cardigan with mother-of-pearl buttons. Perfect layering piece for any season.',
        price: 195.00,
        categoryId: categories[1]._id,
        images: [
          'https://images.pexels.com/photos/8148582/pexels-photo-8148582.jpeg',
          'https://images.pexels.com/photos/5868277/pexels-photo-5868277.jpeg',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Oatmeal', hex: '#e8dcc4' },
          { name: 'Forest', hex: '#228b22' },
          { name: 'Navy', hex: '#000080' },
        ],
        materials: [
          { name: 'Merino Wool' },
        ],
        stockQuantity: 60,
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Slim Fit Chinos',
        slug: 'slim-fit-chinos',
        description: 'Classic slim-fit chinos in premium cotton twill. Versatile style for both casual and smart-casual occasions.',
        price: 145.00,
        categoryId: categories[2]._id,
        images: [
          'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg',
          'https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg',
        ],
        sizes: ['28', '30', '32', '34', '36'],
        colors: [
          { name: 'Khaki', hex: '#c3b091' },
          { name: 'Navy', hex: '#000080' },
          { name: 'Olive', hex: '#808000' },
        ],
        materials: [
          { name: 'Cotton Twill' },
        ],
        stockQuantity: 80,
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Linen Shirt',
        slug: 'linen-shirt',
        description: 'Breathable linen shirt perfect for warm weather. Relaxed fit with classic collar and button-down style.',
        price: 135.00,
        categoryId: categories[1]._id,
        images: [
          'https://images.pexels.com/photos/2766408/pexels-photo-2766408.jpeg',
          'https://images.pexels.com/photos/5710097/pexels-photo-5710097.jpeg',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'White', hex: '#ffffff' },
          { name: 'Sky Blue', hex: '#87ceeb' },
          { name: 'Sand', hex: '#c2b280' },
        ],
        materials: [
          { name: 'Linen' },
        ],
        stockQuantity: 70,
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Quilted Bomber Jacket',
        slug: 'quilted-bomber-jacket',
        description: 'Modern bomber jacket with diamond quilting. Lightweight yet warm, perfect for transitional weather.',
        price: 285.00,
        categoryId: categories[0]._id,
        images: [
          'https://images.pexels.com/photos/1054777/pexels-photo-1054777.jpeg',
          'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Black', hex: '#000000' },
          { name: 'Olive', hex: '#808000' },
        ],
        materials: [
          { name: 'Nylon' },
          { name: 'Down Fill' },
        ],
        stockQuantity: 40,
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'High-Waisted Jeans',
        slug: 'high-waisted-jeans',
        description: 'Classic high-waisted jeans in premium stretch denim. Flattering fit with vintage-inspired wash.',
        price: 165.00,
        categoryId: categories[2]._id,
        images: [
          'https://images.pexels.com/photos/1895943/pexels-photo-1895943.jpeg',
          'https://images.pexels.com/photos/5698853/pexels-photo-5698853.jpeg',
        ],
        sizes: ['24', '26', '28', '30', '32'],
        colors: [
          { name: 'Dark Wash', hex: '#1c1c1c' },
          { name: 'Light Wash', hex: '#6495ed' },
        ],
        materials: [
          { name: 'Stretch Denim' },
        ],
        stockQuantity: 90,
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Ribbed Knit Dress',
        slug: 'ribbed-knit-dress',
        description: 'Elegant midi dress in soft ribbed knit. Fitted silhouette with long sleeves, perfect for any occasion.',
        price: 215.00,
        categoryId: categories[1]._id,
        images: [
          'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',
          'https://images.pexels.com/photos/5710090/pexels-photo-5710090.jpeg',
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [
          { name: 'Black', hex: '#000000' },
          { name: 'Camel', hex: '#c19a6b' },
          { name: 'Burgundy', hex: '#800020' },
        ],
        materials: [
          { name: 'Ribbed Knit' },
        ],
        stockQuantity: 55,
        isFeatured: false,
        isActive: true,
      },
    ]);
    console.log('Created products');

    // Create admin user (plain text password for demo)
    await User.create({
      email: 'admin@atelier.com',
      password: 'admin123', // Plain text for demo
      fullName: 'Admin User',
      isAdmin: true,
    });
    console.log('Created admin user');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@atelier.com');
    console.log('Password: admin123');
    console.log(`\nSeeded ${categories.length} categories and ${products.length} products`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

seedDatabase();
