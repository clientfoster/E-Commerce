import mongoose, { Schema, Document } from 'mongoose';

export interface IGiftCard extends Document {
  code: string;
  amount: number;
  balance: number;
  recipientEmail?: string;
  senderName?: string;
  message?: string;
  expiresAt: Date;
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
    index: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 1
  },
  balance: { 
    type: Number, 
    required: true,
    min: 0
  },
  recipientEmail: { 
    type: String,
    match: /^\S+@\S+\.\S+$/
  },
  senderName: String,
  message: String,
  expiresAt: { 
    type: Date, 
    required: true,
    index: true
  },
  isRedeemed: { 
    type: Boolean, 
    default: false 
  },
  redeemedAt: Date
}, {
  timestamps: true
});

GiftCardSchema.index({ code: 1, isRedeemed: 1 });

export default mongoose.model<IGiftCard>('GiftCard', GiftCardSchema);