// Placeholder for reels route
const express = require('express');
const router = express.Router();

router.post('/generate', (req, res) => {
  const { lipSync } = req.body;
  console.log('Generating reel with lipSync:', lipSync);
  res.json({ success: true, jobId: '123' });
});

module.exports = router;
