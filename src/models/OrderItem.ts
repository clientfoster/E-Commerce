import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem extends Document {
  orderId: mongoose.Types.ObjectId;
  productId?: mongoose.Types.ObjectId;
  quantity: number;
  size?: string;
  color?: string;
  material?: string;
  priceAtTime: number;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
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
    priceAtTime: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

export default mongoose.models.OrderItem || mongoose.model<IOrderItem>('OrderItem', OrderItemSchema);
