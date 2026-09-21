import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const serviceSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    icon: { type: String, default: 'sun' },
    color: { type: String, default: 'solar' },
    title: { type: String, required: true },
    titleHi: { type: String, default: '' },
    desc: { type: String, default: '' },
    img: { type: String, default: '' },
    overview: { type: String, default: '' },
    features: { type: [String], default: [] },
    process: { type: [String], default: [] },
    active: { type: Boolean, default: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true },
);

applyJson(serviceSchema);

export const Service = mongoose.model('Service', serviceSchema);
