const { Land, Transaction, Incident, User } = require('../models');

// @desc    Get a summary of platform statistics for a dashboard
// @route   GET /api/analytics/summary
// @access  Private (Admin, Government)
exports.getDashboardSummary = async (req, res) => {
    try {
        // Run queries in parallel for efficiency
        const [
            landStats,
            transactionStats,
            incidentStats,
            userStats
        ] = await Promise.all([
            Land.aggregate([
                { $group: { _id: null, totalLands: { $sum: 1 }, totalArea: { $sum: '$area' }, forSale: { $sum: { $cond: ['$forSale', 1, 0] } } } }
            ]),
            Transaction.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, totalRevenue: { $sum: '$governmentRevenue' }, totalTransactions: { $sum: 1 }, totalValue: { $sum: '$amount' } } }
            ]),
            Incident.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } }
            ])
        ]);

        // Format incident stats into a simple object
        const formattedIncidents = incidentStats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        // Format user stats into a simple object
        const formattedUsers = userStats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        const summary = {
            lands: {
                total: landStats[0]?.totalLands || 0,
                totalAreaHectares: landStats[0] ? parseFloat((landStats[0].totalArea / 10000).toFixed(2)) : 0,
                forSale: landStats[0]?.forSale || 0,
            },
            transactions: {
                totalCompleted: transactionStats[0]?.totalTransactions || 0,
                totalVolume: transactionStats[0]?.totalValue || 0,
                governmentRevenue: transactionStats[0]?.totalRevenue || 0,
            },
            incidents: formattedIncidents,
            users: formattedUsers
        };

        res.json({
            message: 'Dashboard summary fetched successfully.',
            summary
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error fetching dashboard summary.', error: error.message });
    }
};