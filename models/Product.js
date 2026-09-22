import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';
import { slugify } from '../utils/slug.js';

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, default: '', trim: true, index: true },
    brandId: { type: Schema.Types.ObjectId, ref: 'Brand', default: null, index: true },
    cat: { type: String, default: 'panels', index: true },
    catLabel: { type: String, default: '' },
    spec: { type: String, default: '' },
    warranty: { type: String, default: '' },
    sku: { type: String, default: '', index: true },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true },
    img: { type: String, default: '' },
    detail: { type: String, default: '' },
    badge: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    keywords: { type: [String], default: [] },
  },
  { timestamps: true },
);

productSchema.index({ active: 1, cat: 1, brand: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', brand: 'text', sku: 'text', spec: 'text', catLabel: 'text' });

productSchema.pre('validate', function ensureSlug(next) {
  if (!this.slug && this.name) this.slug = slugify(this.name);
  next();
});

applyJson(productSchema);

export const Product = mongoose.model('Product', productSchema);
