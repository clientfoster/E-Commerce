import mongoose from 'mongoose';
import SiteSettings from '../src/models/SiteSettings.ts';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.VITE_MONGODB_URI;

const defaultSettings = {
  siteName: 'ATELIER',
  siteDescription: 'Premium Fashion E-Commerce',
  logo: '',
  favicon: '',
  contactEmail: 'contact@atelier.com',
  contactPhone: '+1 (555) 123-4567',
  address: {
    street: '123 Fashion Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
  },
  socialMedia: {
    facebook: 'https://facebook.com/atelier',
    instagram: 'https://instagram.com/atelier',
    twitter: 'https://twitter.com/atelier',
    pinterest: 'https://pinterest.com/atelier',
    youtube: 'https://youtube.com/atelier',
  },
  emailSettings: {
    fromEmail: 'noreply@atelier.com',
    fromName: 'ATELIER',
  },
  seo: {
    metaTitle: 'ATELIER - Premium Fashion',
    metaDescription: 'Discover premium fashion at ATELIER. Shop the latest collections.',
    metaKeywords: ['fashion', 'luxury', 'clothing', 'premium', 'designer'],
  },
  shipping: {
    freeShippingThreshold: 100,
    standardShippingCost: 10,
    expressShippingCost: 25,
    internationalShippingCost: 50,
  },
  currency: {
    code: 'USD',
    symbol: '$',
  },
  maintenance: {
    enabled: false,
    message: 'We are currently under maintenance. Please check back soon.',
  },
};

async function seedSettings() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Checking for existing settings...');
    const existingSettings = await SiteSettings.findOne();
    
    if (existingSettings) {
      console.log('✅ Settings already exist. Skipping creation.');
    } else {
      console.log('📝 Creating default site settings...');
      const settings = await SiteSettings.create(defaultSettings);
      console.log(`✅ Successfully created site settings! ID: ${settings._id}`);
    }

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    process.exit(1);
  }
}

seedSettings();
