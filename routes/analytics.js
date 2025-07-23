const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const { getDashboardSummary } = require('../controllers/analyticsController');

router.get('/summary', authenticateToken, authorize(['admin', 'government']), getDashboardSummary);

module.exports = router;