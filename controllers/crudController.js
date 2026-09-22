import { AppError, catchAsync, send } from '../utils/AppError.js';
import { paginate, sanitizeWriteBody } from '../utils/paginate.js';
import { toOidList, isOid } from '../utils/oid.js';
import { getResource } from '../models/index.js';
import { logActivity } from '../services/activityService.js';
import { uniqueSlug } from '../utils/slug.js';

const SLUG_RESOURCES = new Set(['products', 'services', 'brands']);

export function createCrudController(resourceKey) {
  const resource = getResource(resourceKey);
  if (!resource) throw new Error(`Unknown resource: ${resourceKey}`);

  const { model, search } = resource;

  return {
    list: catchAsync(async (req, res) => {
      const result = await paginate(model, req.query, search);
      return send(res, result);
    }),

    create: catchAsync(async (req, res) => {
      const body = sanitizeWriteBody(req.body || {});

      if (SLUG_RESOURCES.has(resourceKey)) {
        const base = body.slug || body.name || body.title || 'item';
        body.slug = await uniqueSlug(model, base);
      }

      const doc = await model.create(body);
      await logActivity(
        `Created ${resourceKey.replace(/s$/, '')}: ${doc.name || doc.no || doc.title || doc.id}`,
        resourceKey,
      );
      return send(res, doc.toJSON(), 201);
    }),

    update: catchAsync(async (req, res) => {
      if (!isOid(req.params.id)) throw new AppError('Invalid id', 400);
      const body = sanitizeWriteBody(req.body || {});

      if (SLUG_RESOURCES.has(resourceKey) && body.slug) {
        body.slug = await uniqueSlug(model, body.slug, req.params.id);
      }

      const doc = await model.findByIdAndUpdate(req.params.id, body, {
        new: true,
        runValidators: true,
      });
      if (!doc) throw new AppError('Not found', 404);
      return send(res, doc.toJSON());
    }),

    removeMany: catchAsync(async (req, res) => {
      const ids = toOidList(req.body?.ids || []);
      if (!ids.length) throw new AppError('No valid ids', 400);
      await model.deleteMany({ _id: { $in: ids } });
      return send(res, { ok: true, deleted: ids.length });
    }),
  };
}
