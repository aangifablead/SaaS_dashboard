import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApiKey extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  key: string;
  partialKey: string;
  permissions: string;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema: Schema<IApiKey> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    partialKey: { type: String, required: true },
    permissions: { type: String, default: "Full Access" },
    lastUsedAt: { type: Date },
  },
  { timestamps: true }
);

export const ApiKey: Model<IApiKey> = mongoose.models.ApiKey || mongoose.model("ApiKey", ApiKeySchema);
