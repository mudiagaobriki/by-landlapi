const mongoose = require('mongoose');

// Land Verification Schema - Complete Implementation
const LandVerificationSchema = new mongoose.Schema({
    verificationId: {
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
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Verification request details
    requestType: {
        type: String,
        enum: ['ownership_check', 'title_verification', 'encumbrance_check', 'due_diligence', 'pre_purchase', 'legal_compliance', 'market_valuation'],
        default: 'ownership_check'
    },
    purpose: {
        type: String,
        enum: ['purchase', 'investment', 'legal_proceedings', 'due_diligence', 'mortgage', 'insurance', 'inheritance', 'court_case', 'tax_assessment', 'other'],
        required: true
    },
    urgency: {
        type: String,
        enum: ['standard', 'express', 'urgent'],
        default: 'standard'
    },

    // Client information
    clientDetails: {
        organization: String,
        contactPerson: String,
        relationship: {
            type: String,
            enum: ['owner', 'potential_buyer', 'legal_representative', 'financial_institution', 'government_agency', 'court', 'other']
        },
        authorizationDocument: String, // File path for authorization letter
        identificationDocument: String,
        powerOfAttorney: String
    },

    // Payment and pricing
    verificationFee: {
        type: Number,
        default: 5000,
        min: 0
    },
    expressCharge: {
        type: Number,
        default: 0,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'waived', 'partial'],
        default: 'pending',
        index: true
    },
    paymentReference: String,
    paymentMethod: {
        type: String,
        enum: ['bank_transfer', 'online', 'cash', 'check', 'mobile_money']
    },
    paymentDate: Date,
    refundDate: Date,
    refundReason: String,
    refundAmount: Number,

    // Payment history for partial payments
    paymentHistory: [{
        amount: Number,
        paymentDate: Date,
        paymentMethod: String,
        paymentReference: String,
        notes: String
    }],

    // Verification scope and requirements
    verificationScope: {
        ownershipVerification: { type: Boolean, default: true },
        titleDocumentCheck: { type: Boolean, default: true },
        encumbranceSearch: { type: Boolean, default: true },
        physicalInspection: { type: Boolean, default: false },
        marketValuation: { type: Boolean, default: false },
        legalComplianceCheck: { type: Boolean, default: false },
        neighborhoodAnalysis: { type: Boolean, default: false },
        environmentalAssessment: { type: Boolean, default: false },
        historicalResearch: { type: Boolean, default: false },
        riskAssessment: { type: Boolean, default: true }
    },

    // Ownership verification details
    ownershipDetails: {
        currentOwner: String,
        ownershipType: {
            type: String,
            enum: ['individual', 'joint', 'corporate', 'government', 'traditional', 'family', 'trust', 'cooperative', 'partnership']
        },
        acquisitionDate: Date,
        acquisitionType: {
            type: String,
            enum: ['purchase', 'inheritance', 'allocation', 'gift', 'court_order', 'merger', 'acquisition', 'other']
        },
        previousOwners: [{
            name: String,
            ownershipPeriod: {
                from: Date,
                to: Date
            },
            transferMethod: String,
            transferDate: Date,
            transferValue: Number
        }],
        ownershipDuration: String, // e.g., "5 years, 3 months"
        ownerRegistered: Boolean,
        ownerVerified: Boolean,
        ownershipPercentage: Number, // for joint ownership
        ownerContact: {
            available: Boolean,
            phone: String,
            email: String,
            address: String,
            verified: Boolean,
            lastContactDate: Date
        },
        powerOfAttorneyHolders: [{
            name: String,
            relationship: String,
            scope: String,
            validFrom: Date,
            validTo: Date,
            documentPath: String
        }]
    },

    // Title and documentation verification
    titleVerification: {
        certificateOfOccupancy: {
            exists: Boolean,
            number: String,
            issueDate: Date,
            expiryDate: Date,
            issuingAuthority: String,
            status: {
                type: String,
                enum: ['active', 'expired', 'revoked', 'suspended', 'pending_renewal', 'not_found']
            },
            verified: Boolean,
            verificationDate: Date,
            conditions: [String],
            originalDocument: Boolean,
            documentQuality: {
                type: String,
                enum: ['original', 'certified_copy', 'photocopy', 'scanned', 'questionable']
            },
            authenticity: {
                verified: Boolean,
                verificationMethod: String,
                verifiedBy: String,
                suspiciousElements: [String]
            }
        },

        deedOfAssignment: {
            exists: Boolean,
            parties: [{
                role: String, // assignor, assignee
                name: String,
                signature: Boolean,
                witnessed: Boolean
            }],
            executionDate: Date,
            registrationDate: Date,
            stampDutyPaid: Boolean,
            stampDutyAmount: Number,
            registered: Boolean,
            registrationNumber: String,
            verified: Boolean,
            legalCompliance: Boolean,
            documentIntegrity: {
                type: String,
                enum: ['intact', 'minor_damage', 'major_damage', 'altered', 'suspicious']
            }
        },

        surveyPlan: {
            exists: Boolean,
            surveyNumber: String,
            surveyor: String,
            surveyorLicense: String,
            surveyDate: Date,
            surveyMethod: String,
            accuracy: {
                type: String,
                enum: ['high', 'medium', 'low', 'questionable']
            },
            beaconNumbers: [String],
            coordinatesVerified: Boolean,
            boundariesClear: Boolean,
            boundaryDisputes: Boolean,
            adjacentProperties: [{
                direction: String,
                owner: String,
                landId: String
            }],
            discrepancies: [String],
            recommendedActions: [String]
        },

        taxClearance: {
            upToDate: Boolean,
            lastPaidYear: Number,
            outstandingAmount: Number,
            taxNumber: String,
            paymentHistory: [{
                year: Number,
                amount: Number,
                paymentDate: Date,
                receiptNumber: String
            }],
            penalties: Number,
            taxAssessment: Number,
            exemptions: [{
                type: String,
                reason: String,
                validPeriod: String
            }]
        },

        additionalDocuments: [{
            documentType: String,
            description: String,
            exists: Boolean,
            verified: Boolean,
            relevance: {
                type: String,
                enum: ['critical', 'important', 'supplementary', 'optional']
            },
            documentPath: String,
            issueDate: Date,
            expiryDate: Date,
            issuingAuthority: String
        }]
    },

    // Encumbrances and liabilities
    encumbrances: {
        hasEncumbrances: Boolean,
        encumbranceSearch: {
            searchDate: Date,
            searchedBy: String,
            searchPeriod: String, // e.g., "20 years"
            dataSource: String,
            comprehensiveness: {
                type: String,
                enum: ['comprehensive', 'standard', 'basic', 'limited']
            }
        },

        mortgages: [{
            lender: String,
            lenderType: {
                type: String,
                enum: ['bank', 'microfinance', 'cooperative', 'individual', 'government', 'other']
            },
            amount: Number,
            interestRate: Number,
            loanTerm: String,
            status: {
                type: String,
                enum: ['active', 'discharged', 'defaulted', 'foreclosure', 'restructured']
            },
            registrationDate: Date,
            maturityDate: Date,
            outstandingBalance: Number,
            paymentStatus: String,
            securityDocument: String
        }],

        liens: [{
            type: String,
            creditor: String,
            amount: Number,
            reason: String,
            status: String,
            dateImposed: Date,
            expectedResolution: Date,
            legalBasis: String,
            priority: Number
        }],

        caveats: [{
            caveatNumber: String,
            caveator: String,
            purpose: String,
            dateRegistered: Date,
            expiryDate: Date,
            status: String,
            legalGrounds: String,
            affectedRights: [String]
        }],

        legalCases: [{
            caseNumber: String,
            court: String,
            caseType: String,
            parties: [String],
            status: String,
            filingDate: Date,
            hearingDates: [Date],
            subject: String,
            potentialImpact: String,
            interimOrders: [String]
        }],

        disputes: [{
            disputeType: String,
            parties: [String],
            status: String,
            dateReported: Date,
            resolutionDate: Date,
            resolutionMethod: String,
            currentStage: String,
            disputeValue: Number,
            mediationAttempts: Number
        }],

        governmentAcquisition: {
            pending: Boolean,
            noticeDate: Date,
            purpose: String,
            acquisitionType: String,
            compensationOffered: Number,
            negotiationStatus: String,
            timeframe: String,
            affectedArea: String
        },

        restrictiveCovenants: [{
            type: String,
            description: String,
            imposedBy: String,
            dateImposed: Date,
            duration: String,
            enforceable: Boolean
        }],

        easements: [{
            type: String,
            beneficiary: String,
            purpose: String,
            area: String,
            duration: String,
            registered: Boolean
        }]
    },

    // Physical verification
    physicalVerification: {
        conducted: Boolean,
        verificationDate: Date,
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        verificationTeam: [{
            member: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            role: String,
            qualifications: String
        }],

        accessDetails: {
            accessRoute: String,
            accessDifficulty: {
                type: String,
                enum: ['easy', 'moderate', 'difficult', 'very_difficult', 'inaccessible']
            },
            transportUsed: String,
            accompaniedBy: String,
            permissionRequired: Boolean,
            securityConcerns: String
        },

        findings: {
            landExists: Boolean,
            landIdentifiable: Boolean,
            boundariesMatch: Boolean,
            boundaryMarkers: {
                present: Boolean,
                type: String,
                condition: String,
                beaconsFound: [String],
                missingBeacons: [String]
            },
            noEncroachment: Boolean,
            encroachmentDetails: [{
                type: String,
                location: String,
                extent: String,
                encroacher: String,
                timeframe: String
            }],
            accessibleByRoad: Boolean,
            roadCondition: String,
            developmentStatus: {
                type: String,
                enum: ['vacant', 'partially_developed', 'fully_developed', 'under_construction', 'abandoned', 'demolished']
            },
            currentUse: String,
            unauthorizedUse: Boolean,
            environmentalCondition: String,
            topography: String,
            vegetation: String,
            soilType: String,
            drainageCondition: String,
            floodRisk: {
                type: String,
                enum: ['none', 'low', 'moderate', 'high', 'severe']
            },
            observations: String,
            discrepancies: [String],
            photos: [{
                filePath: String,
                description: String,
                location: String,
                timestamp: Date,
                gpsCoordinates: {
                    latitude: Number,
                    longitude: Number
                }
            }],
            gpsCoordinates: [{
                point: String,
                latitude: Number,
                longitude: Number,
                accuracy: Number,
                elevation: Number
            }],
            measurements: [{
                dimension: String,
                measurement: Number,
                unit: String,
                method: String
            }],
            neighborhoodFactors: {
                development: String,
                infrastructure: String,
                amenities: [String],
                securitySituation: String,
                marketActivity: String
            }
        },

        recommendations: [String],
        urgentIssues: [String],
        followUpRequired: Boolean,
        followUpDate: Date,

        riskAssessment: {
            riskLevel: {
                type: String,
                enum: ['low', 'medium', 'high', 'critical'],
                default: 'low'
            },
            riskFactors: [String],
            mitigationSuggestions: [String],
            riskScore: {
                type: Number,
                min: 0,
                max: 100
            },
            riskCategory: [{
                category: String,
                score: Number,
                impact: String
            }]
        },

        weatherConditions: {
            date: Date,
            weather: String,
            temperature: Number,
            visibility: String,
            impact: String
        }
    },

    // Market valuation (if requested)
    valuation: {
        requested: Boolean,
        valuationType: {
            type: String,
            enum: ['market_value', 'forced_sale', 'insurance_value', 'mortgage_value', 'rental_value']
        },
        marketValue: Number,
        valuationDate: Date,
        valuationMethod: String,
        valuationBasis: String,
        valuationFactors: [String],

        comparableSales: [{
            landId: String,
            location: String,
            salePrice: Number,
            pricePerSqm: Number,
            saleDate: Date,
            area: Number,
            landUse: String,
            developmentStatus: String,
            proximity: Number, // distance in meters
            adjustments: [{
                factor: String,
                adjustment: Number,
                reason: String
            }],
            adjustedPrice: Number,
            weight: Number, // weighting in final valuation
            reliability: {
                type: String,
                enum: ['high', 'medium', 'low']
            }
        }],

        marketAnalysis: {
            marketCondition: {
                type: String,
                enum: ['strong', 'stable', 'weak', 'declining', 'recovering']
            },
            demandLevel: {
                type: String,
                enum: ['high', 'moderate', 'low', 'very_low']
            },
            supplyLevel: {
                type: String,
                enum: ['limited', 'adequate', 'abundant', 'oversupply']
            },
            pricetrend: {
                type: String,
                enum: ['increasing', 'stable', 'decreasing', 'volatile']
            },
            marketFactors: [String],
            futureProspects: String
        },

        valuationReport: String, // File path
        valuedBy: String, // Valuer name/organization
        valuerLicense: String,
        valuerQualifications: String,
        valuationStandards: String,
        validityPeriod: Number, // months
        assumptions: [String],
        limitations: [String]
    },

    // Legal compliance and regulatory checks
    legalCompliance: {
        zoningCompliance: {
            currentZoning: String,
            permittedUses: [String],
            prohibitedUses: [String],
            compliant: Boolean,
            violations: [String],
            pendingChanges: String
        },

        buildingRegulations: {
            setbackCompliance: Boolean,
            heightRestrictions: Boolean,
            densityCompliance: Boolean,
            coverageCompliance: Boolean,
            violations: [String]
        },

        environmentalCompliance: {
            environmentalClearance: Boolean,
            impactAssessment: String,
            environmentalRestrictions: [String],
            protectedAreaProximity: Boolean,
            waterBodyProximity: Boolean,
            contaminationRisk: {
                type: String,
                enum: ['none', 'low', 'moderate', 'high', 'severe']
            }
        },

        utilityServices: {
            electricityAvailable: Boolean,
            waterSupplyAvailable: Boolean,
            sewerageAvailable: Boolean,
            roadAccess: Boolean,
            telecommunicationsAvailable: Boolean,
            utilityApprovals: [String]
        }
    },

    // Verification workflow and status
    status: {
        type: String,
        enum: ['pending', 'payment_pending', 'in_progress', 'field_work', 'analysis', 'quality_review', 'completed', 'denied', 'expired', 'cancelled'],
        default: 'pending',
        index: true
    },

    workflowSteps: [{
        step: {
            type: String,
            enum: ['payment', 'document_collection', 'document_review', 'field_verification', 'data_analysis', 'report_generation', 'quality_check', 'client_review', 'delivery']
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed', 'skipped', 'failed']
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        startedAt: Date,
        completedAt: Date,
        estimatedDuration: Number, // hours
        actualDuration: Number, // hours
        notes: String,
        deliverables: [String],
        dependencies: [String]
    }],

    // Verification team and assignments
    assignedOfficers: [{
        officer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['lead_verifier', 'document_reviewer', 'field_officer', 'legal_analyst', 'valuer', 'quality_checker', 'report_writer']
        },
        assignedDate: { type: Date, default: Date.now },
        specialization: String,
        workload: Number, // percentage
        availability: String
    }],

    // Timeline and SLA tracking
    timeline: {
        requestDate: { type: Date, default: Date.now },
        acknowledgedDate: Date,
        workStartedDate: Date,
        fieldWorkDate: Date,
        draftReportDate: Date,
        qualityCheckDate: Date,
        clientReviewDate: Date,
        expectedCompletionDate: Date,
        actualCompletionDate: Date,
        deliveryDate: Date,

        standardSLA: { type: Number, default: 72 }, // Hours for standard verification
        expressSLA: { type: Number, default: 24 }, // Hours for express verification
        urgentSLA: { type: Number, default: 4 }, // Hours for urgent verification
        currentSLA: Number, // Actual SLA based on urgency
        slaCompliant: Boolean,

        delays: [{
            reason: String,
            delayDuration: Number, // hours
            impact: String,
            responsibleParty: String,
            mitigationAction: String
        }]
    },

    // Communication and notifications
    communications: [{
        date: { type: Date, default: Date.now },
        type: {
            type: String,
            enum: ['email', 'sms', 'call', 'meeting', 'letter', 'system_notification']
        },
        direction: {
            type: String,
            enum: ['inbound', 'outbound']
        },
        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        subject: String,
        message: String,
        attachments: [String],
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read', 'responded', 'failed']
        },
        followUpRequired: Boolean,
        followUpDate: Date,
        priority: {
            type: String,
            enum: ['low', 'normal', 'high', 'urgent']
        }
    }],

    // Client interaction and updates
    clientUpdates: [{
        updateDate: { type: Date, default: Date.now },
        updateType: {
            type: String,
            enum: ['status_change', 'progress_report', 'issue_notification', 'completion_notice', 'additional_requirement']
        },
        message: String,
        sentBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        acknowledged: Boolean,
        acknowledgmentDate: Date,
        clientResponse: String
    }],

    // Verification report and results
    verificationReport: {
        reportGenerated: Boolean,
        reportType: {
            type: String,
            enum: ['summary', 'detailed', 'technical', 'legal', 'comprehensive']
        },
        reportPath: String, // PDF report file path
        reportSize: Number, // file size in bytes
        reportPages: Number,
        reportGeneratedAt: Date,
        reportGeneratedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reportVersion: { type: Number, default: 1 },

        executiveSummary: String,
        keyFindings: [String],
        recommendations: [String],
        warnings: [String],
        limitations: [String],
        nextSteps: [String],

        certificateIssued: Boolean,
        certificateNumber: String,
        certificateType: String,
        certificateValidUntil: Date,
        certificatePath: String,

        appendices: [{
            title: String,
            description: String,
            filePath: String,
            type: String
        }],

        reviewed: Boolean,
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewDate: Date,
        reviewNotes: String
    },

    // Overall verification results
    results: {
        overallStatus: {
            type: String,
            enum: ['verified', 'verified_with_caution', 'not_verified', 'inconclusive', 'requires_further_investigation'],
            index: true
        },
        verificationScore: {
            type: Number,
            min: 0,
            max: 100
        },
        confidenceLevel: {
            type: String,
            enum: ['very_low', 'low', 'medium', 'high', 'very_high']
        },

        scoreBreakdown: {
            ownershipScore: Number,
            documentationScore: Number,
            legalScore: Number,
            physicalScore: Number,
            marketScore: Number,
            riskScore: Number
        },

        redFlags: [{
            severity: {
                type: String,
                enum: ['low', 'medium', 'high', 'critical']
            },
            category: String,
            description: String,
            impact: String,
            recommendation: String
        }],

        greenFlags: [{
            category: String,
            description: String,
            positiveImpact: String
        }],

        recommendations: [{
            priority: {
                type: String,
                enum: ['low', 'medium', 'high', 'urgent']
            },
            category: String,
            recommendation: String,
            reasoning: String,
            timeframe: String,
            cost: Number
        }],

        nextSteps: [{
            action: String,
            responsibility: String,
            timeframe: String,
            priority: String
        }],

        validityPeriod: Number, // Days
        expiryDate: Date,

        conditionalVerification: Boolean,
        conditions: [String],

        investmentRecommendation: {
            recommendation: {
                type: String,
                enum: ['strongly_recommend', 'recommend', 'proceed_with_caution', 'not_recommended', 'strongly_discourage']
            },
            reasoning: String,
            riskMitigation: [String]
        }
    },

    // Quality assurance
    qualityAssurance: {
        reviewRequired: Boolean,
        qualityChecklist: [{
            item: String,
            checked: Boolean,
            checkedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            checkedDate: Date,
            notes: String
        }],
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
        reviewNotes: String,
        improvementAreas: [String],
        approved: Boolean,
        approvalDate: Date,
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        revision: {
            required: Boolean,
            revisionNotes: String,
            revisedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            revisionDate: Date
        }
    },

    // Customer feedback
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        aspectRatings: {
            timeliness: Number,
            accuracy: Number,
            thoroughness: Number,
            professionalism: Number,
            communication: Number,
            valueForMoney: Number
        },
        comment: String,
        satisfactionLevel: {
            type: String,
            enum: ['very_dissatisfied', 'dissatisfied', 'neutral', 'satisfied', 'very_satisfied']
        },
        wouldRecommend: Boolean,
        wouldUseAgain: Boolean,
        improvementSuggestions: [String],
        feedbackDate: Date,
        feedbackMethod: {
            type: String,
            enum: ['online_form', 'phone_call', 'email', 'in_person', 'survey']
        },
        followUpConsent: Boolean
    },

    // Related records and references
    relatedVerifications: [String], // Other verification IDs for the same land
    relatedTransactions: [String], // Transaction IDs that might be related
    relatedIncidents: [String], // Incident IDs if any issues were found
    relatedProperties: [String], // Property IDs if buildings exist on the land

    // External references
    externalReferences: {
        surveyorGeneralFile: String,
        landUseActFile: String,
        courtCaseNumbers: [String],
        bankReferenceNumbers: [String],
        insuranceClaimNumbers: [String],
        governmentFileNumbers: [String],
        previousVerificationReports: [String]
    },

    // Metadata and tracking
    metadata: {
        requestSource: {
            type: String,
            enum: ['web_portal', 'mobile_app', 'agent_request', 'government_initiative', 'court_order', 'api_request'],
            default: 'web_portal'
        },
        sourceDetails: {
            platform: String,
            version: String,
            referrer: String
        },
        requestChannel: String,
        ipAddress: String,
        userAgent: String,
        sessionId: String,
        referenceNumber: String, // Human-readable reference
        fileNumber: String, // Internal filing system reference
        caseNumber: String, // For legal cases
        projectCode: String, // For large projects
        clientReference: String, // Client's own reference number

        processingLocation: String,
        processingTeam: String,
        complexity: {
            type: String,
            enum: ['simple', 'standard', 'complex', 'very_complex']
        },

        internalNotes: String,
        confidentialNotes: String,
        tags: [String],
        keywords: [String],

        dataPrivacy: {
            consentGiven: Boolean,
            consentDate: Date,
            dataRetentionPeriod: Number, // years
            shareWithThirdParties: Boolean,
            anonymizeAfterCompletion: Boolean
        }
    },

    // Compliance and regulatory
    compliance: {
        regulatoryRequirements: [String],
        complianceChecklist: [{
            requirement: String,
            compliant: Boolean,
            evidence: String,
            notes: String
        }],
        dataProtectionCompliance: Boolean,
        professionalStandards: [String],
        ethicalConsiderations: [String],
        conflictOfInterest: {
            declared: Boolean,
            details: String,
            mitigationMeasures: [String]
        }
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
        userAgent: String,
        location: String,
        deviceInfo: String,
        sessionId: String,
        changesMade: [String],
        previousValues: mongoose.Schema.Types.Mixed,
        newValues: mongoose.Schema.Types.Mixed,
        reasonForChange: String,
        approvalRequired: Boolean,
        approved: Boolean,
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],

    // Performance metrics
    performance: {
        processingTime: {
            acknowledgment: Number, // hours from request to acknowledgment
            workStart: Number, // hours from acknowledgment to work start
            fieldWork: Number, // hours for field work
            analysis: Number, // hours for data analysis
            reporting: Number, // hours for report generation
            qualityCheck: Number, // hours for quality review
            delivery: Number, // hours from completion to delivery
            total: Number // total processing time
        },

        efficiency: {
            slaCompliance: Boolean,
            resourceUtilization: Number, // percentage
            costEffectiveness: Number,
            clientSatisfaction: Number,
            qualityScore: Number,
            reworkRequired: Boolean,
            issuesEncountered: Number
        },

        benchmarks: {
            industryStandard: Number,
            organizationAverage: Number,
            performance: {
                type: String,
                enum: ['excellent', 'above_average', 'average', 'below_average', 'poor']
            }
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
    },
    completedAt: Date,
    deliveredAt: Date,
    expiresAt: Date,
    archivedAt: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
LandVerificationSchema.index({ verificationId: 1, status: 1 });
LandVerificationSchema.index({ requestedBy: 1, status: 1 });
LandVerificationSchema.index({ landId: 1, status: 1 });
LandVerificationSchema.index({ paymentStatus: 1, status: 1 });
LandVerificationSchema.index({ 'timeline.expectedCompletionDate': 1, status: 1 });
LandVerificationSchema.index({ createdAt: -1 });
LandVerificationSchema.index({ 'results.overallStatus': 1 });
LandVerificationSchema.index({ 'metadata.referenceNumber': 1 });
LandVerificationSchema.index({ urgency: 1, status: 1 });
LandVerificationSchema.index({ 'assignedOfficers.officer': 1, status: 1 });

// Text index for search functionality
LandVerificationSchema.index({
    'metadata.referenceNumber': 'text',
    landId: 'text',
    'ownershipDetails.currentOwner': 'text'
});

// Virtual fields
LandVerificationSchema.virtual('isOverdue').get(function() {
    if (this.status === 'completed' || this.status === 'cancelled') return false;
    return this.timeline.expectedCompletionDate && new Date() > this.timeline.expectedCompletionDate;
});

LandVerificationSchema.virtual('daysRemaining').get(function() {
    if (!this.timeline.expectedCompletionDate) return null;
    const diffTime = this.timeline.expectedCompletionDate - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

LandVerificationSchema.virtual('processingTime').get(function() {
    const endDate = this.completedAt || new Date();
    const diffTime = endDate - this.createdAt;
    return Math.round(diffTime / (1000 * 60 * 60)); // Hours
});

LandVerificationSchema.virtual('isExpired').get(function() {
    return this.expiresAt && new Date() > this.expiresAt;
});

LandVerificationSchema.virtual('riskLevel').get(function() {
    if (this.physicalVerification && this.physicalVerification.riskAssessment) {
        return this.physicalVerification.riskAssessment.riskLevel;
    }
    return 'unknown';
});

LandVerificationSchema.virtual('completionProgress').get(function() {
    if (!this.workflowSteps || this.workflowSteps.length === 0) return 0;
    const completedSteps = this.workflowSteps.filter(step => step.status === 'completed').length;
    return (completedSteps / this.workflowSteps.length) * 100;
});

LandVerificationSchema.virtual('estimatedTimeRemaining').get(function() {
    if (this.status === 'completed') return 0;

    const remainingSteps = this.workflowSteps.filter(step =>
        step.status === 'pending' || step.status === 'in_progress'
    );

    return remainingSteps.reduce((total, step) => {
        return total + (step.estimatedDuration || 0);
    }, 0);
});

// Instance methods
LandVerificationSchema.methods.updateStatus = function(newStatus, updatedBy, notes) {
    const oldStatus = this.status;
    this.status = newStatus;

    // Update relevant timestamps
    switch (newStatus) {
        case 'in_progress':
            this.timeline.workStartedDate = new Date();
            break;
        case 'field_work':
            this.timeline.fieldWorkDate = new Date();
            break;
        case 'analysis':
            this.timeline.draftReportDate = new Date();
            break;
        case 'quality_review':
            this.timeline.qualityCheckDate = new Date();
            break;
        case 'completed':
            this.completedAt = new Date();
            this.timeline.actualCompletionDate = new Date();

            // Calculate SLA compliance
            const processingHours = (this.completedAt - this.createdAt) / (1000 * 60 * 60);
            this.timeline.slaCompliant = processingHours <= this.timeline.currentSLA;
            this.performance.processingTime.total = processingHours;
            break;
        case 'cancelled':
            this.timeline.actualCompletionDate = new Date();
            break;
    }

    // Add to audit trail
    this.auditTrail.push({
        action: `Status changed from ${oldStatus} to ${newStatus}`,
        performedBy: updatedBy,
        details: { notes, previousStatus: oldStatus, newStatus },
        timestamp: new Date()
    });

    this.updatedAt = new Date();
    return this.save();
};

LandVerificationSchema.methods.assignOfficer = function(officerId, role, assignedBy) {
    // Remove existing officer with same role
    this.assignedOfficers = this.assignedOfficers.filter(ao => ao.role !== role);

    // Add new officer
    this.assignedOfficers.push({
        officer: officerId,
        role: role,
        assignedDate: new Date()
    });

    // Update workflow step if applicable
    const stepMapping = {
        'document_reviewer': 'document_review',
        'field_officer': 'field_verification',
        'legal_analyst': 'data_analysis',
        'valuer': 'data_analysis',
        'report_writer': 'report_generation',
        'quality_checker': 'quality_check'
    };

    if (stepMapping[role]) {
        const step = this.workflowSteps.find(ws => ws.step === stepMapping[role]);
        if (step) {
            step.assignedTo = officerId;
            if (step.status === 'pending') {
                step.status = 'in_progress';
                step.startedAt = new Date();
            }
        }
    }

    this.auditTrail.push({
        action: `Officer assigned for ${role}`,
        performedBy: assignedBy,
        details: { officerId, role },
        timestamp: new Date()
    });

    return this.save();
};

LandVerificationSchema.methods.recordPayment = function(paymentRef, paymentMethod, amount, paidBy) {
    // Handle partial payments
    if (amount < this.totalAmount) {
        this.paymentHistory.push({
            amount: amount,
            paymentDate: new Date(),
            paymentMethod: paymentMethod,
            paymentReference: paymentRef
        });

        const totalPaid = this.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);

        if (totalPaid >= this.totalAmount) {
            this.paymentStatus = 'paid';
        } else {
            this.paymentStatus = 'partial';
        }
    } else {
        this.paymentStatus = 'paid';
        this.paymentHistory.push({
            amount: amount,
            paymentDate: new Date(),
            paymentMethod: paymentMethod,
            paymentReference: paymentRef
        });
    }

    this.paymentReference = paymentRef;
    this.paymentMethod = paymentMethod;
    this.paymentDate = new Date();

    // Update status and set SLA
    if (this.paymentStatus === 'paid' && this.status === 'payment_pending') {
        this.status = 'in_progress';
        this.timeline.workStartedDate = new Date();
    }

    // Set SLA based on urgency
    const slaHours = {
        'standard': 72,
        'express': 24,
        'urgent': 4
    };

    this.timeline.currentSLA = slaHours[this.urgency] || 72;
    this.timeline.expectedCompletionDate = new Date(Date.now() + this.timeline.currentSLA * 60 * 60 * 1000);

    this.auditTrail.push({
        action: 'Payment recorded',
        performedBy: paidBy,
        details: { paymentRef, paymentMethod, amount: amount },
        timestamp: new Date()
    });

    return this.save();
};

LandVerificationSchema.methods.completeStep = function(stepName, completedBy, notes, deliverables = []) {
    const step = this.workflowSteps.find(ws => ws.step === stepName);
    if (step) {
        step.status = 'completed';
        step.completedAt = new Date();
        step.notes = notes;
        step.deliverables = deliverables;

        if (step.startedAt) {
            step.actualDuration = (step.completedAt - step.startedAt) / (1000 * 60 * 60); // hours
        }

        this.auditTrail.push({
            action: `Step completed: ${stepName}`,
            performedBy: completedBy,
            details: { notes, deliverables },
            timestamp: new Date()
        });
    }

    // Auto-progress status based on completed steps
    this.autoProgressStatus();

    return this.save();
};

LandVerificationSchema.methods.autoProgressStatus = function() {
    const completedSteps = this.workflowSteps.filter(ws => ws.status === 'completed');
    const totalSteps = this.workflowSteps.length;

    if (completedSteps.length === totalSteps && this.status !== 'completed') {
        this.status = 'completed';
        this.completedAt = new Date();
        this.timeline.actualCompletionDate = new Date();
    } else if (completedSteps.length > totalSteps * 0.8 && this.status === 'in_progress') {
        this.status = 'quality_review';
    } else if (completedSteps.length > totalSteps * 0.6 && this.status === 'field_work') {
        this.status = 'analysis';
    }
};

LandVerificationSchema.methods.generateReport = function(generatedBy, summary, recommendations) {
    this.verificationReport = {
        reportGenerated: true,
        reportGeneratedAt: new Date(),
        reportGeneratedBy: generatedBy,
        executiveSummary: summary,
        recommendations: recommendations || []
    };

    // Generate certificate if verification passed
    if (this.results.overallStatus === 'verified') {
        this.verificationReport.certificateIssued = true;
        this.verificationReport.certificateNumber = `VC-${Date.now()}`;
        this.verificationReport.certificateValidUntil = new Date(Date.now() + (this.results.validityPeriod || 365) * 24 * 60 * 60 * 1000);
    }

    this.auditTrail.push({
        action: 'Verification report generated',
        performedBy: generatedBy,
        details: { certificateIssued: this.verificationReport.certificateIssued },
        timestamp: new Date()
    });

    return this.save();
};

LandVerificationSchema.methods.addCommunication = function(type, participants, subject, message) {
    this.communications.push({
        type: type,
        participants: Array.isArray(participants) ? participants : [participants],
        subject: subject,
        message: message,
        date: new Date(),
        status: 'sent'
    });

    return this.save();
};

LandVerificationSchema.methods.addClientUpdate = function(updateType, message, sentBy) {
    this.clientUpdates.push({
        updateType: updateType,
        message: message,
        sentBy: sentBy,
        updateDate: new Date()
    });

    return this.save();
};

LandVerificationSchema.methods.calculateVerificationScore = function() {
    let totalScore = 0;
    let componentCount = 0;

    // Ownership score (25%)
    if (this.ownershipDetails.ownerVerified) {
        this.results.scoreBreakdown.ownershipScore = 85;
        if (this.ownershipDetails.ownerRegistered) this.results.scoreBreakdown.ownershipScore += 15;
    } else {
        this.results.scoreBreakdown.ownershipScore = 40;
    }
    totalScore += this.results.scoreBreakdown.ownershipScore * 0.25;
    componentCount++;

    // Documentation score (30%)
    let docScore = 0;
    if (this.titleVerification.certificateOfOccupancy.exists) docScore += 40;
    if (this.titleVerification.certificateOfOccupancy.verified) docScore += 20;
    if (this.titleVerification.deedOfAssignment.exists) docScore += 25;
    if (this.titleVerification.surveyPlan.exists) docScore += 15;
    this.results.scoreBreakdown.documentationScore = docScore;
    totalScore += docScore * 0.30;
    componentCount++;

    // Legal score (20%)
    let legalScore = 100;
    if (this.encumbrances.hasEncumbrances) {
        legalScore -= 30;
        if (this.encumbrances.legalCases.length > 0) {
            legalScore -= 20;
        }
        if (this.encumbrances.mortgages.length > 0) {
            legalScore -= 15;
        }
    }
    this.results.scoreBreakdown.legalScore = legalScore;
    totalScore += legalScore * 0.20;
    componentCount++;

    // Physical score (25%)
    let physicalScore = 50;
    if (this.physicalVerification.conducted) {
        physicalScore = 75;
        if (this.physicalVerification.findings.boundariesMatch) physicalScore += 15;
        if (!this.physicalVerification.findings.noEncroachment) physicalScore -= 20;
    }
    this.results.scoreBreakdown.physicalScore = Math.max(0, physicalScore);
    totalScore += this.results.scoreBreakdown.physicalScore * 0.25;
    componentCount++;

    this.results.verificationScore = Math.round(totalScore);

    // Determine overall status
    if (this.results.verificationScore >= 80) {
        this.results.overallStatus = 'verified';
        this.results.confidenceLevel = 'high';
    } else if (this.results.verificationScore >= 60) {
        this.results.overallStatus = 'verified_with_caution';
        this.results.confidenceLevel = 'medium';
    } else if (this.results.verificationScore >= 40) {
        this.results.overallStatus = 'inconclusive';
        this.results.confidenceLevel = 'low';
    } else {
        this.results.overallStatus = 'not_verified';
        this.results.confidenceLevel = 'very_low';
    }

    // Add red flags for critical issues
    if (this.encumbrances.legalCases.length > 0) {
        this.results.redFlags.push({
            severity: 'high',
            category: 'Legal',
            description: 'Active legal cases associated with the property.',
            recommendation: 'Thorough legal review required before proceeding.'
        });
    }

    return this.save();
};

module.exports = mongoose.model('LandVerification', LandVerificationSchema);