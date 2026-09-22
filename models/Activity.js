import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const activitySchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    type: { type: String, default: 'info', index: true },
    at: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

activitySchema.index({ at: -1 });
activitySchema.index({ createdAt: -1 });
activitySchema.index({ text: 'text', type: 'text' });

applyJson(activitySchema);

export const Activity = mongoose.model('Activity', activitySchema);
