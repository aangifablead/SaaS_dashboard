import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role: string;
  plan: string;
  stripeCustomerId?: string;
  stripeSubId?: string;
  planExpiresAt?: Date;
  isActive: boolean;
  phone?: string;
  company?: string;
  bio?: string;
  organizationId?: mongoose.Types.ObjectId;
  usageCounters?: {
    apiCalls: number;
    storageUsed: number;
    teamMembers: number;
  };
  billingCycleStart?: Date;
  nextBillingDate?: Date;
  paymentMethodId?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    emailVerified: { type: Date },
    image: { type: String },
    password: { type: String },
    role: { type: String, default: "USER" },
    plan: { type: String, default: "FREE" },
    stripeCustomerId: { type: String, unique: true, sparse: true },
    stripeSubId: { type: String, unique: true, sparse: true },
    planExpiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    phone: { type: String },
    company: { type: String },
    bio: { type: String },
    usageCounters: {
      apiCalls: { type: Number, default: 0 },
      storageUsed: { type: Number, default: 0 },
      teamMembers: { type: Number, default: 1 },
    },
    billingCycleStart: { type: Date },
    nextBillingDate: { type: Date },
    paymentMethodId: { type: String },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model("User", UserSchema);
