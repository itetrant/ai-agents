// Serverless entrypoint cho Vercel (@vercel/node). Chi xu ly /api/* va
// /metrics (xem vercel.json) - public/ duoc @vercel/static-build serve
// truc tiep nen KHONG mount static/catch-all o day.
module.exports = require('../server/app');
