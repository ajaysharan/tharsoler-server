import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const { Schema } = mongoose;

const quoteSchema = new Schema(
  {
    no: { type: String, required: true, unique: true, trim: true },
    customer: { type: String, required: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null, index: true },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    city: { type: String, default: '', trim: true, index: true },
    kw: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'expired'],
      default: 'draft',
      index: true,
    },
    validTill: Date,
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  },
  { timestamps: true },
);

quoteSchema.index({ createdAt: -1 });
quoteSchema.index({ status: 1, createdAt: -1 });
quoteSchema.index({ no: 'text', customer: 'text', city: 'text' });

applyJson(quoteSchema);

export const Quote = mongoose.model('Quote', quoteSchema);
