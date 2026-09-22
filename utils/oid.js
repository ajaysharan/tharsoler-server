import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export function isOid(value) {
  return mongoose.isValidObjectId(value);
}

export function toOid(value) {
  if (value == null || value === '') return null;
  if (value instanceof ObjectId) return value;
  if (isOid(value)) return new ObjectId(String(value));
  return null;
}

export function toOidList(ids = []) {
  return (Array.isArray(ids) ? ids : [ids])
    .map(toOid)
    .filter(Boolean);
}

/** Empty string / invalid → null (for optional ObjectId refs) */
export function optionalOid(value) {
  if (value == null || value === '') return null;
  return toOid(value);
}

export { ObjectId };
