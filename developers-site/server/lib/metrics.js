const client = require('prom-client');

// STD-API-SD-001 muc 11: dung thu vien client Prometheus chinh thuc,
// khong tu viet code sinh chuoi metrics.
client.collectDefaultMetrics();

const appVersion = new client.Gauge({
  name: 'app_version',
  help: 'Phien ban service dang chay (label version), gia tri luon la 1',
  labelNames: ['version'],
});
appVersion.set({ version: require('../../package.json').version }, 1);

// Muc 11.4.3 - bat buoc cho service co co che retry + fallback logging.
// Demo nay khong that su day log ra ngoai nen luon giu gia tri 0.
const logFallbackActive = new client.Gauge({
  name: 'log_fallback_active',
  help: '1 = dang ghi log fallback local, 0 = binh thuong',
});
logFallbackActive.set(0);

module.exports = { register: client.register, logFallbackActive };
