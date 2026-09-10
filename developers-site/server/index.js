const path = require('path');
const express = require('express');
const app = require('./app');

const PORT = process.env.PORT || 4000;

// Chi dung khi chay Node "thuong" (npm run server / npm start). Tren
// Vercel, public/ duoc static-build serve rieng - xem api/index.js.
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`developers.mmvietnam.com dang chay tai http://localhost:${PORT}`);
});
