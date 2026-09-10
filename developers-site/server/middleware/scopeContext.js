const { fail } = require('../lib/envelope');

// Phan tich header X-Authenticated-Scope theo STD-API-SD-001 muc 5.2.3:
// danh sach phang, phan cach boi dau cach, gom tenant:<ma>, channel:<so>
// (co the lap lai) va cac quyen dang <domain>.<action>.
function parseScope(raw) {
  const tokens = (raw || '').trim().split(/\s+/).filter(Boolean);
  const tenantIds = [];
  const channelIds = [];
  const permissions = [];

  for (const token of tokens) {
    if (token.startsWith('tenant:')) {
      tenantIds.push(token.slice('tenant:'.length));
    } else if (token.startsWith('channel:')) {
      channelIds.push(Number(token.slice('channel:'.length)));
    } else {
      permissions.push(token);
    }
  }

  return { tenantIds, channelIds, permissions };
}

// Mo phong buoc "trich tenant -> trich channel -> kiem tra quyen" cua muc
// 5.2.4. Trong he thong that, header nay CHI duoc tin khi da di qua Kong
// OAuth2 plugin (external) hoac duoc chinh service chen sau khi validate
// x-api-key (service-to-service) - KHONG BAO GIO nhan truc tiep tu client
// ngoai. Demo nay doc thang tu header de tien test cuc bo.
function scopeContext(req, res, next) {
  const { tenantIds, channelIds, permissions } = parseScope(req.get('x-authenticated-scope'));

  if (tenantIds.length !== 1) {
    return fail(res, 401, 'unauthorized', 'Scope phai chua dung mot muc "tenant:".');
  }
  if (channelIds.length === 0) {
    return fail(res, 401, 'unauthorized', 'Scope phai chua it nhat mot muc "channel:".');
  }

  req.ctx = { tenantId: tenantIds[0], channelIds, permissions };
  next();
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.ctx.permissions.includes(permission)) {
      return fail(res, 403, 'forbidden', `Thieu quyen "${permission}" trong scope.`);
    }
    next();
  };
}

// Xac dinh channel dang thao tac cho request GHI, theo bang muc 5.2.5.
function requireChannelForWrite(req, res, next) {
  const { channelIds } = req.ctx;

  if (channelIds.length === 1) {
    req.ctx.activeChannelId = channelIds[0];
    return next();
  }

  const header = req.get('x-channel-id');
  if (header === undefined) {
    return fail(res, 400, 'bad_request', 'Thieu header X-Channel-Id khi token co nhieu channel.');
  }

  const channelId = Number(header);
  if (!channelIds.includes(channelId)) {
    return fail(res, 403, 'forbidden', `Channel ${channelId} khong nam trong scope da cap.`);
  }

  req.ctx.activeChannelId = channelId;
  next();
}

module.exports = { scopeContext, requirePermission, requireChannelForWrite };
