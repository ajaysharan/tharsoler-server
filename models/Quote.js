import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const quoteSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    no: { type: String, required: true },
    customer: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    city: { type: String, default: '' },
    kw: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'expired'],
      default: 'draft',
    },
    validTill: Date,
    assignedTo: { type: String, default: '' },
  },
  { timestamps: true },
);

applyJson(quoteSchema);

export const Quote = mongoose.model('Quote', quoteSchema);
