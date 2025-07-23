const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        select: false // Don't include password in queries by default
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ['admin', 'government', 'citizen', 'agent', 'court', 'surveyor'],
        required: true,
        index: true
    },
    isVerified: {
        type: Boolean,
        default: true,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // Role-specific fields
    licenseNumber: {
        type: String,
        sparse: true, // Allow null values but ensure uniqueness when present
        index: true
    },
    agencyName: {
        type: String,
        trim: true,
        maxlength: 100
    },
    courtLevel: {
        type: String,
        enum: ['magistrate', 'high_court', 'appeal_court', 'supreme_court']
    },

    // Profile information
    profileImage: String,
    address: {
        street: String,
        city: String,
        lga: String,
        state: { type: String, default: 'Bayelsa' },
        country: { type: String, default: 'Nigeria' }
    },

    // Verification and security
    emailVerified: {
        type: Boolean,
        default: false
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    lastLoginAt: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date,

    // Agent-specific fields
    agentProfile: {
        businessRegistrationNumber: String,
        yearsOfExperience: Number,
        specializations: [{
            type: String,
            enum: ['residential', 'commercial', 'industrial', 'agricultural']
        }],
        totalTransactions: {
            type: Number,
            default: 0
        },
        totalCommissions: {
            type: Number,
            default: 0
        },
        rating: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5
            },
            count: {
                type: Number,
                default: 0
            }
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },

    // Surveyor-specific fields
    surveyorProfile: {
        registrationNumber: String,
        qualifications: [String],
        surveysCompleted: {
            type: Number,
            default: 0
        },
        certificationExpiry: Date
    },

    // Government official fields
    governmentProfile: {
        department: String,
        position: String,
        employeeId: String,
        clearanceLevel: {
            type: String,
            enum: ['basic', 'confidential', 'secret', 'top_secret']
        }
    },

    // Notification preferences
    notifications: {
        email: {
            transactions: { type: Boolean, default: true },
            taxReminders: { type: Boolean, default: true },
            systemUpdates: { type: Boolean, default: true },
            marketing: { type: Boolean, default: false }
        },
        sms: {
            transactions: { type: Boolean, default: false },
            taxReminders: { type: Boolean, default: true },
            emergencyAlerts: { type: Boolean, default: true }
        }
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ role: 1, isVerified: 1 });
UserSchema.index({ 'agentProfile.isActive': 1, role: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
UserSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware
UserSchema.pre('save', function(next) {
    // Update timestamp
    this.updatedAt = new Date();

    // Ensure role-specific validations
    if (this.role === 'agent' && this.isModified('role')) {
        if (!this.agentProfile) {
            this.agentProfile = {};
        }
    }

    if (this.role === 'surveyor' && this.isModified('role')) {
        if (!this.surveyorProfile) {
            this.surveyorProfile = {};
        }
    }

    if (['admin', 'government'].includes(this.role) && this.isModified('role')) {
        if (!this.governmentProfile) {
            this.governmentProfile = {};
        }
    }

    next();
});

// Instance methods
UserSchema.methods.toSafeObject = function() {
    const user = this.toObject();
    delete user.password;
    delete user.loginAttempts;
    delete user.lockUntil;
    return user;
};

UserSchema.methods.incrementLoginAttempts = function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: {
                loginAttempts: 1
            },
            $unset: {
                lockUntil: 1
            }
        });
    }

    const updates = { $inc: { loginAttempts: 1 } };

    // If we're at max attempts and not already locked, lock the account
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
    }

    return this.updateOne(updates);
};

UserSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: {
            loginAttempts: 1,
            lockUntil: 1
        }
    });
};

// Static methods
UserSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase(), isActive: true });
};

UserSchema.statics.findActiveAgents = function() {
    return this.find({
        role: 'agent',
        isVerified: true,
        isActive: true,
        'agentProfile.isActive': true
    }).select('firstName lastName email agencyName licenseNumber agentProfile');
};

UserSchema.statics.getAgentStats = function(agentId) {
    return this.findById(agentId).select('agentProfile firstName lastName agencyName');
};

UserSchema.statics.findByCriteria = function(criteria = {}) {
    const query = { isActive: true };

    if (criteria.role) query.role = criteria.role;
    if (criteria.verified !== undefined) query.isVerified = criteria.verified;
    if (criteria.lga) query['address.lga'] = criteria.lga;

    return this.find(query);
};

// Validation
UserSchema.path('email').validate(function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}, 'Invalid email format');

UserSchema.path('phone').validate(function(phone) {
    const phoneRegex = /^(\+234|234|0)(70|80|81|90|91|70|80|81|90|91)\d{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}, 'Invalid Nigerian phone number');

// Conditional validation for role-specific fields
UserSchema.path('licenseNumber').validate(function(value) {
    if (['agent', 'surveyor'].includes(this.role)) {
        return value && value.length > 0;
    }
    return true;
}, 'License number is required for agents and surveyors');

UserSchema.path('agencyName').validate(function(value) {
    if (this.role === 'agent') {
        return value && value.length > 0;
    }
    return true;
}, 'Agency name is required for agents');

module.exports = mongoose.model('User', UserSchema);