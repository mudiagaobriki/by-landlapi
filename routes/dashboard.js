const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getUserDashboardSummary } = require('../controllers/dashboardController');

// @route   GET /api/dashboard/summary
// @desc    Get dashboard summary for authenticated users
// @access  Private (All authenticated users)
router.get('/summary', authenticateToken, getUserDashboardSummary);

module.exports = router;