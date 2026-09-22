import { escapeRegex } from './uid.js';
import { toOid, optionalOid } from './oid.js';

const OID_FILTER_KEYS = new Set(['assignedTo', 'inquiryId', 'customerId', 'managerId', 'brandId', 'userId']);

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
    if (value === 'true' || value === 'false') {
      filter[key] = value === 'true';
      continue;
    }
    if (OID_FILTER_KEYS.has(key)) {
      const oid = optionalOid(value);
      if (oid) filter[key] = oid;
      continue;
    }
    filter[key] = value;
  }

  if (search && searchFields.length) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = searchFields.map((field) => ({ [field]: rx }));
  }

  const [total, rows] = await Promise.all([
    Model.countDocuments(filter),
    Model.find(filter)
      .sort({ [sortKey]: sortDir })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
  ]);

  return {
    data: rows.map((r) => leanToJson(r)),
    total,
    page,
    pageSize,
  };
}

export function leanToJson(r) {
  if (!r) return r;
  const id = String(r._id);
  const { _id, __v, passwordHash, smtpPass, ...rest } = r;
  for (const key of OID_FILTER_KEYS) {
    if (rest[key] != null) rest[key] = String(rest[key]);
  }
  return { ...rest, id };
}

export function sanitizeWriteBody(body = {}) {
  const next = { ...body };
  delete next.id;
  delete next._id;
  delete next.__v;
  delete next.createdAt;
  delete next.updatedAt;

  for (const key of OID_FILTER_KEYS) {
    if (key in next) next[key] = optionalOid(next[key]);
  }
  return next;
}

export { toOid };
