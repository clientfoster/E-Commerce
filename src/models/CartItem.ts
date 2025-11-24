import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  size?: string;
  color?: string;
  material?: string;
  createdAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.models.CartItem || mongoose.model<ICartItem>('CartItem', CartItemSchema);
