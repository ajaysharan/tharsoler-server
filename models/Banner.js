import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const bannerSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true, trim: true },
    desc: { type: String, default: '' },
    hindi: { type: String, default: '' },
    ctaLabel: { type: String, default: 'Get Free Quote' },
    ctaLink: { type: String, default: '/quote' },
    image: { type: String, default: '' },
    video: { type: String, default: '' },
    caption: { type: String, default: '' },
    active: { type: Boolean, default: true, index: true },
    sort: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

bannerSchema.index({ active: 1, sort: 1 });

applyJson(bannerSchema);

export const Banner = mongoose.model('Banner', bannerSchema);
