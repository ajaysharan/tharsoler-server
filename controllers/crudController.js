import { AppError, catchAsync, send } from '../utils/AppError.js';
import { uid } from '../utils/uid.js';
import { paginate } from '../utils/paginate.js';
import { getResource } from '../models/index.js';
import { logActivity } from '../services/activityService.js';

export function createCrudController(resourceKey) {
  const resource = getResource(resourceKey);
  if (!resource) throw new Error(`Unknown resource: ${resourceKey}`);

  const { model, search, prefix } = resource;

  return {
    list: catchAsync(async (req, res) => {
      const result = await paginate(model, req.query, search);
      return send(res, result);
    }),

    create: catchAsync(async (req, res) => {
      const body = { ...(req.body || {}) };
      delete body.id;
      const doc = await model.create({
        _id: body._id || uid(prefix),
        ...body,
      });
      await logActivity(
        `Created ${resourceKey.replace(/s$/, '')}: ${doc.name || doc.no || doc.title || doc.id}`,
        resourceKey,
      );
      return send(res, doc.toJSON(), 201);
    }),

    update: catchAsync(async (req, res) => {
      const body = { ...(req.body || {}) };
      delete body.id;
      delete body._id;
      const doc = await model.findByIdAndUpdate(req.params.id, body, { new: true });
      if (!doc) throw new AppError('Not found', 404);
      return send(res, doc.toJSON());
    }),

    removeMany: catchAsync(async (req, res) => {
      const ids = req.body?.ids || [];
      await model.deleteMany({ _id: { $in: ids } });
      return send(res, { ok: true });
    }),
  };
}
