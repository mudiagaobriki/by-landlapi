const { Property, Land, User } = require('../models');
const { generateId } = require('../utils/helpers');

// @desc    Register a new property on a land
// @route   POST /api/properties
// @access  Private
exports.registerProperty = async (req, res) => {
    const { landId, propertyType, propertySubtype, title, description, buildingDetails } = req.body;

    try {
        const land = await Land.findOne({ landId });
        if (!land) {
            return res.status(404).json({ message: 'Associated land not found.' });
        }

        // Check if the user owns the land
        if (land.currentOwner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only register properties on land you own.' });
        }

        const newProperty = new Property({
            propertyId: generateId('PROP'),
            landId,
            owner: req.user._id,
            propertyType,
            propertySubtype,
            title,
            description,
            buildingDetails: JSON.parse(buildingDetails)
        });

        // Handle file uploads
        if (req.files) {
            if (req.files.buildingPlan) {
                newProperty.buildingPlan.planDocument = req.files.buildingPlan[0].path;
            }
            if (req.files.images) {
                newProperty.media.photos = req.files.images.map(file => ({ filePath: file.path, title: file.originalname }));
            }
        }

        await newProperty.save();
        res.status(201).json({ message: 'Property registered successfully.', property: newProperty });

    } catch (error) {
        res.status(500).json({ message: 'Server error during property registration.', error: error.message });
    }
};

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getAllProperties = async (req, res) => {
    const { page = 1, limit = 10, type, forRent, forSale } = req.query;
    try {
        const query = {};
        if (type) query.propertyType = type;
        if (forRent) query['rental.isForRent'] = forRent === 'true';
        if (forSale) query['sale.isForSale'] = forSale === 'true';

        const properties = await Property.find(query)
            .populate('owner', 'firstName lastName')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Property.countDocuments(query);

        res.json({
            properties,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching properties.', error: error.message });
    }
};

// @desc    Get property by ID
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findOne({ propertyId: req.params.id }).populate('owner', 'firstName lastName email');
        if (!property) {
            return res.status(404).json({ message: 'Property not found.' });
        }
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching property.', error: error.message });
    }
};

// @desc    Generate a building license
// @route   POST /api/properties/:id/generate-license
// @access  Private (Government)
exports.generateBuildingLicense = async (req, res) => {
    try {
        const property = await Property.findOne({ propertyId: req.params.id });
        if (!property) {
            return res.status(404).json({ message: 'Property not found.' });
        }

        property.buildingLicense = {
            licenseNumber: generateId('LICENSE'),
            issueDate: new Date(),
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
            status: 'active',
            issuedBy: req.user._id
        };

        await property.save();
        res.json({ message: 'Building license generated successfully.', license: property.buildingLicense });
    } catch (error) {
        res.status(500).json({ message: 'Error generating license.', error: error.message });
    }
};