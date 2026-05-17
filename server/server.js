const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const exportRoute = require('./routes/export');
const licenseRoute = require('./routes/license');
const sendRoute = require('./routes/send');
const { mailConfig } = require('./services/mailer');

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
}));
app.use(express.json({ limit: '50mb' }));

app.use('/api/export', exportRoute);
app.use('/api/send', sendRoute);
app.use('/api', licenseRoute);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    downloads: 'paid',
    proPrice: 15,
    teamPrice: 39,
    adminConfigured: true,
    adminUrl: '/nblx-cffe300c-ctrl.html',
    smtpConfigured: mailConfig().configured,
  });
});

const clientDistDir = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistDir)) {
  app.get(['/nblx-cffe300c-ctrl', '/nblx-cffe300c-ctrl.html'], licenseRoute.requireAdmin, (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    return res.sendFile(path.join(clientDistDir, 'nblx-cffe300c-ctrl.html'));
  });

  app.get(['/nblx-emailix-admin', '/nblx-emailix-admin.html'], (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(404).send('Not found');
  });

  app.use(express.static(clientDistDir, {
    extensions: ['html'],
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0,
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html') || filePath.endsWith('robots.txt') || filePath.endsWith('sitemap.xml') || filePath.endsWith('ads.txt')) {
        res.setHeader('Cache-Control', 'no-store');
      }
    },
  }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(path.join(clientDistDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Emailix server -> http://localhost:${PORT}`);
  console.log(`Emailix admin -> http://localhost:${PORT}/nblx-cffe300c-ctrl.html`);
});
