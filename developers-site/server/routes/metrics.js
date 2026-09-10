const { register } = require('../lib/metrics');

// Chan theo dung 2 lop cua STD-API-SD-001 muc 11.1: (1) tu choi neu di qua
// proxy/Kong, (2) chi cho phep IP nam trong whitelist PROMETHEUS_IPS.
//
// Rieng cho demo/dev cua site nay: neu PROMETHEUS_IPS chua duoc cau hinh,
// endpoint mo cho moi nguon de tien test cuc bo - day la NOI LONG CHI DE DEMO.
// Theo dung chuan, PROD PHAI luon cau hinh PROMETHEUS_IPS va mac dinh la
// TU CHOI (deny-by-default), khong duoc de trong.
async function metricsHandler(req, res) {
  if (req.headers['x-kong-request-id'] || req.headers['x-forwarded-for']) {
    return res.status(404).end();
  }

  const allowedIps = (process.env.PROMETHEUS_IPS || '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean);

  if (allowedIps.length > 0) {
    const srcIp = (req.socket.remoteAddress || '').replace('::ffff:', '');
    if (!allowedIps.includes(srcIp)) {
      return res.status(404).end();
    }
  }

  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
}

module.exports = metricsHandler;
