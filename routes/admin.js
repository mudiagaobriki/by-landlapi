const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const { getAllUsers, updateUserStatus } = require('../controllers/adminController');

// Secure all admin routes
router.use(authenticateToken, authorize(['admin']));

router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);

module.exports = router;