import mongoose from 'mongoose';

function stringifyIds(value) {
  if (value == null) return value;
  if (value instanceof mongoose.Types.ObjectId) return String(value);
  if (Array.isArray(value)) return value.map(stringifyIds);
  if (typeof value === 'object' && value.constructor === Object) {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = stringifyIds(v);
    return out;
  }
  return value;
}

export function applyJson(schema, extra) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(_doc, ret) {
      const plain = stringifyIds(ret);
      plain.id = String(plain._id);
      delete plain._id;
      delete plain.__v;
      delete plain.passwordHash;
      extra?.(plain);
      return plain;
    },
  });

  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
  });
}
