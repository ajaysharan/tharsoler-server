export function slugify(input = '') {
  return String(input)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item';
}

export async function uniqueSlug(Model, base, excludeId = null) {
  let slug = slugify(base);
  let n = 0;
  for (;;) {
    const candidate = n === 0 ? slug : `${slug}-${n}`;
    const filter = { slug: candidate };
    if (excludeId) filter._id = { $ne: excludeId };
    const exists = await Model.exists(filter);
    if (!exists) return candidate;
    n += 1;
  }
}
