const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Access token required',
                code: 'TOKEN_REQUIRED'
            });
        }

        // Use JWT_ACCESS_SECRET instead of JWT_SECRET since that's what we use for signing
        const jwtSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
        const decoded = jwt.verify(token, jwtSecret);

        // Get full user details
        const user = await User.findOne({ userId: decoded.userId }).select('-password');

        if (!user) {
            return res.status(401).json({
                message: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                message: 'Account is deactivated',
                code: 'ACCOUNT_DEACTIVATED'
            });
        }

        // Skip isVerified check since it's commented out in login
        // if (!user.isVerified) {
        //     return res.status(403).json({
        //         message: 'Account not verified',
        //         code: 'ACCOUNT_NOT_VERIFIED'
        //     });
        // }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                message: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }

        console.error('Authentication error:', error);
        return res.status(500).json({
            message: 'Authentication failed',
            code: 'AUTH_ERROR'
        });
    }
};

// Authorization middleware - checks user roles
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'User not authenticated',
                code: 'NOT_AUTHENTICATED'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required roles: ${roles.join(', ')}`,
                code: 'INSUFFICIENT_PERMISSIONS',
                userRole: req.user.role,
                requiredRoles: roles
            });
        }

        next();
    };
};

// Check if user owns the resource
const checkOwnership = (resourceField = 'owner') => {
    return (req, res, next) => {
        // This middleware should be used after the resource is fetched
        // and stored in req.resource
        if (!req.resource) {
            return res.status(404).json({
                message: 'Resource not found',
                code: 'RESOURCE_NOT_FOUND'
            });
        }

        const resourceOwner = req.resource[resourceField];
        const userId = req.user._id;

        // Handle both ObjectId and string comparisons
        const isOwner = resourceOwner.toString() === userId.toString();

        if (!isOwner && !['admin', 'government'].includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied. You can only access your own resources',
                code: 'OWNERSHIP_REQUIRED'
            });
        }

        next();
    };
};

// Optional authentication - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const jwtSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
            const decoded = jwt.verify(token, jwtSecret);
            const user = await User.findOne({ userId: decoded.userId }).select('-password');

            if (user && user.isActive) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};

// Rate limiting based on user role
const rateLimitByRole = (limits) => {
    return (req, res, next) => {
        const userRole = req.user?.role || 'guest';
        const userLimit = limits[userRole] || limits.default || 100;

        // Store in request for use by rate limiting middleware
        req.rateLimit = userLimit;
        next();
    };
};

// Check if user has specific permissions
const hasPermission = (permission) => {
    const rolePermissions = {
        admin: ['*'], // Admin has all permissions
        government: [
            'land:create', 'land:read', 'land:update', 'land:delete',
            'transaction:create', 'transaction:read', 'transaction:update', 'transaction:verify',
            'property:create', 'property:read', 'property:update',
            'incident:read', 'incident:update', 'incident:resolve',
            'verification:approve', 'tax:collect', 'analytics:view'
        ],
        surveyor: [
            'land:read', 'survey:upload', 'property:read'
        ],
        agent: [
            'land:read', 'transaction:create', 'property:read'
        ],
        court: [
            'land:read', 'transaction:read', 'incident:read', 'court:access'
        ],
        citizen: [
            'land:read', 'transaction:create', 'property:create', 'incident:create',
            'verification:request'
        ]
    };

    return (req, res, next) => {
        const userRole = req.user?.role;
        const permissions = rolePermissions[userRole] || [];

        if (permissions.includes('*') || permissions.includes(permission)) {
            return next();
        }

        return res.status(403).json({
            message: `Permission denied. Required permission: ${permission}`,
            code: 'PERMISSION_DENIED',
            userRole,
            requiredPermission: permission
        });
    };
};

// Validate API key for external integrations
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({
            message: 'API key required',
            code: 'API_KEY_REQUIRED'
        });
    }

    const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];

    if (!validApiKeys.includes(apiKey)) {
        return res.status(403).json({
            message: 'Invalid API key',
            code: 'INVALID_API_KEY'
        });
    }

    next();
};

module.exports = {
    authenticateToken,
    authorize,
    checkOwnership,
    optionalAuth,
    rateLimitByRole,
    hasPermission,
    validateApiKey
};