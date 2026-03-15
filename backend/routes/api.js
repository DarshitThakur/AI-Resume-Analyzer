const express = require('express');
const router = express.Router();
const multer = require('multer');
const analyzerController = require('../controllers/analyzerController');

// Multer setup for memory storage (we process buffer directly for pdf-parse)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
router.post('/uploadResume', upload.single('resume'), analyzerController.uploadResume);
router.post('/analyzeResume', analyzerController.analyzeResume);
router.post('/matchJob', analyzerController.matchJob);

module.exports = router;
