import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    pinterest?: string;
    youtube?: string;
  };
  emailSettings: {
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPassword?: string;
    fromEmail: string;
    fromName: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingCost: number;
    expressShippingCost: number;
    internationalShippingCost: number;
  };
  currency: {
    code: string;
    symbol: string;
  };
  maintenance: {
    enabled: boolean;
    message: string;
  };
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: {
      type: String,
      required: true,
      default: 'ATELIER',
    },
    siteDescription: {
      type: String,
      default: 'Premium Fashion E-Commerce',
    },
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      required: true,
      default: 'contact@atelier.com',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      pinterest: String,
      youtube: String,
    },
    emailSettings: {
      smtpHost: String,
      smtpPort: Number,
      smtpUser: String,
      smtpPassword: String,
      fromEmail: {
        type: String,
        default: 'noreply@atelier.com',
      },
      fromName: {
        type: String,
        default: 'ATELIER',
      },
    },
    seo: {
      metaTitle: {
        type: String,
        default: 'ATELIER - Premium Fashion',
      },
      metaDescription: {
        type: String,
        default: 'Shop premium fashion at ATELIER',
      },
      metaKeywords: {
        type: [String],
        default: ['fashion', 'luxury', 'clothing'],
      },
      googleAnalyticsId: String,
      facebookPixelId: String,
    },
    shipping: {
      freeShippingThreshold: {
        type: Number,
        default: 100,
      },
      standardShippingCost: {
        type: Number,
        default: 10,
      },
      expressShippingCost: {
        type: Number,
        default: 25,
      },
      internationalShippingCost: {
        type: Number,
        default: 50,
      },
    },
    currency: {
      code: {
        type: String,
        default: 'INR',
      },
      symbol: {
        type: String,
        default: '₹',
      },
    },
    maintenance: {
      enabled: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        default: 'We are currently under maintenance. Please check back soon.',
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
