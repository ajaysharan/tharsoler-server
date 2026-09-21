import { escapeRegex } from './uid.js';

export async function paginate(Model, query, searchFields = []) {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 10));
  const search = String(query.search || '').trim();
  const sortKey = query.sortKey || 'createdAt';
  const sortDir = query.sortDir === 'asc' ? 1 : -1;
  const reserved = new Set(['page', 'pageSize', 'search', 'sortKey', 'sortDir']);
  const filter = {};

  for (const [key, value] of Object.entries(query)) {
    if (reserved.has(key) || value === undefined || value === '' || value === 'all') continue;
    if (value === 'true' || value === 'false') filter[key] = value === 'true';
    else filter[key] = value;
  }

  if (search && searchFields.length) {
    filter.$or = searchFields.map((field) => ({ [field]: new RegExp(escapeRegex(search), 'i') }));
  }

  const total = await Model.countDocuments(filter);
  const rows = await Model.find(filter)
    .sort({ [sortKey]: sortDir })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return { data: rows.map((r) => r.toJSON()), total, page, pageSize };
}
