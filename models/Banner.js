import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const bannerSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    desc: { type: String, default: '' },
    hindi: { type: String, default: '' },
    ctaLabel: { type: String, default: 'Get Free Quote' },
    ctaLink: { type: String, default: '/quote' },
    image: { type: String, default: '' },
    video: { type: String, default: '' },
    caption: { type: String, default: '' },
    active: { type: Boolean, default: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true },
);

applyJson(bannerSchema);

export const Banner = mongoose.model('Banner', bannerSchema);
