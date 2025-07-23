const { User } = require('../models');

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
    const { page = 1, limit = 10, role, search } = req.query;
    try {
        const query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { userId: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .select('-password')
            .exec();

        const count = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalUsers: count
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching users.', error: error.message });
    }
};

// @desc    Update a user's status (activate/deactivate)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = async (req, res) => {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: 'A boolean value for isActive is required.' });
    }

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent admin from deactivating their own account
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Administrators cannot change their own active status.' });
        }

        user.isActive = isActive;
        await user.save();

        res.json({
            message: `User status updated successfully. User is now ${isActive ? 'active' : 'inactive'}.`,
            user: {
                userId: user.userId,
                email: user.email,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating user status.', error: error.message });
    }
};