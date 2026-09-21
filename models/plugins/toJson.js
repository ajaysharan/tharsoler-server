export function applyJson(schema, extra) {
  schema.set('toJSON', {
    virtuals: true,
    transform(_doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.passwordHash;
      extra?.(ret);
      return ret;
    },
  });
}
