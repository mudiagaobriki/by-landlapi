const mongoose = require('mongoose');

// Land Schema
const LandSchema = new mongoose.Schema({
    landId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000
    },

    // Location details
    location: {
        address: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300
        },
        lga: {
            type: String,
            required: true,
            enum: ['Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'],
            index: true
        },
        ward: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
            index: true
        },
        coordinates: {
            latitude: {
                type: Number,
                required: true,
                min: -90,
                max: 90
            },
            longitude: {
                type: Number,
                required: true,
                min: -180,
                max: 180
            }
        },
        boundaryCoordinates: [{
            latitude: {
                type: Number,
                min: -90,
                max: 90
            },
            longitude: {
                type: Number,
                min: -180,
                max: 180
            },
            order: { type: Number }, // For ordering boundary points
            description: String // Optional description for the boundary point
        }],
        nearbyLandmarks: [String],
        accessRoads: [String]
    },

    // Physical characteristics
    area: {
        type: Number,
        required: true,
        min: 1 // Minimum 1 square meter
    },
    dimensions: {
        length: Number,
        width: Number,
        perimeter: Number,
        shape: {
            type: String,
            enum: ['rectangular', 'square', 'circular', 'irregular', 'triangular']
        }
    },
    landUse: {
        type: String,
        enum: ['residential', 'commercial', 'industrial', 'agricultural', 'mixed', 'recreational', 'educational', 'religious'],
        required: true,
        index: true
    },
    zoning: {
        type: String,
        enum: ['urban', 'suburban', 'rural', 'industrial_zone', 'commercial_zone', 'residential_zone']
    },

    // Ownership information
    currentOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    ownershipHistory: [{
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        acquiredDate: {
            type: Date,
            required: true
        },
        acquisitionType: {
            type: String,
            enum: ['purchase', 'inheritance', 'allocation', 'transfer', 'gift', 'court_order'],
            required: true
        },
        price: {
            type: Number,
            min: 0
        },
        documents: [String], // File paths to supporting documents
        notes: String,
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        verifiedAt: Date
    }],

    // Documentation
    surveyPlan: {
        filePath: String,
        surveyorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        surveyDate: Date,
        surveyNumber: String,
        scale: String,
        accuracy: {
            type: String,
            enum: ['high', 'medium', 'low']
        }
    },

    // Certificate of Occupancy
    cOfO: {
        number: {
            type: String,
            unique: true,
            sparse: true, // Allow null values but ensure uniqueness when present
            index: true
        },
        issueDate: Date,
        expiryDate: Date,
        status: {
            type: String,
            enum: ['active', 'expired', 'revoked', 'suspended'],
            default: 'active',
            index: true
        },
        documentPath: String,
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        conditions: [String], // Any conditions attached to the C of O
        renewalHistory: [{
            renewalDate: Date,
            expiryDate: Date,
            renewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }]
    },

    // Tax information
    taxInfo: {
        annualTax: {
            type: Number,
            min: 0,
            default: function() {
                return this.area * 100; // ₦100 per square meter
            }
        },
        lastPaidYear: Number,
        outstandingAmount: {
            type: Number,
            default: 0,
            min: 0
        },
        groundRent: {
            type: Number,
            default: 10000,
            min: 0
        },
        paymentHistory: [{
            year: Number,
            amount: Number,
            paymentDate: Date,
            paymentReference: String,
            paidBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }],
        exemptions: [{
            type: {
                type: String,
                enum: ['senior_citizen', 'disability', 'religious', 'educational', 'government']
            },
            percentage: Number,
            validFrom: Date,
            validTo: Date,
            approvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }]
    },

    // Land status and availability
    status: {
        type: String,
        enum: ['registered', 'pending', 'disputed', 'sold', 'transferred', 'frozen'],
        default: 'registered',
        index: true
    },
    forSale: {
        type: Boolean,
        default: false,
        index: true
    },
    salePrice: {
        type: Number,
        min: 0
    },
    saleDetails: {
        listedDate: Date,
        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        priceHistory: [{
            price: Number,
            dateChanged: Date,
            reason: String
        }],
        viewingSchedule: [{
            scheduledDate: Date,
            prospectiveBuyer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            status: {
                type: String,
                enum: ['scheduled', 'completed', 'cancelled']
            }
        }]
    },

    // Physical features and improvements
    features: {
        topography: {
            type: String,
            enum: ['flat', 'sloped', 'hilly', 'waterfront', 'swampy']
        },
        soilType: {
            type: String,
            enum: ['sandy', 'clay', 'loamy', 'rocky', 'mixed']
        },
        drainageSystem: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor', 'none']
        },
        waterSource: {
            type: String,
            enum: ['borehole', 'well', 'river', 'public_supply', 'none']
        },
        electricitySupply: {
            type: String,
            enum: ['grid', 'generator', 'solar', 'none']
        },
        roadAccess: {
            type: String,
            enum: ['tarred', 'untarred', 'footpath', 'waterway']
        },
        fencing: {
            type: String,
            enum: ['fully_fenced', 'partially_fenced', 'unfenced']
        },
        vegetation: [String],
        existingStructures: [String]
    },

    // Satellite imagery and media
    satelliteImagery: [String], // File paths to satellite images
    photos: [String], // File paths to ground photos
    videos: [String], // File paths to video tours
    documents: [String], // Additional supporting documents

    // Environmental and regulatory
    environmentalInfo: {
        floodRisk: {
            type: String,
            enum: ['low', 'medium', 'high']
        },
        environmentalAssessment: {
            required: Boolean,
            completed: Boolean,
            reportPath: String,
            assessmentDate: Date
        },
        restrictions: [String],
        easements: [String]
    },

    // Development potential
    developmentInfo: {
        buildingApproval: {
            required: Boolean,
            obtained: Boolean,
            approvalNumber: String,
            approvalDate: Date
        },
        maximumHeight: Number,
        buildingCoverage: Number, // Percentage
        setbacks: {
            front: Number,
            back: Number,
            left: Number,
            right: Number
        },
        utilities: {
            water: Boolean,
            electricity: Boolean,
            sewerage: Boolean,
            gas: Boolean,
            internet: Boolean
        }
    },

    // Valuation history
    valuationHistory: [{
        valuationDate: Date,
        marketValue: Number,
        governmentValue: Number,
        valuedBy: String, // Valuer name or organization
        purpose: {
            type: String,
            enum: ['sale', 'taxation', 'insurance', 'mortgage', 'legal']
        },
        reportPath: String
    }],

    // Timestamps and tracking
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
LandSchema.index({ landId: 1, status: 1 });
LandSchema.index({ currentOwner: 1, status: 1 });
LandSchema.index({ 'location.lga': 1, 'location.ward': 1 });
LandSchema.index({ landUse: 1, forSale: 1 });
LandSchema.index({ forSale: 1, salePrice: 1 });
LandSchema.index({ 'location.coordinates': '2dsphere' }); // Geospatial index
LandSchema.index({ 'cOfO.number': 1, 'cOfO.status': 1 });
LandSchema.index({ createdAt: -1 });
LandSchema.index({ area: 1, landUse: 1 });

