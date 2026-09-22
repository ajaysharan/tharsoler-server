import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const { Schema } = mongoose;

const inquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    city: { type: String, default: '', trim: true, index: true },
    propertyType: { type: String, default: 'Residential', index: true },
    bill: { type: Number, default: 0 },
    capacity: { type: String, default: '' },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'quoted', 'won', 'lost'],
      default: 'new',
      index: true,
    },
    source: { type: String, default: 'Website', index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ name: 'text', phone: 'text', city: 'text', email: 'text', message: 'text' });

applyJson(inquirySchema);

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
