import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  categoryId?: mongoose.Types.ObjectId;
  images: string[];
  modelUrl?: string;
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  materials: Array<{ name: string; texture?: string }>;
  stockQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Virtual field for reviews
  reviews?: any[];
  averageRating?: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    images: {
      type: [String],
      default: [],
    },
    modelUrl: {
      type: String,
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [
        {
          name: String,
          hex: String,
        },
      ],
      default: [],
    },
    materials: {
      type: [
        {
          name: String,
          texture: String,
        },
      ],
      default: [],
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for reviews
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId',
  options: { sort: { createdAt: -1 } }
});

// Ensure virtual fields are serialized
ProductSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