// Virtual fields
LandSchema.virtual('formattedArea').get(function() {
    if (this.area >= 10000) {
        return `${(this.area / 10000).toFixed(2)} hectares`;
    }
    return `${this.area.toLocaleString()} sq. meters`;
});

LandSchema.virtual('isExpired').get(function() {
    return this.cOfO.expiryDate && this.cOfO.expiryDate < new Date();
});

LandSchema.virtual('taxStatus').get(function() {
    const currentYear = new Date().getFullYear();
    const lastPaidYear = this.taxInfo.lastPaidYear || 0;
    const yearsOwed = currentYear - lastPaidYear;

    if (yearsOwed <= 0) return 'current';
    if (yearsOwed <= 1) return 'due';
    return 'overdue';
});

LandSchema.virtual('fullAddress').get(function() {
    return `${this.location.address}, ${this.location.ward}, ${this.location.lga} LGA, Bayelsa State`;
});

// Instance methods
LandSchema.methods.calculateTaxOwed = function() {
    const currentYear = new Date().getFullYear();
    const lastPaidYear = this.taxInfo.lastPaidYear || currentYear - 1;
    const yearsOwed = Math.max(0, currentYear - lastPaidYear);
    const annualTotal = this.taxInfo.annualTax + this.taxInfo.groundRent;

    return {
        yearsOwed,
        annualTax: this.taxInfo.annualTax,
        groundRent: this.taxInfo.groundRent,
        totalOwed: annualTotal * yearsOwed + this.taxInfo.outstandingAmount
    };
};

