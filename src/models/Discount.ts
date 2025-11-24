import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscount extends Document {
  code: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableTo: {
    allProducts: boolean;
    productIds?: mongoose.Types.ObjectId[];
    categoryIds?: mongoose.Types.ObjectId[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const DiscountSchema = new Schema<IDiscount>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    discountType: {
      type: String,
      required: true,
      enum: ['percentage', 'fixed', 'free_shipping'],
    },
    discountValue: {
      type: Number,
      required: true,
    },
    minimumAmount: {
      type: Number,
    },
    maximumDiscount: {
      type: Number,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableTo: {
      allProducts: {
        type: Boolean,
        default: true,
      },
      productIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
      }],
      categoryIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
      }],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
DiscountSchema.index({ code: 1 });
DiscountSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

export default mongoose.models.Discount || mongoose.model<IDiscount>('Discount', DiscountSchema);