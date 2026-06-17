import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  slug: string;
  ownerId: mongoose.Types.ObjectId;
  plan: string;
  createdAt: Date;
}

const OrganizationSchema: Schema<IOrganization> = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, default: "FREE" },
  },
  { timestamps: true }
);

export const Organization: Model<IOrganization> = mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema);
