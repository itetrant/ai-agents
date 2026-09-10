const { fail } = require('../lib/envelope');

// Middleware minh hoa quy uoc auth cua API std: Bearer token trong header
// Authorization. Day la vi du cho tai lieu, khong phai auth that.
function requireBearerToken(req, res, next) {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return fail(
      res,
      401,
      'unauthorized',
      'Thieu hoac sai dinh dang Authorization header. Yeu cau: "Bearer <token>".'
    );
  }

  if (token !== 'demo-token') {
    return fail(res, 401, 'invalid_token', 'Token khong hop le.');
  }

  req.user = { id: 'demo-user' };
  next();
}

module.exports = { requireBearerToken };
