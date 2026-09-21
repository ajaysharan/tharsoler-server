import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const projectSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    customer: { type: String, required: true },
    city: { type: String, default: '' },
    kw: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['survey', 'design', 'install', 'commissioned', 'onhold'],
      default: 'survey',
    },
    manager: { type: String, default: '' },
    startDate: Date,
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

applyJson(projectSchema);

export const Project = mongoose.model('Project', projectSchema);
