const { Incident, User, Land } = require('../models');
const { generateId } = require('../utils/helpers');
const emailService = require('../services/emailService');

// @desc    Report a new incident
// @route   POST /api/incidents
// @access  Private
exports.createIncident = async (req, res) => {
    const { landId, incidentType, title, description, incidentDate } = req.body;

    try {
        const land = await Land.findOne({ landId });
        if (!land) return res.status(404).json({ message: 'Land not found.' });

        const incident = new Incident({
            incidentId: generateId('INC'),
            landId,
            reportedBy: req.user._id,
            incidentType,
            title,
            description,
            incidentDate,
            'metadata.incidentNumber': generateId('INC-REF')
        });

        if (req.files) {
            incident.evidence = req.files.map(file => ({ filePath: file.path, fileName: file.originalname }));
        }

        await incident.save();

        // Notify admin/government
        const adminUsers = await User.find({ role: { $in: ['admin', 'government'] } });
        for (const admin of adminUsers) {
            await emailService.sendNotification(admin.email, 'New Incident Reported', `An incident titled "${title}" has been reported for Land ID: ${landId}`);
        }

        res.status(201).json({ message: 'Incident reported successfully.', incident });
    } catch (error) {
        res.status(500).json({ message: 'Server error reporting incident.', error: error.message });
    }
};

// @desc    Get all incidents
// @route   GET /api/incidents
// @access  Private (Government, Admin, Court)
exports.getAllIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().populate('reportedBy', 'firstName lastName');
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// @desc    Get incident by ID
// @route   GET /api/incidents/:id
// @access  Private (Government, Admin, Court)
exports.getIncidentById = async (req, res) => {
    try {
        const incident = await Incident.findOne({ incidentId: req.params.id }).populate('reportedBy investigationTeam.officer', 'firstName lastName');
        if (!incident) return res.status(404).json({ message: 'Incident not found.' });
        res.json(incident);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// @desc    Update incident status or assign officer
// @route   PUT /api/incidents/:id
// @access  Private (Government, Admin)
exports.updateIncident = async (req, res) => {
    const { status, assignedOfficerId, resolution } = req.body;
    try {
        const incident = await Incident.findOne({ incidentId: req.params.id });
        if (!incident) return res.status(404).json({ message: 'Incident not found.' });

        if (status) incident.status = status;
        if (resolution) incident.resolution = resolution;
        if (assignedOfficerId) {
            const officer = await User.findOne({ userId: assignedOfficerId });
            if (officer) incident.assignedOfficer = officer._id;
        }

        await incident.save();

        // Notify reporter
        const reporter = await User.findById(incident.reportedBy);
        await emailService.sendIncidentUpdate(reporter.email, reporter, incident);

        res.json({ message: 'Incident updated successfully.', incident });

    } catch (error) {
        res.status(500).json({ message: 'Server error updating incident.', error: error.message });
    }
};

// @desc    Assign an officer to an incident
// @route   PUT /api/incidents/:id/assign
// @access  Private (Admin, Government)
exports.assignOfficer = async (req, res) => {
    const { officerId } = req.body;
    try {
        const incident = await Incident.findOne({ incidentId: req.params.id });
        if (!incident) return res.status(404).json({ message: 'Incident not found.' });

        const officer = await User.findById(officerId);
        if (!officer || !['government', 'admin'].includes(officer.role)) {
            return res.status(400).json({ message: 'Invalid officer ID or user is not an officer.' });
        }

        incident.assignedOfficer = officer._id;
        incident.status = 'investigating';
        await incident.save();

        res.json({ message: `Incident assigned to ${officer.fullName}.`, incident });
    } catch (error) {
        res.status(500).json({ message: 'Server error assigning officer.', error: error.message });
    }
};