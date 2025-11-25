import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  totalAmount: number;
  shippingAddress: Record<string, string>;
  billingAddress: Record<string, string>;
  stripePaymentIntentId?: string;
  deliveredAt?: Date;
  returnWindowClosedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: Map,
      of: String,
      required: true,
    },
    billingAddress: {
      type: Map,
      of: String,
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
    },
    deliveredAt: {
      type: Date,
    },
    returnWindowClosedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
