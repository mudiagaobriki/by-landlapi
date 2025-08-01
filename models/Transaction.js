const mongoose = require('mongoose');

// Transaction Schema
const TransactionSchema = new mongoose.Schema({
    transactionId: {
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

    // Transaction parties
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },

    // Transaction details
    transactionType: {
        type: String,
        enum: ['sale', 'rental', 'lease', 'transfer', 'inheritance'],
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'NGN',
        enum: ['NGN', 'USD', 'EUR', 'GBP']
    },

    // Fee breakdown
    agencyFee: {
        type: Number,
        default: 0,
        min: 0
    },
    governmentRevenue: {
        type: Number,
        default: 0,
        min: 0
    },
    platformFee: {
        type: Number,
        default: 0,
        min: 0
    },
    legalFees: {
        type: Number,
        default: 0,
        min: 0
    },
    surveyFees: {
        type: Number,
        default: 0,
        min: 0
    },
    stampDuty: {
        type: Number,
        default: 0,
        min: 0
    },

    // Payment information
    paymentMethod: {
        type: String,
        enum: ['bank_transfer', 'cash', 'check', 'online', 'installment', 'mortgage'],
        default: 'bank_transfer'
    },
    paymentReference: String,
    paymentProof: [String], // File paths to payment proofs
    installmentPlan: {
        isInstallment: { type: Boolean, default: false },
        totalInstallments: Number,
        installmentAmount: Number,
        frequency: {
            type: String,
            enum: ['monthly', 'quarterly', 'yearly']
        },
        payments: [{
            installmentNumber: Number,
            amount: Number,
            dueDate: Date,
            paidDate: Date,
            paymentReference: String,
            status: {
                type: String,
                enum: ['pending', 'paid', 'overdue'],
                default: 'pending'
            }
        }]
    },

    // Transaction documents
    documents: {
        saleAgreement: String,
        receiptOfPayment: String,
        deedOfAssignment: String,
        governmentConsent: String,
        powerOfAttorney: String,
        surveyPlan: String,
        taxClearance: String,
        bankDraft: String,
        autoGeneratedReceipt: String
    },

    // Receipt information
    receipt: {
        receiptNumber: {
            type: String,
            unique: true,
            sparse: true,
            index: true
        },
        generatedAt: Date,
        emailSentToBuyer: {
            type: Boolean,
            default: false
        },
        emailSentToSeller: {
            type: Boolean,
            default: false
        },
        emailSentToAdmin: {
            type: Boolean,
            default: false
        },
        emailSentToAgent: {
            type: Boolean,
            default: false
        },
        pdfPath: String,
        downloadCount: {
            type: Number,
            default: 0
        },
        lastDownloaded: Date
    },

    // Transaction status and workflow
    status: {
        type: String,
        enum: [
            'initiated',
            'payment_pending',
            'payment_confirmed',
            'documents_uploaded',
            'verified',
            'approved',
            'completed',
            'cancelled',
            'disputed',
            'refunded'
        ],
        default: 'initiated',
        index: true
    },
    workflow: {
        steps: [{
            stepName: {
                type: String,
                enum: ['initiation', 'payment', 'verification', 'approval', 'completion']
            },
            status: {
                type: String,
                enum: ['pending', 'in_progress', 'completed', 'failed']
            },
            completedAt: Date,
            completedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            notes: String
        }],
        currentStep: {
            type: String,
            enum: ['initiation', 'payment', 'verification', 'approval', 'completion']
        }
    },

    // Important dates
    paymentDate: Date,
    verificationDate: Date,
    approvalDate: Date,
    completionDate: Date,
    cancellationDate: Date,

    // Verification and approval
    verification: {
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        verificationNotes: String,
        documentsVerified: Boolean,
        paymentVerified: Boolean,
        legalRequirementsMet: Boolean
    },
    approval: {
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        approvalNotes: String,
        conditionalApproval: Boolean,
        conditions: [String]
    },

    // Legal and compliance
    legal: {
        lawyerAssigned: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        legalReviewCompleted: Boolean,
        legalReviewDate: Date,
        legalNotes: String,
        complianceChecklist: [{
            requirement: String,
            satisfied: Boolean,
            verifiedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            verifiedDate: Date
        }]
    },

    // Special transaction types
    specialConditions: {
        isInheritance: Boolean,
        inheritanceDetails: {
            deceasedOwner: String,
            probateGranted: Boolean,
            probateNumber: String,
            heirs: [{
                name: String,
                relationship: String,
                share: Number // Percentage
            }]
        },
        isCoOwnership: Boolean,
        coOwnershipDetails: {
            owners: [{
                owner: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                ownershipPercentage: Number
            }]
        },
        isMortgage: Boolean,
        mortgageDetails: {
            lender: String,
            loanAmount: Number,
            interestRate: Number,
            loanTerm: Number, // Years
            monthlyPayment: Number
        }
    },

    // Dispute handling
    disputes: [{
        disputeId: String,
        raisedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        disputeType: {
            type: String,
            enum: ['payment', 'documentation', 'ownership', 'fraud', 'misrepresentation']
        },
        description: String,
        evidenceDocuments: [String],
        status: {
            type: String,
            enum: ['open', 'investigating', 'resolved', 'closed'],
            default: 'open'
        },
        resolution: String,
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: { type: Date, default: Date.now },
        resolvedAt: Date
    }],

    // Communication log
    communications: [{
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
            enum: ['email', 'sms', 'call', 'meeting', 'notification']
        },
        subject: String,
        message: String,
        attachments: [String],
        sentAt: { type: Date, default: Date.now },
        deliveryStatus: {
            type: String,
            enum: ['sent', 'delivered', 'failed']
        }
    }],

    // Escrow information (for complex transactions)
    escrow: {
        isEscrowRequired: Boolean,
        escrowAgent: String,
        escrowAccount: String,
        escrowAmount: Number,
        escrowReleased: Boolean,
        escrowReleaseDate: Date,
        escrowConditions: [String]
    },

    // Audit trail
    auditTrail: [{
        action: String,
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: { type: Date, default: Date.now },
        details: mongoose.Schema.Types.Mixed,
        ipAddress: String,
        userAgent: String
    }],

    // Transaction metadata
    metadata: {
        source: {
            type: String,
            enum: ['web_app', 'mobile_app', 'api', 'admin_panel'],
            default: 'web_app'
        },
        priority: {
            type: String,
            enum: ['low', 'normal', 'high', 'urgent'],
            default: 'normal'
        },
        tags: [String],
        notes: [String],
        internalRemarks: String
    },

    // Performance tracking
    performance: {
        initiationToPayment: Number, // Hours
        paymentToVerification: Number, // Hours
        verificationToCompletion: Number, // Hours
        totalProcessingTime: Number, // Hours
        slaCompliant: Boolean,
        bottlenecks: [String]
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
TransactionSchema.index({ transactionId: 1, status: 1 });
TransactionSchema.index({ buyer: 1, status: 1 });
TransactionSchema.index({ seller: 1, status: 1 });
TransactionSchema.index({ agent: 1, status: 1 });
TransactionSchema.index({ landId: 1, status: 1 });
TransactionSchema.index({ transactionType: 1, status: 1 });
TransactionSchema.index({ createdAt: -1 });
TransactionSchema.index({ completionDate: -1 });
TransactionSchema.index({ 'receipt.receiptNumber': 1 });

// Virtual fields
TransactionSchema.virtual('totalAmount').get(function() {
    return this.amount + this.agencyFee + this.governmentRevenue +
        this.platformFee + this.legalFees + this.surveyFees + this.stampDuty;
});

TransactionSchema.virtual('processingDays').get(function() {
    if (!this.completionDate) return null;
    const diffTime = this.completionDate - this.createdAt;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

TransactionSchema.virtual('isOverdue').get(function() {
    if (this.status === 'completed' || this.status === 'cancelled') return false;

    const daysSinceCreation = (new Date() - this.createdAt) / (1000 * 60 * 60 * 24);
    const slaThreshold = {
        'payment_pending': 3,
        'payment_confirmed': 5,
        'verified': 2,
        'approved': 1
    };

    return daysSinceCreation > (slaThreshold[this.status] || 7);
});

TransactionSchema.virtual('nextPaymentDue').get(function() {
    if (!this.installmentPlan.isInstallment) return null;

    const pendingPayment = this.installmentPlan.payments.find(p => p.status === 'pending');
    return pendingPayment ? pendingPayment.dueDate : null;
});

// Instance methods
TransactionSchema.methods.addAuditEntry = function(action, performedBy, details, ipAddress, userAgent) {
    this.auditTrail.push({
        action,
        performedBy,
        details,
        ipAddress,
        userAgent,
        timestamp: new Date()
    });

    return this.save();
};

TransactionSchema.methods.updateStatus = function(newStatus, performedBy, notes) {
    const oldStatus = this.status;
    this.status = newStatus;

    // Update workflow
    if (this.workflow.steps) {
        const currentStepIndex = this.workflow.steps.findIndex(step =>
            step.stepName === this.workflow.currentStep
        );

        if (currentStepIndex !== -1) {
            this.workflow.steps[currentStepIndex].status = 'completed';
            this.workflow.steps[currentStepIndex].completedAt = new Date();
            this.workflow.steps[currentStepIndex].completedBy = performedBy;
        }
    }

    // Set relevant dates
    switch (newStatus) {
        case 'payment_confirmed':
            this.paymentDate = new Date();
            break;
        case 'verified':
            this.verificationDate = new Date();
            break;
        case 'approved':
            this.approvalDate = new Date();
            break;
        case 'completed':
            this.completionDate = new Date();
            break;
        case 'cancelled':
            this.cancellationDate = new Date();
            break;
    }

    // Add audit entry
    this.addAuditEntry(`Status changed from ${oldStatus} to ${newStatus}`, performedBy, { notes });

    return this.save();
};

TransactionSchema.methods.calculateFees = function() {
    // Recalculate all fees based on current rates
    this.agencyFee = this.agent ? this.amount * 0.10 : 0;
    this.governmentRevenue = this.amount * 0.05;
    this.platformFee = this.amount * 0.01;
    this.stampDuty = this.amount * 0.005; // 0.5% stamp duty

    return {
        agencyFee: this.agencyFee,
        governmentRevenue: this.governmentRevenue,
        platformFee: this.platformFee,
        stampDuty: this.stampDuty,
        totalFees: this.agencyFee + this.governmentRevenue + this.platformFee + this.stampDuty
    };
};

TransactionSchema.methods.addCommunication = function(from, to, type, subject, message, attachments) {
    this.communications.push({
        from,
        to: Array.isArray(to) ? to : [to],
        type,
        subject,
        message,
        attachments: attachments || [],
        sentAt: new Date(),
        deliveryStatus: 'sent'
    });

    return this.save();
};

TransactionSchema.methods.processInstallment = function(installmentNumber, paymentReference) {
    if (!this.installmentPlan.isInstallment) {
        throw new Error('This transaction is not set up for installment payments');
    }

    const payment = this.installmentPlan.payments.find(p => p.installmentNumber === installmentNumber);
    if (!payment) {
        throw new Error('Installment not found');
    }

    payment.paidDate = new Date();
    payment.paymentReference = paymentReference;
    payment.status = 'paid';

    // Check if all installments are paid
    const allPaid = this.installmentPlan.payments.every(p => p.status === 'paid');
    if (allPaid && this.status === 'payment_pending') {
        this.status = 'payment_confirmed';
        this.paymentDate = new Date();
    }

    return this.save();
};

// Static methods
TransactionSchema.statics.findByUser = function(userId) {
    return this.find({
        $or: [
            { buyer: userId },
            { seller: userId },
            { agent: userId }
        ]
    }).sort({ createdAt: -1 });
};

TransactionSchema.statics.getRevenueStats = function(dateFrom, dateTo) {
    const matchCriteria = {
        status: 'completed'
    };

    if (dateFrom || dateTo) {
        matchCriteria.completionDate = {};
        if (dateFrom) matchCriteria.completionDate.$gte = dateFrom;
        if (dateTo) matchCriteria.completionDate.$lte = dateTo;
    }

    return this.aggregate([
        { $match: matchCriteria },
        {
            $group: {
                _id: null,
                totalTransactions: { $sum: 1 },
                totalValue: { $sum: '$amount' },
                totalGovernmentRevenue: { $sum: '$governmentRevenue' },
                totalAgencyFees: { $sum: '$agencyFee' },
                totalPlatformFees: { $sum: '$platformFee' },
                averageTransactionValue: { $avg: '$amount' }
            }
        }
    ]);
};

TransactionSchema.statics.getAgentPerformance = function(agentId, dateFrom, dateTo) {
    const matchCriteria = {
        agent: mongoose.Types.ObjectId(agentId),
        status: 'completed'
    };

    if (dateFrom || dateTo) {
        matchCriteria.completionDate = {};
        if (dateFrom) matchCriteria.completionDate.$gte = dateFrom;
        if (dateTo) matchCriteria.completionDate.$lte = dateTo;
    }

    return this.aggregate([
        { $match: matchCriteria },
        {
            $group: {
                _id: '$agent',
                totalTransactions: { $sum: 1 },
                totalSalesValue: { $sum: '$amount' },
                totalCommissions: { $sum: '$agencyFee' },
                averageSaleValue: { $avg: '$amount' },
                averageProcessingTime: { $avg: '$performance.totalProcessingTime' }
            }
        }
    ]);
};

TransactionSchema.statics.getOverdueTransactions = function() {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    return this.find({
        status: { $in: ['payment_pending', 'payment_confirmed', 'verified'] },
        createdAt: { $lt: threeDaysAgo }
    }).populate('buyer seller agent', 'firstName lastName email');
};

TransactionSchema.statics.getTransactionTrends = function(period = '30d') {
    let dateFrom = new Date();

    switch (period) {
        case '7d':
            dateFrom.setDate(dateFrom.getDate() - 7);
            break;
        case '30d':
            dateFrom.setDate(dateFrom.getDate() - 30);
            break;
        case '90d':
            dateFrom.setDate(dateFrom.getDate() - 90);
            break;
        case '1y':
            dateFrom.setFullYear(dateFrom.getFullYear() - 1);
            break;
    }

    return this.aggregate([
        { $match: { createdAt: { $gte: dateFrom } } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                },
                count: { $sum: 1 },
                totalValue: { $sum: '$amount' },
                completedCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
};

// Pre-save middleware
TransactionSchema.pre('save', function(next) {
    // Update timestamp
    this.updatedAt = new Date();

    // Calculate performance metrics
    if (this.status === 'completed' && this.completionDate) {
        this.performance = this.performance || {};
        this.performance.totalProcessingTime =
            (this.completionDate - this.createdAt) / (1000 * 60 * 60); // Hours

        // Check SLA compliance
        const maxProcessingHours = 168; // 7 days
        this.performance.slaCompliant = this.performance.totalProcessingTime <= maxProcessingHours;
    }

    // Ensure workflow is initialized
    if (!this.workflow.steps || this.workflow.steps.length === 0) {
        this.workflow.steps = [
            { stepName: 'initiation', status: 'completed', completedAt: this.createdAt },
            { stepName: 'payment', status: 'pending' },
            { stepName: 'verification', status: 'pending' },
            { stepName: 'approval', status: 'pending' },
            { stepName: 'completion', status: 'pending' }
        ];
        this.workflow.currentStep = 'payment';
    }

    next();
});

// Post-save middleware
TransactionSchema.post('save', function(doc) {
    // Log important status changes
    if (this.isModified('status')) {
        console.log(`Transaction ${doc.transactionId} status changed to: ${doc.status}`);
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);