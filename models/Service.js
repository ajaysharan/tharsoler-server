import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';
import { slugify } from '../utils/slug.js';

const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    icon: { type: String, default: 'sun' },
    color: { type: String, default: 'solar' },
    title: { type: String, required: true, trim: true },
    titleHi: { type: String, default: '' },
    desc: { type: String, default: '' },
    img: { type: String, default: '' },
    overview: { type: String, default: '' },
    features: { type: [String], default: [] },
    process: { type: [String], default: [] },
    active: { type: Boolean, default: true, index: true },
    sort: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

serviceSchema.index({ active: 1, sort: 1 });
serviceSchema.index({ title: 'text', titleHi: 'text', desc: 'text' });

serviceSchema.pre('validate', function ensureSlug(next) {
  if (!this.slug && this.title) this.slug = slugify(this.title);
  next();
});

applyJson(serviceSchema);

export const Service = mongoose.model('Service', serviceSchema);
