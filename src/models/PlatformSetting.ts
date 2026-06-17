import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlatformSetting extends Document {
  key: string;
  value: string;
  updatedAt: Date;
}

const PlatformSettingSchema: Schema<IPlatformSetting> = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

export const PlatformSetting: Model<IPlatformSetting> = mongoose.models.PlatformSetting || mongoose.model("PlatformSetting", PlatformSettingSchema);
