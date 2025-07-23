const { LandVerification, Land, User } = require('../models');
const { generateId } = require('../utils/helpers');
const emailService = require('../services/emailService');

// @desc    Request a new land verification
// @route   POST /api/verification
// @access  Private
exports.requestVerification = async (req, res) => {
    const { landId, requestType, purpose, urgency } = req.body;

    try {
        const land = await Land.findOne({ landId });
        if (!land) return res.status(404).json({ message: 'Land not found.' });

        // Simple fee calculation
        let totalAmount = 5000; // Base fee
        if (urgency === 'express') totalAmount += 10000;
        if (urgency === 'urgent') totalAmount += 25000;

        const verification = new LandVerification({
            verificationId: generateId('VERIFY'),
            landId,
            requestedBy: req.user._id,
            requestType,
            purpose,
            urgency,
            totalAmount,
            'metadata.referenceNumber': generateId('VER-REF')
        });

        await verification.save();
        res.status(201).json({ message: 'Verification request submitted. Please proceed to payment.', verification });

    } catch (error) {
        res.status(500).json({ message: 'Server error requesting verification.', error: error.message });
    }
};

// @desc    Get a user's verification requests
// @route   GET /api/verification/my-requests
// @access  Private
exports.getMyVerifications = async (req, res) => {
    try {
        const verifications = await LandVerification.find({ requestedBy: req.user._id });
        res.json(verifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// @desc    Fulfill a verification request (shows ownership info)
// @route   GET /api/verification/:id/fulfill
// @access  Private
exports.fulfillVerification = async (req, res) => {
    try {
        const verification = await LandVerification.findOne({ verificationId: req.params.id });
        if (!verification) return res.status(404).json({ message: 'Verification request not found.' });

        // Security check: Only requester or admin can view
        if (verification.requestedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // Check payment status
        if (verification.paymentStatus !== 'paid') {
            return res.status(402).json({ message: 'Payment for this verification is pending.' });
        }

        const land = await Land.findOne({ landId: verification.landId }).populate('currentOwner', 'firstName lastName email phone');
        if (!land) return res.status(404).json({ message: 'Associated land not found.' });

        verification.status = 'completed';
        verification.completedAt = new Date();
        await verification.save();

        // Notify user
        await emailService.sendVerificationComplete(req.user.email, req.user, verification);

        res.json({
            message: 'Verification complete. Ownership details below.',
            landOwnershipInfo: {
                landId: land.landId,
                title: land.title,
                owner: land.currentOwner,
                ownershipHistory: land.ownershipHistory,
                status: land.status
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error fulfilling request.', error: error.message });
    }
};

// @desc    Confirm payment for a verification request
// @route   POST /api/verification/:id/confirm-payment
// @access  Private (Admin)
exports.confirmPayment = async (req, res) => {
    const { paymentReference, amount } = req.body;
    try {
        const verification = await LandVerification.findOne({ verificationId: req.params.id });
        if (!verification) return res.status(404).json({ message: 'Verification request not found.' });

        await verification.recordPayment(paymentReference, 'manual', amount, req.user._id);

        res.json({ message: 'Payment confirmed. Verification is now in progress.', verification });
    } catch (error) {
        res.status(500).json({ message: 'Error confirming payment.', error: error.message });
    }
};

// @desc    Update the status of a verification request
// @route   PUT /api/verification/:id/status
// @access  Private (Admin, Government)
exports.updateVerificationStatus = async (req, res) => {
    const { status, notes } = req.body;
    try {
        const verification = await LandVerification.findOne({ verificationId: req.params.id });
        if (!verification) return res.status(404).json({ message: 'Verification request not found.' });

        await verification.updateStatus(status, req.user._id, notes);

        res.json({ message: `Verification status updated to ${status}.`, verification });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status.', error: error.message });
    }
};