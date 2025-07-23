const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    verifyToken // Add this import
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Auth endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.post('/refresh-token', refreshToken);

// Token verification
router.get('/verify', authenticateToken, verifyToken); // Add this route

// Password management
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Profile management
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;