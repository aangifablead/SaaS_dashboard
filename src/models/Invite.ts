import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvite extends Document {
  email: string;
  token: string;
  organizationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  role: string;
  accepted: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const InviteSchema: Schema<IInvite> = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, default: "USER" },
    accepted: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Invite: Model<IInvite> = mongoose.models.Invite || mongoose.model("Invite", InviteSchema);
