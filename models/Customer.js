import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const customerSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    city: { type: String, default: '' },
    type: { type: String, default: 'Residential' },
    inquiryId: { type: String, default: '' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

applyJson(customerSchema);

export const Customer = mongoose.model('Customer', customerSchema);
