import mongoose, { Schema, Document } from 'mongoose';

export interface IGiftCard extends Document {
  code: string;
  initialAmount: number;
  currentBalance: number;
  purchasedBy?: mongoose.Types.ObjectId;
  recipientEmail?: string;
  recipientName?: string;
  senderName?: string;
  message?: string;
  expiresAt?: Date;
  isActive: boolean;
  isRedeemed: boolean;
  redeemedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GiftCardSchema: Schema = new Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    index: true
  },
  initialAmount: { 
    type: Number, 
    required: true,
    min: 1
  },
  currentBalance: { 
    type: Number, 
    required: true,
    min: 0
  },
  purchasedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  recipientEmail: { 
    type: String,
    match: /^\S+@\S+\.\S+$/
  },
  recipientName: {
    type: String
  },
  senderName: String,
  message: String,
  expiresAt: { 
    type: Date,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isRedeemed: { 
    type: Boolean, 
    default: false 
  },
  redeemedAt: Date
}, {
  timestamps: true
});

GiftCardSchema.index({ code: 1, isActive: 1 });

export default mongoose.models.GiftCard || mongoose.model<IGiftCard>('GiftCard', GiftCardSchema);