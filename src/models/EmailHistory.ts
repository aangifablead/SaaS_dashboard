import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmailHistory extends Document {
  to: string;
  subject: string;
  body: string;
  status: string;
  createdAt: Date;
}

const EmailHistorySchema: Schema<IEmailHistory> = new Schema(
  {
    to: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    status: { type: String, default: "SENT" },
  },
  { timestamps: true }
);

export const EmailHistory: Model<IEmailHistory> = mongoose.models.EmailHistory || mongoose.model("EmailHistory", EmailHistorySchema);
