const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/database'); // Assuming you place database.js in a config folder
const { handleUploadErrors } = require('./middleware/upload'); // Import the error handler

const app = express();

// Connect to Database
connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const landRoutes = require('./routes/lands');
const propertyRoutes = require('./routes/properties');
const transactionRoutes = require('./routes/transactions');
const incidentRoutes = require('./routes/incidents');
const verificationRoutes = require('./routes/verification');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const dashboardRoutes = require('./routes/dashboard');

// Keep existing routes if they are still needed
// const surveyRoutes = require('./routes/survey');
// const analyticsRoutes = require('./routes/analytics');
// const taxRoutes = require('./routes/tax');
// const courtRoutes = require('./routes/court');
// const notificationRoutes = require('./routes/notifications');
// const marketplaceRoutes = require('./routes/marketplace');

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     credentials: true
// }));

app.use(cors())

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// // Keep existing routes if they are still needed
// app.use('/api/survey', surveyRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/tax', taxRoutes);
// app.use('/api/court', courtRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/marketplace', marketplaceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Use Multer error handler
app.use(handleUploadErrors);

// Global error handling middleware (should be after routes)
app.use((error, req, res, next) => {
    console.error('Error:', error);
    // ... (keep your existing global error handler logic)
    res.status(error.status || 500).json({
        message: error.message || 'Internal server error',
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Bayelsa Land Management System API running on port ${PORT}`);
});