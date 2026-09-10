const path = require('path');
const express = require('express');
const { fail } = require('./lib/envelope');
const projectsRouter = require('./routes/projects');
const ordersRouter = require('./routes/orders');
const metricsHandler = require('./routes/metrics');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// --- API std (v1) -----------------------------------------------------
// /api/v1/projects: quy uoc REST bo sung cua nhom dev (envelope, phan trang,
// idempotency) - xem trang "API Standard" muc "Quy uoc REST bo sung".
// /api/v1/orders: minh hoa THUC THI chuan chinh thuc STD-API-SD-001 muc 5
// (multi-tenant/multi-channel qua header X-Authenticated-Scope + X-Channel-Id).

app.get('/api/v1/health', (req, res) => {
  res.json({ data: { status: 'ok', version: 'v1' } });
});

app.use('/api/v1/projects', projectsRouter);
app.use('/api/v1/orders', ordersRouter);

app.use('/api', (req, res) => {
  fail(res, 404, 'not_found', `Khong tim thay endpoint ${req.method} ${req.originalUrl}`);
});

// /metrics: minh hoa STD-API-SD-001 muc 11 - endpoint noi bo, KHONG di qua
// Kong, chi mo cho Prometheus server (xem loi giai thich trong routes/metrics.js).
app.get('/metrics', metricsHandler);

// --- Static frontend ----------------------------------------------------
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`developers.mmvietnam.com dang chay tai http://localhost:${PORT}`);
});
