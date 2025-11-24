import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  subscribedAt: Date;
  isSubscribed: boolean;
  preferences: {
    fashionNews: boolean;
    promotions: boolean;
    newProducts: boolean;
  };
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
    preferences: {
      fashionNews: {
        type: Boolean,
        default: true,
      },
      promotions: {
        type: Boolean,
        default: true,
      },
      newProducts: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: { createdAt: 'subscribedAt', updatedAt: true },
  }
);

export default mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);