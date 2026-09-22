import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    customer: { type: String, required: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null, index: true },
    city: { type: String, default: '', trim: true, index: true },
    kw: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['survey', 'design', 'install', 'commissioned', 'onhold'],
      default: 'survey',
      index: true,
    },
    manager: { type: String, default: '' },
    managerId: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    startDate: Date,
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

projectSchema.index({ createdAt: -1 });
projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ name: 'text', customer: 'text', city: 'text', manager: 'text' });

applyJson(projectSchema);

export const Project = mongoose.model('Project', projectSchema);
