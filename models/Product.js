import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, default: '' },
    cat: { type: String, default: 'panels' },
    catLabel: { type: String, default: '' },
    spec: { type: String, default: '' },
    warranty: { type: String, default: '' },
    sku: { type: String, default: '' },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    img: { type: String, default: '' },
    detail: { type: String, default: '' },
    badge: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    keywords: { type: [String], default: [] },
  },
  { timestamps: true },
);

applyJson(productSchema);

export const Product = mongoose.model('Product', productSchema);
