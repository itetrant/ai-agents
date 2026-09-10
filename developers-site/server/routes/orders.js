const express = require('express');
const crypto = require('crypto');
const { ok, created, fail, paginationMeta } = require('../lib/envelope');
const {
  scopeContext,
  requirePermission,
  requireChannelForWrite,
} = require('../middleware/scopeContext');

const router = express.Router();
router.use(scopeContext);

// Du lieu mau trong bo nho - minh hoa co lap theo (tenant_id, channel_id)
// nhu STD-API-SD-001 muc 5. channel_id giu nguyen kieu so (muc 5.2.6).
let orders = [
  { id: 'SO-2026-000001', tenant_id: '12', channel_id: 3, total_amount: 250000, currency: 'VND' },
  { id: 'SO-2026-000002', tenant_id: '12', channel_id: 4, total_amount: 890000, currency: 'VND' },
  { id: 'SO-2026-000003', tenant_id: '99', channel_id: 3, total_amount: 120000, currency: 'VND' },
];

// GET /api/v1/orders - luon loc theo TOAN BO channel trong scope (muc 5.2.5)
router.get('/', requirePermission('order.read'), (req, res) => {
  const { tenantId, channelIds } = req.ctx;
  const visible = orders.filter(
    (o) => o.tenant_id === tenantId && channelIds.includes(o.channel_id)
  );
  return ok(res, visible, paginationMeta(1, 50, visible.length));
});

// GET /api/v1/orders/:id - ngoai pham vi tra 404, KHONG tra 403, de khong
// lo su ton tai cua ban ghi thuoc tenant/channel khac (muc 5.5).
router.get('/:id', requirePermission('order.read'), (req, res) => {
  const { tenantId, channelIds } = req.ctx;
  const order = orders.find((o) => o.id === req.params.id);

  if (!order || order.tenant_id !== tenantId || !channelIds.includes(order.channel_id)) {
    return fail(res, 404, 'not_found', `Khong tim thay order id=${req.params.id}`);
  }
  return ok(res, order);
});

// POST /api/v1/orders - tenant_id/channel_id LUON lay tu req.ctx, KHONG
// BAO GIO nhan tu body client gui (muc 5.2.4).
router.post('/', requirePermission('order.write'), requireChannelForWrite, (req, res) => {
  const { total_amount, currency } = req.body || {};

  if (typeof total_amount !== 'number' || total_amount <= 0) {
    return fail(res, 422, 'validation_error', 'Truong "total_amount" la bat buoc va phai la so duong.', {
      fields: { total_amount: 'required, must be a positive number' },
    });
  }

  const order = {
    id: `SO-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 6)}`,
    tenant_id: req.ctx.tenantId,
    channel_id: req.ctx.activeChannelId,
    total_amount,
    currency: currency || 'VND',
  };
  orders.push(order);

  return created(res, order);
});

module.exports = router;
