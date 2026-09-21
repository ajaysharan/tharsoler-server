import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const brandSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    logo: { type: String, default: '' },
    active: { type: Boolean, default: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true },
);

applyJson(brandSchema);

export const Brand = mongoose.model('Brand', brandSchema);
