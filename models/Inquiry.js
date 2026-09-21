import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const inquirySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    city: { type: String, default: '' },
    propertyType: { type: String, default: 'Residential' },
    bill: { type: Number, default: 0 },
    capacity: { type: String, default: '' },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'quoted', 'won', 'lost'],
      default: 'new',
    },
    source: { type: String, default: 'Website' },
    assignedTo: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

applyJson(inquirySchema);

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