LandSchema.methods.addOwnershipRecord = function(newOwner, acquisitionType, price, documents) {
    this.ownershipHistory.push({
        owner: this.currentOwner,
        acquiredDate: new Date(),
        acquisitionType,
        price,
        documents: documents || []
    });

    this.currentOwner = newOwner;
    this.updatedAt = new Date();

    return this.save();
};

LandSchema.methods.updateSaleStatus = function(forSale, salePrice, agentId) {
    this.forSale = forSale;
    this.salePrice = forSale ? salePrice : null;

    if (forSale) {
        this.saleDetails = this.saleDetails || {};
        this.saleDetails.listedDate = new Date();
        if (agentId) this.saleDetails.agent = agentId;
    }

    this.updatedAt = new Date();
    return this.save();
};

LandSchema.methods.addValuation = function(marketValue, governmentValue, valuedBy, purpose) {
    this.valuationHistory.push({
        valuationDate: new Date(),
        marketValue,
        governmentValue,
        valuedBy,
        purpose
    });

    return this.save();
};

// Static methods
LandSchema.statics.findByOwner = function(ownerId) {
    return this.find({ currentOwner: ownerId, status: { $ne: 'sold' } });
};

LandSchema.statics.findForSale = function(criteria = {}) {
    const query = { forSale: true, status: 'registered' };

    if (criteria.lga) query['location.lga'] = criteria.lga;
    if (criteria.landUse) query.landUse = criteria.landUse;
    if (criteria.minPrice) query.salePrice = { $gte: criteria.minPrice };
    if (criteria.maxPrice) query.salePrice = { ...query.salePrice, $lte: criteria.maxPrice };
    if (criteria.minArea) query.area = { $gte: criteria.minArea };
    if (criteria.maxArea) query.area = { ...query.area, $lte: criteria.maxArea };

    return this.find(query).populate('currentOwner', 'firstName lastName phone');
};

LandSchema.statics.findNearby = function(latitude, longitude, radiusInKm = 5) {
    return this.find({
        'location.coordinates': {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                $maxDistance: radiusInKm * 1000 // Convert to meters
            }
        }
    });
};

LandSchema.statics.getTaxDefaulters = function() {
    const currentYear = new Date().getFullYear();

    return this.aggregate([
        {
            $match: {
                $or: [
                    { 'taxInfo.lastPaidYear': { $lt: currentYear } },
                    { 'taxInfo.lastPaidYear': { $exists: false } },
                    { 'taxInfo.outstandingAmount': { $gt: 0 } }
                ]
            }
        },
        {
            $addFields: {
                yearsOwed: {
                    $subtract: [currentYear, { $ifNull: ['$taxInfo.lastPaidYear', currentYear - 1] }]
                }
            }
        },
        {
            $match: { yearsOwed: { $gt: 0 } }
        }
    ]);
};

LandSchema.statics.getStatistics = function() {
    return this.aggregate([
        {
            $group: {
                _id: null,
                totalLands: { $sum: 1 },
                totalArea: { $sum: '$area' },
                landsForSale: { $sum: { $cond: ['$forSale', 1, 0] } },
                averageSize: { $avg: '$area' }
            }
        },
        {
            $lookup: {
                from: 'lands',
                pipeline: [
                    { $group: { _id: '$landUse', count: { $sum: 1 } } }
                ],
                as: 'landUseBreakdown'
            }
        }
    ]);
};

// Pre-save middleware
LandSchema.pre('save', function(next) {
    // Update timestamp
    this.updatedAt = new Date();

    // Calculate tax if not set
    if (!this.taxInfo.annualTax) {
        this.taxInfo.annualTax = this.area * 100;
    }

    // Ensure ground rent is set
    if (!this.taxInfo.groundRent) {
        this.taxInfo.groundRent = 10000;
    }

    // Update C of O status if expired
    if (this.cOfO.expiryDate && this.cOfO.expiryDate < new Date() && this.cOfO.status === 'active') {
        this.cOfO.status = 'expired';
    }

    next();
});

// Post-save middleware
LandSchema.post('save', function(doc) {
    // Log significant changes
    if (this.isModified('currentOwner')) {
        console.log(`Land ownership changed: ${doc.landId} -> ${doc.currentOwner}`);
    }

    if (this.isModified('status')) {
        console.log(`Land status changed: ${doc.landId} -> ${doc.status}`);
    }
});

module.exports = mongoose.model('Land', LandSchema);