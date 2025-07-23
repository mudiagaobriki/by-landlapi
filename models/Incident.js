const mongoose = require('mongoose');

// Incident Schema
const IncidentSchema = new mongoose.Schema({
    incidentId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    landId: {
        type: String,
        required: true,
        index: true
    },
    propertyId: {
        type: String,
        index: true // Optional, for property-specific incidents
    },

    // Reporter information
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    reporterContact: {
        phone: String,
        email: String,
        alternateContact: String
    },
    reportDate: {
        type: Date,
        default: Date.now,
        index: true
    },

    // Incident classification
    incidentType: {
        type: String,
        enum: [
            'fraud',
            'boundary_dispute',
            'double_sale',
            'fake_documents',
            'illegal_occupation',
            'encroachment',
            'title_dispute',
            'inheritance_dispute',
            'agent_misconduct',
            'payment_fraud',
            'document_forgery',
            'identity_theft',
            'unauthorized_construction',
            'environmental_violation',
            'zoning_violation',
            'tax_evasion',
            'corruption',
            'extortion',
            'harassment',
            'other'
        ],
        required: true,
        index: true
    },
    subCategory: {
        type: String,
        enum: [
            // Fraud subcategories
            'sale_fraud', 'rental_fraud', 'mortgage_fraud', 'investment_fraud',
            // Boundary subcategories
            'fence_dispute', 'survey_dispute', 'access_rights', 'easement_dispute',
            // Document subcategories
            'forged_cofo', 'fake_survey', 'altered_deed', 'false_identity',
            // Construction subcategories
            'no_permit', 'exceeded_approval', 'wrong_location', 'safety_violation'
        ]
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
        index: true
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        default: 'medium'
    },

    // Incident details
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    detailedNarrative: {
        type: String,
        maxlength: 10000
    },

    // Location and timing
    incidentLocation: {
        specificLocation: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        },
        landmarks: [String],
        accessInstructions: String
    },
    incidentDate: {
        type: Date,
        index: true
    },
    timeOfIncident: String, // e.g., "14:30" or "Evening"

    // Parties involved
    involvedParties: [{
        party: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['complainant', 'respondent', 'witness', 'victim', 'perpetrator', 'other']
        },
        name: String, // For non-registered users
        contact: String,
        relationship: String,
        statement: String
    }],
    witnesses: [{
        name: String,
        contact: String,
        address: String,
        statement: String,
        isRegisteredUser: Boolean,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],

    // Evidence and documentation
    evidenceDocuments: [String], // File paths
    evidence: [{
        type: {
            type: String,
            enum: ['document', 'photo', 'video', 'audio', 'screenshot', 'receipt', 'contract', 'other']
        },
        filePath: String,
        fileName: String,
        description: String,
        uploadDate: { type: Date, default: Date.now },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        verified: Boolean,
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],

    // Financial impact
    financialImpact: {
        estimatedLoss: Number,
        actualLoss: Number,
        currency: { type: String, default: 'NGN' },
        recoveredAmount: Number,
        compensationSought: Number,
        compensationAwarded: Number
    },

    // Investigation and handling
    status: {
        type: String,
        enum: [
            'reported',
            'acknowledged',
            'investigating',
            'evidence_gathering',
            'analysis',
            'mediation',
            'legal_action',
            'resolved',
            'dismissed',
            'closed',
            'appealed'
        ],
        default: 'reported',
        index: true
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal',
        index: true
    },

    // Assignment and investigation
    assignedOfficer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    investigationTeam: [{
        officer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['lead_investigator', 'investigator', 'analyst', 'legal_advisor', 'technical_expert']
        },
        assignedDate: { type: Date, default: Date.now }
    }],

    // Investigation progress
    investigation: {
        startDate: Date,
        expectedCompletionDate: Date,
        actualCompletionDate: Date,
        methodology: String,
        findings: [{
            finding: String,
            evidence: [String],
            confidence: {
                type: String,
                enum: ['low', 'medium', 'high', 'certain']
            },
            recordedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            recordedDate: { type: Date, default: Date.now }
        }],
        interviews: [{
            interviewee: String,
            interviewDate: Date,
            interviewer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            summary: String,
            recordingPath: String,
            transcriptPath: String
        }],
        siteVisits: [{
            visitDate: Date,
            visitedBy: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }],
            purpose: String,
            findings: String,
            photos: [String],
            measurements: String,
            reportPath: String
        }]
    },

    // Resolution and outcome
    resolution: {
        type: String,
        maxlength: 2000
    },
    resolutionType: {
        type: String,
        enum: ['dismissed', 'mediated', 'compensation', 'legal_action', 'administrative_action', 'referred', 'other']
    },
    resolutionDate: Date,
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolutionDetails: {
        outcome: String,
        actions: [String],
        penalties: [String],
        compensation: {
            amount: Number,
            currency: { type: String, default: 'NGN' },
            paidTo: String,
            paymentDate: Date,
            paymentReference: String
        },
        preventiveMeasures: [String],
        followUpRequired: Boolean,
        followUpDate: Date
    },

    // Appeals and reviews
    appeal: {
        isAppealed: Boolean,
        appealDate: Date,
        appealedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        appealReason: String,
        appealStatus: {
            type: String,
            enum: ['pending', 'under_review', 'upheld', 'dismissed']
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewDate: Date,
        reviewOutcome: String
    },

    // Communication and notifications
    communications: [{
        date: { type: Date, default: Date.now },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        to: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        type: {
            type: String,
            enum: ['email', 'sms', 'letter', 'call', 'meeting', 'system_notification']
        },
        subject: String,
        message: String,
        attachments: [String],
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read', 'responded', 'failed']
        }
    }],

    // Related incidents and references
    relatedIncidents: [{
        incidentId: String,
        relationship: {
            type: String,
            enum: ['duplicate', 'similar', 'connected', 'follow_up', 'escalation']
        },
        description: String
    }],
    relatedTransactions: [String], // Transaction IDs
    relatedCases: [{
        caseNumber: String,
        court: String,
        status: String,
        outcome: String
    }],

    // External references
    externalReferences: {
        policeReportNumber: String,
        courtCaseNumber: String,
        efccReferenceNumber: String,
        icpcReferenceNumber: String,
        nigerianBarAssociationRef: String,
        surveyorsCouncilRef: String,
        otherReferences: [{
            organization: String,
            referenceNumber: String,
            dateReferred: Date,
            status: String
        }]
    },

    // Metadata and tracking
    metadata: {
        source: {
            type: String,
            enum: ['web_portal', 'mobile_app', 'phone_call', 'email', 'walk_in', 'referred'],
            default: 'web_portal'
        },
        language: { type: String, default: 'english' },
        reportingChannel: String,
        incidentNumber: String, // Human-readable incident number
        caseFileNumber: String,
        confidentialityLevel: {
            type: String,
            enum: ['public', 'restricted', 'confidential', 'secret'],
            default: 'public'
        },
        tags: [String],
        keywords: [String]
    },

    // Quality assurance
    qualityAssurance: {
        reviewed: Boolean,
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewDate: Date,
        qualityScore: {
            type: Number,
            min: 1,
            max: 10
        },
        reviewComments: String,
        improvementAreas: [String]
    },

    // Performance metrics
    performance: {
        acknowledgmentTime: Number, // Hours from report to acknowledgment
        investigationTime: Number, // Hours from assignment to completion
        resolutionTime: Number, // Hours from report to resolution
        slaCompliant: Boolean,
        escalationCount: Number,
        reopenCount: Number
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    acknowledgedAt: Date,
    assignedAt: Date,
    investigationStartedAt: Date,
    resolvedAt: Date,
    closedAt: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
IncidentSchema.index({ incidentId: 1, status: 1 });
IncidentSchema.index({ reportedBy: 1, status: 1 });
IncidentSchema.index({ assignedOfficer: 1, status: 1 });
IncidentSchema.index({ landId: 1, incidentType: 1 });
IncidentSchema.index({ incidentType: 1, severity: 1 });
IncidentSchema.index({ status: 1, priority: 1 });
IncidentSchema.index({ reportDate: -1 });
IncidentSchema.index({ 'metadata.confidentialityLevel': 1 });
IncidentSchema.index({ 'investigation.expectedCompletionDate': 1, status: 1 });

// Virtual fields
IncidentSchema.virtual('isOverdue').get(function() {
    if (this.status === 'resolved' || this.status === 'closed') return false;

    const slaHours = {
        'critical': 4,
        'high': 24,
        'medium': 72,
        'low': 168
    };

    const maxHours = slaHours[this.severity] || 72;
    const hoursSinceReport = (new Date() - this.reportDate) / (1000 * 60 * 60);

    return hoursSinceReport > maxHours;
});

IncidentSchema.virtual('daysSinceReport').get(function() {
    return Math.floor((new Date() - this.reportDate) / (1000 * 60 * 60 * 24));
});

IncidentSchema.virtual('isHighPriority').get(function() {
    return ['high', 'critical'].includes(this.severity) || ['high', 'urgent'].includes(this.priority);
});

IncidentSchema.virtual('incidentAge').get(function() {
    const days = this.daysSinceReport;
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.floor(days / 7)} weeks`;
    return `${Math.floor(days / 30)} months`;
});

// Instance methods
IncidentSchema.methods.assignOfficer = function(officerId, assignedBy) {
    this.assignedOfficer = officerId;
    this.assignedAt = new Date();
    this.status = this.status === 'reported' ? 'investigating' : this.status;

    this.investigation.startDate = new Date();
    this.investigationTeam.push({
        officer: officerId,
        role: 'lead_investigator',
        assignedDate: new Date()
    });

    return this.addAuditEntry('incident_assigned', assignedBy, { assignedTo: officerId });
};

IncidentSchema.methods.updateStatus = function(newStatus, updatedBy, notes) {
    const oldStatus = this.status;
    this.status = newStatus;

    // Set relevant timestamps
    switch (newStatus) {
        case 'acknowledged':
            this.acknowledgedAt = new Date();
            this.performance.acknowledgmentTime = (this.acknowledgedAt - this.reportDate) / (1000 * 60 * 60);
            break;
        case 'investigating':
            this.investigationStartedAt = new Date();
            break;
        case 'resolved':
            this.resolvedAt = new Date();
            this.performance.resolutionTime = (this.resolvedAt - this.reportDate) / (1000 * 60 * 60);
            break;
        case 'closed':
            this.closedAt = new Date();
            break;
    }

    return this.addAuditEntry(`status_changed_from_${oldStatus}_to_${newStatus}`, updatedBy, { notes });
};

IncidentSchema.methods.addEvidence = function(evidenceType, filePath, description, uploadedBy) {
    this.evidence.push({
        type: evidenceType,
        filePath: filePath,
        fileName: filePath.split('/').pop(),
        description: description,
        uploadedBy: uploadedBy,
        uploadDate: new Date(),
        verified: false
    });

    this.updatedAt = new Date();
    return this.save();
};

IncidentSchema.methods.addCommunication = function(from, to, type, subject, message, attachments) {
    this.communications.push({
        from: from,
        to: Array.isArray(to) ? to : [to],
        type: type,
        subject: subject,
        message: message,
        attachments: attachments || [],
        date: new Date(),
        status: 'sent'
    });

    return this.save();
};

IncidentSchema.methods.addAuditEntry = function(action, performedBy, details) {
    // This would typically be handled by a separate audit system
    console.log(`Audit: ${action} by ${performedBy} on incident ${this.incidentId}`, details);
    this.updatedAt = new Date();
    return this.save();
};

IncidentSchema.methods.escalate = function(reason, escalatedBy) {
    const currentPriority = this.priority;
    const priorityLevels = ['low', 'normal', 'high', 'urgent'];
    const currentIndex = priorityLevels.indexOf(currentPriority);

    if (currentIndex < priorityLevels.length - 1) {
        this.priority = priorityLevels[currentIndex + 1];
    }

    this.performance.escalationCount = (this.performance.escalationCount || 0) + 1;

    return this.addAuditEntry('incident_escalated', escalatedBy, { reason, oldPriority: currentPriority, newPriority: this.priority });
};

IncidentSchema.methods.addFinding = function(finding, evidence, confidence, recordedBy) {
    this.investigation.findings.push({
        finding: finding,
        evidence: evidence || [],
        confidence: confidence,
        recordedBy: recordedBy,
        recordedDate: new Date()
    });

    return this.save();
};

// Static methods
IncidentSchema.statics.findByReporter = function(reporterId) {
    return this.find({ reportedBy: reporterId }).sort({ reportDate: -1 });
};

IncidentSchema.statics.findByOfficer = function(officerId) {
    return this.find({
        assignedOfficer: officerId,
        status: { $nin: ['resolved', 'closed', 'dismissed'] }
    }).sort({ priority: -1, reportDate: 1 });
};

IncidentSchema.statics.findOverdue = function() {
    const now = new Date();
    const urgentThreshold = new Date(now - 4 * 60 * 60 * 1000); // 4 hours
    const highThreshold = new Date(now - 24 * 60 * 60 * 1000); // 24 hours
    const mediumThreshold = new Date(now - 72 * 60 * 60 * 1000); // 72 hours
    const lowThreshold = new Date(now - 7 * 24 * 60 * 60 * 1000); // 7 days

    return this.find({
        status: { $nin: ['resolved', 'closed', 'dismissed'] },
        $or: [
            { severity: 'critical', reportDate: { $lt: urgentThreshold } },
            { severity: 'high', reportDate: { $lt: highThreshold } },
            { severity: 'medium', reportDate: { $lt: mediumThreshold } },
            { severity: 'low', reportDate: { $lt: lowThreshold } }
        ]
    });
};

IncidentSchema.statics.getStatistics = function(dateFrom, dateTo) {
    const matchCriteria = {};
    if (dateFrom || dateTo) {
        matchCriteria.reportDate = {};
        if (dateFrom) matchCriteria.reportDate.$gte = dateFrom;
        if (dateTo) matchCriteria.reportDate.$lte = dateTo;
    }

    return this.aggregate([
        { $match: matchCriteria },
        {
            $group: {
                _id: null,
                totalIncidents: { $sum: 1 },
                resolvedIncidents: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                averageResolutionTime: { $avg: '$performance.resolutionTime' },
                highPriorityIncidents: { $sum: { $cond: [{ $in: ['$severity', ['high', 'critical']] }, 1, 0] } }
            }
        },
        {
            $addFields: {
                resolutionRate: { $divide: ['$resolvedIncidents', '$totalIncidents'] }
            }
        }
    ]);
};

IncidentSchema.statics.getIncidentTrends = function(period = '30d') {
    let dateFrom = new Date();
    switch (period) {
        case '7d': dateFrom.setDate(dateFrom.getDate() - 7); break;
        case '30d': dateFrom.setDate(dateFrom.getDate() - 30); break;
        case '90d': dateFrom.setDate(dateFrom.getDate() - 90); break;
        case '1y': dateFrom.setFullYear(dateFrom.getFullYear() - 1); break;
    }

    return this.aggregate([
        { $match: { reportDate: { $gte: dateFrom } } },
        {
            $group: {
                _id: {
                    year: { $year: '$reportDate' },
                    month: { $month: '$reportDate' },
                    day: { $dayOfMonth: '$reportDate' },
                    type: '$incidentType'
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
};

IncidentSchema.statics.getFraudPatterns = function() {
    return this.aggregate([
        { $match: { incidentType: { $in: ['fraud', 'double_sale', 'fake_documents', 'payment_fraud'] } } },
        {
            $group: {
                _id: {
                    type: '$incidentType',
                    severity: '$severity'
                },
                count: { $sum: 1 },
                totalLoss: { $sum: '$financialImpact.estimatedLoss' },
                averageLoss: { $avg: '$financialImpact.estimatedLoss' }
            }
        }
    ]);
};

// Pre-save middleware
IncidentSchema.pre('save', function(next) {
    this.updatedAt = new Date();

    // Generate human-readable incident number if not exists
    if (!this.metadata.incidentNumber) {
        const year = new Date().getFullYear();
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        this.metadata.incidentNumber = `INC-${year}${month}-${random}`;
    }

    // Calculate SLA compliance
    if (this.status === 'resolved' && this.resolvedAt) {
        const slaHours = {
            'critical': 24,
            'high': 72,
            'medium': 168,
            'low': 336
        };

        const maxHours = slaHours[this.severity] || 168;
        this.performance.slaCompliant = this.performance.resolutionTime <= maxHours;
    }

    next();
});

// Post-save middleware
IncidentSchema.post('save', function(doc) {
    if (this.isModified('status')) {
        console.log(`Incident ${doc.incidentId} status changed to: ${doc.status}`);
    }

    if (this.isModified('assignedOfficer')) {
        console.log(`Incident ${doc.incidentId} assigned to: ${doc.assignedOfficer}`);
    }
});

module.exports = mongoose.model('Incident', IncidentSchema);