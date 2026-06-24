import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailTemplate extends Document {
  name: string;
  desc: string;
  subject: string;
  body: string;
  icon?: string;
  color?: string;
  bg?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  icon: { type: String, default: 'Mail' },
  color: { type: String, default: 'text-indigo-600' },
  bg: { type: String, default: 'bg-indigo-50' }
}, {
  timestamps: true
});

export const EmailTemplate = mongoose.models?.EmailTemplate || mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);
