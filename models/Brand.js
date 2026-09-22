import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';
import { slugify } from '../utils/slug.js';

const brandSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    active: { type: Boolean, default: true, index: true },
    sort: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

brandSchema.index({ active: 1, sort: 1 });

brandSchema.pre('validate', function ensureSlug(next) {
  if (!this.slug && this.name) this.slug = slugify(this.name);
  next();
});

applyJson(brandSchema);

export const Brand = mongoose.model('Brand', brandSchema);
