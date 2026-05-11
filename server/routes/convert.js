const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeEmailDesign } = require('../utils/ai');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only images and PDFs supported'));
  },
});

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // API key can come from header or form field
  const apiKey = req.headers['x-api-key'] || req.body?.apiKey;

  try {
    const blocks = await analyzeEmailDesign(req.file, apiKey);
    res.json({ blocks, count: blocks.length });
  } catch (err) {
    console.error('AI conversion error:', err.message);
    res.status(err.message.includes('API key') ? 401 : 500).json({ error: err.message });
  } finally {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, () => {});
    }
  }
});

module.exports = router;
