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
  organizationId?: mongoose.Types.ObjectId;
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
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model("User", UserSchema);
