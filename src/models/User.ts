import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export interface IUser extends Document {
  email: string;
  password: string;
  fullName?: string;
  avatarUrl?: string;
  isAdmin: boolean;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    addresses: [{
      type: {
        type: String,
        enum: ['home', 'work', 'other'],
        default: 'home'
      },
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      isDefault: {
        type: Boolean,
        default: false
      }
    }],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }

  // Hash password with cost factor of 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
