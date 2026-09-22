import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: '', trim: true, index: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    city: { type: String, default: '', trim: true, index: true },
    type: { type: String, default: 'Residential', index: true },
    inquiryId: { type: Schema.Types.ObjectId, ref: 'Inquiry', default: null, index: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

customerSchema.index({ createdAt: -1 });
customerSchema.index({ name: 'text', phone: 'text', email: 'text', city: 'text' });

applyJson(customerSchema);

export const Customer = mongoose.model('Customer', customerSchema);
