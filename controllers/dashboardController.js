const { Land, Transaction, Incident, User, LandVerification, Property } = require('../models');

// @desc    Get dashboard summary for regular users (citizens, agents, surveyors)
// @route   GET /api/dashboard/summary
// @access  Private (All authenticated users)
exports.getUserDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let summary = {};

        // Base stats available to all users
        const [totalLands, totalUsers, totalTransactions] = await Promise.all([
            Land.countDocuments({ status: 'active' }),
            User.countDocuments({ isActive: true }),
            Transaction.countDocuments({ status: 'completed' })
        ]);

        summary.systemStats = {
            totalLands,
            totalUsers,
            totalTransactions,
            lastUpdated: new Date()
        };

        // Role-specific data
        if (userRole === 'citizen') {
            const [userLands, userTransactions, userVerifications, userProperties] = await Promise.all([
                Land.countDocuments({ owner: userId, status: 'active' }),
                Transaction.countDocuments({
                    $or: [{ buyerId: userId }, { sellerId: userId }],
                    status: 'completed'
                }),
                LandVerification.countDocuments({ requestedBy: userId }),
                Property.countDocuments({ owner: userId, status: 'active' })
            ]);

            summary.userStats = {
                landsOwned: userLands,
                propertiesOwned: userProperties,
                transactionsCompleted: userTransactions,
                verificationsRequested: userVerifications
            };

            // Recent transactions for this user
            summary.recentTransactions = await Transaction.find({
                $or: [{ buyerId: userId }, { sellerId: userId }]
            })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('landId', 'title location')
                .select('type amount status createdAt landId');

        } else if (userRole === 'agent') {
            const [agentTransactions, agentCommissions, activeListings] = await Promise.all([
                Transaction.countDocuments({ agentId: userId, status: 'completed' }),
                Transaction.aggregate([
                    { $match: { agentId: userId, status: 'completed' } },
                    { $group: { _id: null, totalCommissions: { $sum: '$agentCommission' } } }
                ]),
                Land.countDocuments({
                    $or: [{ listedBy: userId }, { agent: userId }],
                    forSale: true,
                    status: 'active'
                })
            ]);

            summary.agentStats = {
                transactionsFacilitated: agentTransactions,
                totalCommissionsEarned: agentCommissions[0]?.totalCommissions || 0,
                activeListings,
                successRate: agentTransactions > 0 ? ((agentTransactions / (agentTransactions + 5)) * 100).toFixed(1) : 0
            };

        } else if (userRole === 'surveyor') {
            const [surveysCompleted, pendingSurveys] = await Promise.all([
                Land.countDocuments({ surveyedBy: userId, 'survey.status': 'completed' }),
                Land.countDocuments({ surveyedBy: userId, 'survey.status': 'pending' })
            ]);

            summary.surveyorStats = {
                surveysCompleted,
                pendingSurveys,
                totalSurveys: surveysCompleted + pendingSurveys
            };
        }

        // Recent activity for all users
        summary.recentActivity = await getRecentActivityForUser(userId, userRole);

        // System-wide stats that don't require admin privileges
        summary.marketStats = {
            averageLandPrice: await getAverageLandPrice(),
            landsForSale: await Land.countDocuments({ forSale: true, status: 'active' }),
            propertiesForRent: await Property.countDocuments({ 'rental.isForRent': true, status: 'active' })
        };

        res.json({
            message: 'Dashboard summary fetched successfully.',
            summary,
            user: {
                name: req.user.firstName + ' ' + req.user.lastName,
                role: req.user.role,
                email: req.user.email
            }
        });

    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({
            message: 'Server error fetching dashboard summary.',
            error: error.message
        });
    }
};

// Helper function to get recent activity
async function getRecentActivityForUser(userId, userRole) {
    try {
        const activities = [];

        // Get recent transactions
        const recentTransactions = await Transaction.find({
            $or: [
                { buyerId: userId },
                { sellerId: userId },
                ...(userRole === 'agent' ? [{ agentId: userId }] : [])
            ]
        })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('landId', 'title');

        recentTransactions.forEach(transaction => {
            activities.push({
                type: 'transaction',
                description: `${transaction.type} transaction ${transaction.status}`,
                details: transaction.landId?.title || 'Land transaction',
                date: transaction.createdAt,
                status: transaction.status
            });
        });

        // Get recent verifications
        const recentVerifications = await LandVerification.find({
            requestedBy: userId
        })
            .sort({ createdAt: -1 })
            .limit(2);

        recentVerifications.forEach(verification => {
            activities.push({
                type: 'verification',
                description: `Land verification ${verification.status}`,
                details: verification.verificationId,
                date: verification.createdAt,
                status: verification.status
            });
        });

        // Sort by date and return top 5
        return activities
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

    } catch (error) {
        console.error('Error fetching recent activity:', error);
        return [];
    }
}

// Helper function to calculate average land price
async function getAverageLandPrice() {
    try {
        const result = await Land.aggregate([
            { $match: { status: 'active', price: { $exists: true, $gt: 0 } } },
            { $group: { _id: null, averagePrice: { $avg: '$price' } } }
        ]);
        return result[0]?.averagePrice || 0;
    } catch (error) {
        return 0;
    }
}