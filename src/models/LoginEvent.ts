import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILoginEvent extends Document {
  userId: mongoose.Types.ObjectId;
  device: string;
  location: string;
  ipAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const LoginEventSchema: Schema<ILoginEvent> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    device: { type: String, required: true },
    location: { type: String, default: "Unknown Location" },
    ipAddress: { type: String, required: true },
  },
  { timestamps: true }
);

export const LoginEvent: Model<ILoginEvent> = mongoose.models.LoginEvent || mongoose.model("LoginEvent", LoginEventSchema);
