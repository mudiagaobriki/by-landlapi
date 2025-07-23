const { Land, User } = require('../models');
const { generateId, generateCOfONumber } = require('../utils/helpers');
const PDFService = require('../services/pdfService');
const emailService = require('../services/emailService');

// @desc    Register a new land parcel
// @route   POST /api/lands
// @access  Private (Government, Admin)
exports.registerLand = async (req, res) => {
    const { title, description, location, area, landUse, currentOwnerId } = req.body;

    try {
        const owner = await User.findOne({ userId: currentOwnerId });
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        const newLand = new Land({
            landId: generateId('LAND'),
            title,
            description,
            location: JSON.parse(location),
            area,
            landUse,
            currentOwner: owner._id,
            createdBy: req.user._id,
            'cOfO.number': generateCOfONumber(),
            'cOfO.issueDate': new Date(),
            'cOfO.expiryDate': new Date(new Date().setFullYear(new Date().getFullYear() + 99))
        });

        // Handle file uploads
        if (req.files) {
            if (req.files.surveyPlan) {
                newLand.surveyPlan.filePath = req.files.surveyPlan[0].path;
            }
            if (req.files.satelliteImagery) {
                newLand.satelliteImagery = req.files.satelliteImagery.map(file => file.path);
            }
        }

        const savedLand = await newLand.save();
        res.status(201).json({ message: 'Land registered successfully', land: savedLand });
    } catch (error) {
        res.status(500).json({ message: 'Server error during land registration', error: error.message });
    }
};

// @desc    Get all lands with pagination
// @route   GET /api/lands
// @access  Public
exports.getAllLands = async (req, res) => {
    const { page = 1, limit = 10, forSale, lga } = req.query;
    try {
        const query = {};
        if (forSale) query.forSale = forSale === 'true';
        if (lga) query['location.lga'] = lga;

        const lands = await Land.find(query)
            .populate('currentOwner', 'firstName lastName')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Land.countDocuments(query);

        res.json({
            lands,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching lands', error: error.message });
    }
};

// @desc    Get a single land by ID
// @route   GET /api/lands/:id
// @access  Public
exports.getLandById = async (req, res) => {
    try {
        const land = await Land.findOne({ landId: req.params.id }).populate('currentOwner', 'firstName lastName email');
        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }
        res.json(land);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching land', error: error.message });
    }
};

// @desc    Generate and issue Certificate of Occupancy
// @route   POST /api/lands/:id/issue-cofo
// @access  Private (Government, Admin)
exports.issueCertificateOfOccupancy = async (req, res) => {
    try {
        const land = await Land.findOne({ landId: req.params.id }).populate('currentOwner');
        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }

        const pdfFileName = await PDFService.generateCertificatePDF(land, land.currentOwner);
        land.cOfO.documentPath = `documents/${pdfFileName}`;
        await land.save();

        await emailService.sendCertificateNotification(
            land.currentOwner.email,
            land.currentOwner,
            land,
            land.cOfO.number
        );

        res.json({
            message: 'Certificate of Occupancy generated and sent successfully',
            cOfOPath: land.cOfO.documentPath
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating C of O', error: error.message });
    }
};

// @desc    Update land tax information
// @route   PUT /api/lands/:id/tax
// @access  Private (Government, Admin)
exports.updateTaxInfo = async (req, res) => {
    const { lastPaidYear, outstandingAmount } = req.body;
    try {
        const land = await Land.findOne({ landId: req.params.id });
        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }

        land.taxInfo.lastPaidYear = lastPaidYear || land.taxInfo.lastPaidYear;
        land.taxInfo.outstandingAmount = outstandingAmount || land.taxInfo.outstandingAmount;

        await land.save();
        res.json({ message: 'Tax information updated successfully', land });
    } catch (error) {
        res.status(500).json({ message: 'Error updating tax info', error: error.message });
    }
};