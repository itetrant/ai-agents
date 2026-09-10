// Chuan envelope response dung chung cho toan bo API std cua mmvietnam.
// Tham khao noi dung day du tai trang "API Standard" cua site.

function ok(res, data, meta) {
  const body = { data };
  if (meta) body.meta = meta;
  return res.json(body);
}

function created(res, data) {
  return res.status(201).json({ data });
}

function noContent(res) {
  return res.status(204).end();
}

function fail(res, status, code, message, details) {
  const error = { code, message };
  if (details) error.details = details;
  return res.status(status).json({ error });
}

function paginationMeta(page, limit, total) {
  return {
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

module.exports = { ok, created, noContent, fail, paginationMeta };
