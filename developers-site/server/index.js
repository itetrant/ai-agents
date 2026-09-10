const path = require('path');
const express = require('express');
const { fail } = require('./lib/envelope');
const projectsRouter = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// --- API std (v1) -----------------------------------------------------
// Toan bo endpoint duoi day tuan theo "API Standard" mo ta trong site:
// envelope { data | error, meta }, versioning qua path /api/v1, phan trang
// qua ?page&limit, loi tra ve { error: { code, message, details } }.

app.get('/api/v1/health', (req, res) => {
  res.json({ data: { status: 'ok', version: 'v1' } });
});

app.use('/api/v1/projects', projectsRouter);

app.use('/api', (req, res) => {
  fail(res, 404, 'not_found', `Khong tim thay endpoint ${req.method} ${req.originalUrl}`);
});

// --- Static frontend ----------------------------------------------------
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`developers.mmvietnam.com dang chay tai http://localhost:${PORT}`);
});
