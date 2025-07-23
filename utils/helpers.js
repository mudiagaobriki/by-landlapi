const crypto = require('crypto');

// ID Generation Functions
const generateId = (prefix) => {
    return prefix + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

const generateCOfONumber = () => {
    return 'BAY-COF-' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
};

const generateReceiptNumber = () => {
    return 'RCP-BAY-' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
};

// Fee Calculation Functions
const calculateFees = (amount) => {
    return {
        agencyFee: amount * 0.10,      // 10% agency fee
        governmentRevenue: amount * 0.05, // 5% government revenue
        platformFee: amount * 0.01     // 1% platform fee
    };
};

const calculateTaxAmount = (area, yearsOwed = 1) => {
    const annualTax = area * 100; // ₦100 per square meter
    const groundRent = 10000;     // ₦10,000 annual ground rent
    return (annualTax + groundRent) * yearsOwed;
};

// Validation Functions
const validateCoordinates = (latitude, longitude) => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    return {
        isValid: lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180,
        latitude: lat,
        longitude: lng
    };
};

const validateLGA = (lga) => {
    const validLGAs = [
        'Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'
    ];
    return validLGAs.includes(lga);
};

const validatePhoneNumber = (phone) => {
    // Nigerian phone number validation
    const phoneRegex = /^(\+234|234|0)(70|80|81|90|91|80|81|70|90|91)\d{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Data Formatting Functions
const formatCurrency = (amount, currency = '₦') => {
    return `${currency}${amount.toLocaleString()}`;
};

const formatDate = (date, format = 'en-NG') => {
    return new Date(date).toLocaleDateString(format);
};

const formatAddress = (location) => {
    return `${location.address}, ${location.ward}, ${location.lga}, Bayelsa State`;
};

// File Upload Validation
const validateFileType = (file, allowedTypes) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    return allowedTypes.includes(fileExtension);
};

const validateFileSize = (file, maxSizeInMB) => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
};

// Security Functions
const generateSecureToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

const hashString = (str) => {
    return crypto.createHash('sha256').update(str).digest('hex');
};

// Date/Time Utilities
const getFinancialYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Nigerian financial year runs from January to December
    return month >= 0 ? year : year - 1;
};

const calculateYearsOwed = (lastPaidYear) => {
    const currentYear = getFinancialYear();
    return Math.max(0, currentYear - (lastPaidYear || currentYear - 1));
};

const isExpired = (expiryDate) => {
    return new Date() > new Date(expiryDate);
};

// Distance Calculation (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
};

// Pagination Helper
const getPagination = (page, limit, total) => {
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const totalPages = Math.ceil(total / itemsPerPage);

    return {
        currentPage,
        itemsPerPage,
        totalPages,
        total,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null
    };
};

// Search Query Builder
const buildSearchQuery = (params) => {
    const query = {};

    if (params.search) {
        query.$or = [
            { title: { $regex: params.search, $options: 'i' } },
            { description: { $regex: params.search, $options: 'i' } },
            { 'location.address': { $regex: params.search, $options: 'i' } }
        ];
    }

    if (params.lga) query['location.lga'] = new RegExp(params.lga, 'i');
    if (params.ward) query['location.ward'] = new RegExp(params.ward, 'i');
    if (params.landUse) query.landUse = params.landUse;
    if (params.status) query.status = params.status;
    if (params.forSale !== undefined) query.forSale = params.forSale === 'true';

    if (params.minPrice) query.salePrice = { $gte: parseFloat(params.minPrice) };
    if (params.maxPrice) query.salePrice = { ...query.salePrice, $lte: parseFloat(params.maxPrice) };

    if (params.minArea) query.area = { $gte: parseFloat(params.minArea) };
    if (params.maxArea) query.area = { ...query.area, $lte: parseFloat(params.maxArea) };

    return query;
};

// Error Response Helper
const createErrorResponse = (message, statusCode = 400, errors = null) => {
    const response = { message };
    if (errors) response.errors = errors;
    return { statusCode, response };
};

// Success Response Helper
const createSuccessResponse = (data, message = 'Success') => {
    return {
        statusCode: 200,
        response: {
            message,
            data,
            timestamp: new Date().toISOString()
        }
    };
};

module.exports = {
    generateId,
    generateCOfONumber,
    generateReceiptNumber,
    calculateFees,
    calculateTaxAmount,
    validateCoordinates,
    validateLGA,
    validatePhoneNumber,
    validateEmail,
    formatCurrency,
    formatDate,
    formatAddress,
    validateFileType,
    validateFileSize,
    generateSecureToken,
    hashString,
    getFinancialYear,
    calculateYearsOwed,
    isExpired,
    calculateDistance,
    getPagination,
    buildSearchQuery,
    createErrorResponse,
    createSuccessResponse
};