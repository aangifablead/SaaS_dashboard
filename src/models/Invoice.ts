import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvoice extends Document {
  userId: mongoose.Types.ObjectId;
  stripeInvoiceId: string;
  amount: number;
  currency: string;
  status: string;
  plan: string;
  invoiceUrl?: string;
  createdAt: Date;
}

const InvoiceSchema: Schema<IInvoice> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stripeInvoiceId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "inr" },
    status: { type: String, required: true },
    plan: { type: String, required: true },
    invoiceUrl: { type: String },
  },
  { timestamps: true }
);

export const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
