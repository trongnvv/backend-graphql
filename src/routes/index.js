const router = require('express').Router();
router.get('/ping', async (req, res) => {
  res.json({ name: 'Service are running...', ping: 'PONG' });
});

module.exports = router;
