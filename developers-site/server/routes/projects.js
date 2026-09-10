const express = require('express');
const crypto = require('crypto');
const { ok, created, noContent, fail, paginationMeta } = require('../lib/envelope');
const { requireBearerToken } = require('../middleware/auth');

const router = express.Router();

// Du lieu mau trong bo nho, chi de minh hoa API std - khong dung production.
let projects = [
  { id: '1', name: 'Website ban hang', stack: 'Node.js + React', status: 'active' },
  { id: '2', name: 'App mobile CSKH', stack: 'React Native', status: 'planning' },
];

const seenIdempotencyKeys = new Map();

// GET /api/v1/projects?page=1&limit=10
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const start = (page - 1) * limit;
  const pageItems = projects.slice(start, start + limit);

  return ok(res, pageItems, paginationMeta(page, limit, projects.length));
});

// GET /api/v1/projects/:id
router.get('/:id', (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    return fail(res, 404, 'not_found', `Khong tim thay project id=${req.params.id}`);
  }
  return ok(res, project);
});

// POST /api/v1/projects (yeu cau auth + ho tro Idempotency-Key)
router.post('/', requireBearerToken, (req, res) => {
  const { name, stack } = req.body || {};
  if (!name || typeof name !== 'string') {
    return fail(res, 422, 'validation_error', 'Truong "name" la bat buoc.', {
      fields: { name: 'required' },
    });
  }

  const idempotencyKey = req.get('idempotency-key');
  if (idempotencyKey && seenIdempotencyKeys.has(idempotencyKey)) {
    return ok(res, seenIdempotencyKeys.get(idempotencyKey));
  }

  const project = {
    id: crypto.randomUUID(),
    name,
    stack: stack || 'chua xac dinh',
    status: 'planning',
  };
  projects.push(project);

  if (idempotencyKey) seenIdempotencyKeys.set(idempotencyKey, project);

  return created(res, project);
});

// DELETE /api/v1/projects/:id
router.delete('/:id', requireBearerToken, (req, res) => {
  const before = projects.length;
  projects = projects.filter((p) => p.id !== req.params.id);
  if (projects.length === before) {
    return fail(res, 404, 'not_found', `Khong tim thay project id=${req.params.id}`);
  }
  return noContent(res);
});

module.exports = router;
