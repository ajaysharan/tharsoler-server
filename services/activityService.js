import { Activity } from '../models/Activity.js';
import { uid } from '../utils/uid.js';

export async function logActivity(text, type = 'info') {
  return Activity.create({
    _id: uid('act'),
    text,
    type,
    at: new Date(),
  });
}
