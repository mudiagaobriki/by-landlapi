const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { generateId, generateSecureToken } = require('../utils/helpers');
const emailService = require('../services/emailService');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    console.log(req.body);
    const { email, password, firstName, lastName, phone, role, agencyName, licenseNumber } = req.body;

    console.log({ email, password, firstName, lastName, phone, role, agencyName, licenseNumber });

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object
        const user = new User({
            userId: generateId('USER'),
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            role,
            agencyName: role === 'agent' ? agencyName : undefined,
            licenseNumber: ['agent', 'surveyor'].includes(role) ? licenseNumber : undefined
        });

        const verificationToken = generateSecureToken();
        user.emailVerificationToken = verificationToken;

        await user.save();

        // Send welcome and verification email
        await emailService.sendAccountVerification(user.email, user, verificationToken);

        res.status(201).json({
            message: 'User registered successfully. Please check your email to verify your account.',
            userId: user.userId
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // if (!user.isVerified) {
        //     return res.status(403).json({ message: 'Account not verified. Please check your email.' });
        // }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated.' });
        }

        // Generate Access Token (short-lived)
        const accessToken = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '1h' // 1 hour
        });

        // Generate Refresh Token (long-lived)
        const refreshToken = jwt.sign({ userId: user.userId }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '30d' // 30 days
        });

        // Save refresh token to user model
        user.refreshToken = refreshToken;
        await user.save();

        // Send refresh token in a secure, httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({
            message: 'Login successful',
            accessToken,
            user: user.toSafeObject() // Use the safe object method
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

// @desc    Generate a new access token using a refresh token
// @route   POST /api/auth/refresh-token
// @access  Public (via cookie)
exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token not found.' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findOne({ userId: decoded.userId });
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token.' });
        }

        const accessToken = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '1h'
        });

        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired refresh token.' });
    }
};

// @desc    Logout user by clearing the refresh token
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
        res.status(200).json({ message: 'Logout successful.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during logout.' });
    }
};


// @desc    Forgot password - generate reset token
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Send success response even if user not found to prevent email enumeration
            return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        await emailService.sendPasswordReset(user.email, user, resetToken);

        res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};


// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    res.json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    const { firstName, lastName, phone, agencyName, address } = req.body;
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.phone = phone || user.phone;
            if (user.role === 'agent') {
                user.agencyName = agencyName || user.agencyName;
            }
            if (address) {
                user.address = { ...user.address, ...address };
            }

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating profile', error: error.message });
    }
};

// @desc    Verify token and get user info
// @route   GET /api/auth/verify
// @access  Private
exports.verifyToken = async (req, res) => {
    try {
        // If we reach here, the token is valid (middleware validated it)
        res.json({
            message: 'Token is valid',
            user: req.user.toSafeObject(),
            isValid: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error during token verification',
            error: error.message
        });
    }
};