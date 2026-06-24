import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStripeEvent extends Document {
  stripeEventId: string;
  type: string;
  createdAt: Date;
}

const StripeEventSchema: Schema<IStripeEvent> = new Schema(
  {
    stripeEventId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

export const StripeEvent: Model<IStripeEvent> = mongoose.models.StripeEvent || mongoose.model("StripeEvent", StripeEventSchema);
