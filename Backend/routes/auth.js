const express = require('express');
const router = express.Router();

// Simple health check for auth routes
router.get('/health', (req, res) => {
  res.json({ 
    status: 'Auth routes working',
    message: 'Clerk authentication integrated' 
  });
});

// Clerk webhook placeholder
router.post('/webhook', (req, res) => {
  res.json({ received: true });
});

module.exports = router;