/**
 * Legacy helper — prefer Mongo ObjectId (auto). Kept for rare non-id codes.
 * escapeRegex is used by pagination search.
 */
export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
