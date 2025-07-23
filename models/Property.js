const mongoose = require('mongoose');

// Property Schema - Complete Implementation
const PropertySchema = new mongoose.Schema({
    propertyId: {
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Basic property information
    propertyType: {
        type: String,
        enum: ['residential', 'commercial', 'industrial', 'mixed_use', 'institutional'],
        required: true,
        index: true
    },
    propertySubtype: {
        type: String,
        enum: [
            // Residential
            'detached_house', 'semi_detached', 'terraced_house', 'bungalow', 'duplex', 'apartment', 'flat', 'mansion', 'villa',
            // Commercial
            'office_building', 'retail_space', 'shopping_mall', 'restaurant', 'hotel', 'warehouse', 'showroom', 'market_stall',
            // Industrial
            'factory', 'manufacturing_plant', 'storage_facility', 'processing_plant', 'workshop', 'refinery',
            // Mixed use
            'residential_commercial', 'office_residential', 'retail_residential',
            // Institutional
            'school', 'hospital', 'religious_building', 'government_building', 'community_center', 'sports_facility'
        ]
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
        maxlength: 2000
    },

    // Building details
    buildingDetails: {
        floors: {
            type: Number,
            min: 0, // Ground level only
            max: 100
        },
        totalRooms: { type: Number, min: 0 },
        bedrooms: { type: Number, min: 0 },
        bathrooms: { type: Number, min: 0 },
        toilets: { type: Number, min: 0 },
        livingRooms: { type: Number, min: 0 },
        kitchens: { type: Number, min: 0 },
        studyRooms: { type: Number, min: 0 },
        storeRooms: { type: Number, min: 0 },
        garages: { type: Number, min: 0 },
        parkingSpaces: { type: Number, min: 0 },
        balconies: { type: Number, min: 0 },

        // Construction details
        builtYear: {
            type: Number,
            min: 1800,
            max: new Date().getFullYear() + 10 // Allow for planned construction
        },
        renovatedYear: Number,
        lastMajorRepair: Date,
        structuralIntegrity: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor', 'critical'],
            default: 'good'
        },

        buildingMaterials: {
            foundation: {
                type: String,
                enum: ['concrete', 'stone', 'brick', 'block', 'wood', 'steel']
            },
            walls: {
                primary: {
                    type: String,
                    enum: ['concrete_blocks', 'bricks', 'sandcrete', 'mud_bricks', 'wood', 'steel', 'stone']
                },
                secondary: String,
                thickness: Number, // in inches
                insulationType: {
                    type: String,
                    enum: ['none', 'fiberglass', 'foam', 'cellulose', 'mineral_wool']
                }
            },
            roofing: {
                primary: {
                    type: String,
                    enum: ['aluminum_sheets', 'tiles', 'concrete_slabs', 'thatch', 'asbestos', 'pvc', 'shingles', 'membrane']
                },
                insulationType: String,
                guttering: Boolean,
                rainwaterCollection: Boolean
            },
            flooring: {
                primary: {
                    type: String,
                    enum: ['tiles', 'marble', 'granite', 'terrazzo', 'concrete', 'wood', 'laminate', 'carpet', 'vinyl']
                },
                byRoom: [{
                    room: String,
                    material: String
                }]
            },
            windows: {
                type: {
                    type: String,
                    enum: ['aluminum', 'wood', 'upvc', 'steel', 'composite']
                },
                glazing: {
                    type: String,
                    enum: ['single', 'double', 'triple']
                },
                security: Boolean,
                mosquitoNets: Boolean
            },
            doors: {
                exterior: {
                    type: String,
                    enum: ['wood', 'steel', 'aluminum', 'composite', 'glass']
                },
                interior: {
                    type: String,
                    enum: ['wood', 'hollow_core', 'solid_core', 'glass', 'sliding']
                },
                securityDoors: Boolean
            }
        },

        // Measurements
        totalFloorArea: { type: Number, min: 0 }, // in square meters
        builtUpArea: { type: Number, min: 0 },
        plotCoverage: { type: Number, min: 0, max: 100 }, // percentage
        ceilingHeight: { type: Number, min: 0 }, // in meters
        frontage: { type: Number, min: 0 }, // meters
        depth: { type: Number, min: 0 }, // meters
        setbacks: {
            front: { type: Number, min: 0 },
            back: { type: Number, min: 0 },
            left: { type: Number, min: 0 },
            right: { type: Number, min: 0 }
        },

        // Condition and quality
        condition: {
            type: String,
            enum: ['excellent', 'very_good', 'good', 'fair', 'poor', 'dilapidated'],
            default: 'good'
        },
        qualityGrade: {
            type: String,
            enum: ['luxury', 'high', 'medium', 'low', 'basic'],
            default: 'medium'
        },
        maintenanceLevel: {
            type: String,
            enum: ['excellent', 'good', 'average', 'poor', 'neglected'],
            default: 'average'
        },

        // Features and amenities
        features: {
            // Climate Control
            airConditioning: {
                available: Boolean,
                type: {
                    type: String,
                    enum: ['central', 'split_units', 'window_units', 'portable']
                },
                rooms: [String]
            },
            heating: {
                available: Boolean,
                type: {
                    type: String,
                    enum: ['central', 'space_heaters', 'fireplace', 'underfloor']
                }
            },
            ventilation: {
                natural: Boolean,
                mechanical: Boolean,
                exhaustFans: Boolean
            },

            // Outdoor Features
            balcony: {
                available: Boolean,
                count: Number,
                covered: Boolean
            },
            terrace: {
                available: Boolean,
                rooftop: Boolean,
                size: Number
            },
            garden: {
                available: Boolean,
                landscaped: Boolean,
                irrigation: Boolean,
                size: Number
            },
            swimmingPool: {
                available: Boolean,
                type: {
                    type: String,
                    enum: ['in_ground', 'above_ground', 'infinity', 'lap_pool']
                },
                size: String
            },

            // Indoor Amenities
            fireplace: {
                available: Boolean,
                type: {
                    type: String,
                    enum: ['wood_burning', 'gas', 'electric', 'decorative']
                },
                location: String
            },
            gym: Boolean,
            library: Boolean,
            gameRoom: Boolean,
            homeTheater: Boolean,
            winecellar: Boolean,
            sauna: Boolean,
            jacuzzi: Boolean,

            // Technology
            smartHome: {
                available: Boolean,
                features: [String] // automation, security, lighting, climate
            },
            internetReady: Boolean,
            cableReady: Boolean,
            satelliteDish: Boolean,

            // Accessibility
            elevator: {
                available: Boolean,
                type: {
                    type: String,
                    enum: ['passenger', 'service', 'residential']
                },
                floors: Number
            },
            wheelchair: {
                accessible: Boolean,
                ramps: Boolean,
                wideDoorways: Boolean,
                accessibleBathroom: Boolean
            },

            // Power and Utilities
            generator: {
                available: Boolean,
                type: {
                    type: String,
                    enum: ['standby', 'portable', 'solar', 'hybrid']
                },
                capacity: String // in KVA
            },
            solarPanels: {
                available: Boolean,
                capacity: String, // in watts
                batteryBackup: Boolean
            },
            inverterSystem: {
                available: Boolean,
                capacity: String
            },

            // Water Features
            borehole: {
                available: Boolean,
                depth: Number,
                waterQuality: {
                    type: String,
                    enum: ['excellent', 'good', 'fair', 'poor', 'untested']
                }
            },
            waterTank: {
                available: Boolean,
                capacity: Number, // in liters
                material: {
                    type: String,
                    enum: ['plastic', 'stainless_steel', 'concrete', 'fiberglass']
                }
            },
            waterHeater: {
                available: Boolean,
                type: {
                    type: String,
                    enum: ['electric', 'gas', 'solar', 'instant']
                },
                capacity: Number
            },

            // Waste Management
            septicTank: {
                available: Boolean,
                capacity: Number,
                lastCleaned: Date
            },
            sewageConnection: Boolean,
            wasteDisposal: Boolean,
            recyclingArea: Boolean,

            // Security Features
            securitySystem: {
                available: Boolean,
                type: {
                    type: String,
                    enum: ['basic_alarm', 'monitored', 'smart_system', 'professional']
                },
                company: String
            },
            cctv: {
                available: Boolean,
                cameras: Number,
                nightVision: Boolean,
                recording: Boolean,
                remoteAccess: Boolean
            },
            intercom: {
                available: Boolean,
                videoIntercom: Boolean
            },
            motionSensors: Boolean,
            smokeDetectors: Boolean,
            securityLighting: Boolean,
            panicRoom: Boolean,

            // Boundary and External
            fence: {
                available: Boolean,
                material: {
                    type: String,
                    enum: ['brick', 'concrete', 'wood', 'metal', 'chain_link', 'hedge']
                },
                height: Number, // in meters
                electricFencing: Boolean
            },
            gate: {
                available: Boolean,
                type: {
                    type: String,
                    enum: ['manual', 'electric', 'remote_control', 'automatic']
                },
                material: String
            },
            gateHouse: {
                available: Boolean,
                furnished: Boolean
            },

            // Additional Structures
            servantsQuarters: {
                available: Boolean,
                rooms: Number,
                separate: Boolean
            },
            guestHouse: {
                available: Boolean,
                rooms: Number,
                facilities: String
            },
            garage: {
                available: Boolean,
                spaces: Number,
                covered: Boolean,
                automatic: Boolean
            },
            carport: {
                available: Boolean,
                spaces: Number
            },
            workshop: Boolean,
            storage: {
                basement: Boolean,
                attic: Boolean,
                externalShed: Boolean
            }
        }
    },

    // Building plan and approvals
    buildingPlan: {
        planNumber: { type: String, index: true },
        approvedDate: Date,
        expiryDate: Date,
        architectName: String,
        architectLicense: String,
        engineerName: String,
        engineerLicense: String,
        planDocument: String, // File path

        revisions: [{
            revisionNumber: { type: Number, default: 1 },
            revisionDate: Date,
            revisedBy: String,
            reason: String,
            documentPath: String,
            approvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }],

        planDetails: {
            totalFloorArea: Number,
            buildingHeight: Number,
            numberOfFloors: Number,
            setbacks: {
                front: Number,
                back: Number,
                left: Number,
                right: Number
            },
            plotCoverage: Number // percentage
        },

        compliance: {
            buildingCode: { type: Boolean, default: false },
            fireCode: { type: Boolean, default: false },
            accessibilityCode: { type: Boolean, default: false },
            environmentalCode: { type: Boolean, default: false },
            zoningCompliance: { type: Boolean, default: false },
            structuralCompliance: { type: Boolean, default: false }
        },

        inspections: [{
            inspectionType: {
                type: String,
                enum: ['foundation', 'framing', 'electrical', 'plumbing', 'final', 'fire_safety']
            },
            inspectionDate: Date,
            inspector: String,
            result: {
                type: String,
                enum: ['passed', 'failed', 'conditional', 'pending']
            },
            notes: String,
            nextInspection: Date
        }]
    },

    // Building license and permits
    buildingLicense: {
        licenseNumber: { type: String, index: true },
        issueDate: Date,
        expiryDate: Date,
        constructionStartDate: Date,
        expectedCompletionDate: Date,
        actualCompletionDate: Date,

        status: {
            type: String,
            enum: ['pending', 'active', 'expired', 'suspended', 'revoked', 'completed'],
            default: 'pending'
        },

        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        licenseConditions: [String],

        renewalHistory: [{
            renewalDate: Date,
            expiryDate: Date,
            renewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            fee: Number
        }],

        violations: [{
            violationType: String,
            violationDate: Date,
            description: String,
            fine: Number,
            resolved: Boolean,
            resolutionDate: Date
        }]
    },

    // Additional permits and certificates
    permits: {
        occupancyPermit: {
            permitNumber: String,
            issueDate: Date,
            expiryDate: Date,
            status: {
                type: String,
                enum: ['active', 'expired', 'suspended', 'pending']
            },
            occupancyType: {
                type: String,
                enum: ['residential', 'commercial', 'industrial', 'mixed']
            },
            maxOccupancy: Number
        },

        businessPermit: {
            permitNumber: String,
            businessName: String,
            businessType: String,
            issueDate: Date,
            expiryDate: Date,
            annualFee: Number
        },

        environmentalClearance: {
            clearanceNumber: String,
            issueDate: Date,
            validUntil: Date,
            assessmentRequired: Boolean,
            assessmentDocument: String,
            environmentalImpact: {
                type: String,
                enum: ['low', 'medium', 'high', 'very_high']
            }
        },

        fireSafetyCertificate: {
            certificateNumber: String,
            issueDate: Date,
            expiryDate: Date,
            lastInspection: Date,
            nextInspection: Date,
            fireRating: String,
            emergencyExits: Number,
            fireExtinguishers: Number,
            smokeDetectors: Number,
            sprinklerSystem: Boolean
        },

        healthPermit: {
            permitNumber: String,
            issueDate: Date,
            expiryDate: Date,
            applicableFor: String // restaurants, hospitals, etc.
        },

        signagePermit: {
            permitNumber: String,
            signageType: String,
            dimensions: String,
            location: String,
            issueDate: Date,
            expiryDate: Date
        }
    },

    // Utilities and services
    utilities: {
        electricity: {
            available: Boolean,
            provider: String,
            meterNumber: String,
            connectionType: {
                type: String,
                enum: ['prepaid', 'postpaid', 'industrial', 'commercial']
            },
            voltage: String,
            loadCapacity: String, // in KVA
            connectionDate: Date,
            monthlyConsumption: Number, // average kWh
            backupPower: Boolean
        },

        water: {
            available: Boolean,
            source: {
                type: String,
                enum: ['public_supply', 'borehole', 'well', 'river', 'tanker', 'multiple']
            },
            provider: String,
            meterNumber: String,
            connectionDate: Date,
            waterQuality: {
                type: String,
                enum: ['excellent', 'good', 'fair', 'poor', 'untested']
            },
            pressure: {
                type: String,
                enum: ['high', 'medium', 'low', 'variable']
            },
            monthlyConsumption: Number // in liters
        },

        gas: {
            available: Boolean,
            type: {
                type: String,
                enum: ['natural_gas', 'lpg', 'biogas', 'none']
            },
            provider: String,
            meterNumber: String,
            connectionType: {
                type: String,
                enum: ['piped', 'cylinder', 'bulk_tank']
            }
        },

        internet: {
            available: Boolean,
            providers: [String],
            fiberOptic: Boolean,
            bandwidth: String,
            wifiCoverage: {
                type: String,
                enum: ['full', 'partial', 'none']
            }
        },

        telecommunications: {
            landline: Boolean,
            mobileSignal: {
                type: String,
                enum: ['excellent', 'good', 'fair', 'poor', 'none']
            },
            providers: [String]
        },

        cable: {
            available: Boolean,
            provider: String,
            channels: Number,
            digitalReady: Boolean
        },

        waste: {
            collection: Boolean,
            provider: String,
            frequency: String,
            recycling: Boolean,
            composting: Boolean
        },

        security: {
            available: Boolean,
            type: {
                type: String,
                enum: ['private_security', 'community_security', 'neighborhood_watch', 'none']
            },
            provider: String,
            responseTime: String,
            patrols: Boolean,
            cost: Number
        },

        maintenance: {
            available: Boolean,
            provider: String,
            services: [String],
            responseTime: String,
            cost: Number
        }
    },

    // Rental information
    rental: {
        isForRent: {
            type: Boolean,
            default: false,
            index: true
        },

        rentType: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'long_term']
        },

        rentAmount: {
            type: Number,
            min: 0
        },

        fees: {
            securityDeposit: { type: Number, min: 0 },
            agencyFee: { type: Number, min: 0 },
            legalFee: { type: Number, min: 0 },
            agreementFee: { type: Number, min: 0 },
            cautionFee: { type: Number, min: 0 },
            serviceFee: { type: Number, min: 0 }
        },

        // Current tenancy
        currentTenant: {
            tenant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            startDate: Date,
            endDate: Date,
            rentAmount: Number,
            depositPaid: Number,
            agreementDocument: String,
            guarantor: {
                name: String,
                phone: String,
                email: String,
                address: String,
                relationship: String
            },

            status: {
                type: String,
                enum: ['active', 'expired', 'terminated', 'notice_given', 'overdue'],
                default: 'active'
            },

            paymentHistory: [{
                month: String,
                year: Number,
                amount: Number,
                dueDate: Date,
                paidDate: Date,
                paymentMethod: String,
                receiptNumber: String,
                lateFee: Number,
                status: {
                    type: String,
                    enum: ['paid', 'overdue', 'partial', 'pending']
                }
            }],

            renewalOptions: {
                autoRenewal: Boolean,
                renewalPeriod: Number, // months
                rentIncrease: Number, // percentage
                renewalNotice: Number // days notice required
            }
        },

        // Tenancy history
        tenancyHistory: [{
            tenant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            tenantName: String, // for non-registered users
            startDate: Date,
            endDate: Date,
            rentAmount: Number,
            depositPaid: Number,
            depositReturned: Number,
            agreementDocument: String,
            terminationReason: String,
            damagesDeducted: Number,

            ratings: {
                landlordRating: { type: Number, min: 1, max: 5 },
                tenantRating: { type: Number, min: 1, max: 5 }
            },

            reviews: {
                landlordReview: String,
                tenantReview: String
            },

            issues: [{
                issueType: String,
                description: String,
                dateReported: Date,
                resolved: Boolean,
                resolutionDate: Date
            }]
        }],

        // Rental preferences and restrictions
        preferences: {
            tenantType: {
                type: String,
                enum: ['family', 'single', 'couple', 'students', 'professionals', 'expatriates', 'any']
            },
            minimumTenancyPeriod: { type: Number, default: 12 }, // months
            maximumTenancyPeriod: Number, // months
            petsAllowed: Boolean,
            smokingAllowed: Boolean,
            partiesAllowed: Boolean,
            shortTermRental: Boolean,

            furnishingLevel: {
                type: String,
                enum: ['unfurnished', 'semi_furnished', 'fully_furnished', 'luxury_furnished']
            },

            includedUtilities: [String],
            restrictions: [String]
        },

        marketingInfo: {
            listedOn: [String], // platforms where listed
            virtualTour: String,
            videoTour: String,
            keyFeatures: [String],
            nearbyAmenities: [String],
            transportLinks: [String]
        }
    },

    // Sale information
    sale: {
        isForSale: {
            type: Boolean,
            default: false,
            index: true
        },

        pricing: {
            askingPrice: { type: Number, min: 0 },
            priceNegotiable: { type: Boolean, default: true },
            minimumPrice: Number,
            pricePerSquareMeter: Number,

            priceHistory: [{
                price: Number,
                dateChanged: Date,
                reason: String,
                marketConditions: String
            }]
        },

        marketingDetails: {
            listedDate: Date,
            marketingStrategy: String,
            exclusiveListing: Boolean,
            exclusivityPeriod: Date,

            saleAgent: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },

            commissionRate: {
                type: Number,
                default: 5,
                min: 0,
                max: 20
            },

            marketingMaterials: {
                brochure: String,
                floorPlan: String,
                virtualTour: String,
                videoTour: String,
                droneFootage: String
            }
        },

        viewings: [{
            scheduledDate: Date,
            duration: Number, // minutes
            prospectiveBuyer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            buyerName: String, // for non-registered users
            buyerContact: String,
            agent: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },

            status: {
                type: String,
                enum: ['scheduled', 'completed', 'cancelled', 'no_show', 'postponed']
            },

            feedback: String,
            interested: Boolean,
            interestLevel: {
                type: String,
                enum: ['very_high', 'high', 'medium', 'low', 'none']
            },

            followUpRequired: Boolean,
            followUpDate: Date,
            notes: String
        }],

        offers: [{
            offerAmount: Number,
            offerDate: Date,
            offeredBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            buyerName: String, // for non-registered users

            status: {
                type: String,
                enum: ['pending', 'accepted', 'rejected', 'countered', 'withdrawn', 'expired']
            },

            conditions: [String],
            response: String,
            responseDate: Date,
            counterOffer: Number,

            financing: {
                cashOffer: Boolean,
                mortgagePreApproved: Boolean,
                lender: String,
                loanAmount: Number
            },

            timeline: {
                inspectionPeriod: Number, // days
                closingDate: Date,
                possessionDate: Date
            },

            validUntil: Date,
            notes: String
        }],

        saleProcess: {
            underContract: Boolean,
            contractDate: Date,
            buyer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            salePrice: Number,
            expectedClosingDate: Date,
            actualClosingDate: Date,

            contingencies: [{
                type: String,
                description: String,
                deadline: Date,
                status: {
                    type: String,
                    enum: ['pending', 'satisfied', 'waived', 'failed']
                }
            }]
        }
    },

    // Financial information
    financial: {
        acquisition: {
            purchasePrice: Number,
            purchaseDate: Date,
            acquisitionCosts: Number,
            seller: String
        },

        valuation: {
            currentMarketValue: Number,
            lastValuationDate: Date,
            valuationMethod: String,
            valuedBy: String,
            valuationDocument: String,

            valuationHistory: [{
                value: Number,
                date: Date,
                purpose: String,
                valuedBy: String
            }]
        },

        insurance: {
            insuranceValue: Number,
            provider: String,
            policyNumber: String,
            policyType: String,
            premium: Number,
            coverage: [String],
            expiryDate: Date,
            claimsHistory: [{
                claimDate: Date,
                claimAmount: Number,
                claimType: String,
                settlement: Number,
                status: String
            }]
        },

        mortgageDetails: {
            hasMortgage: Boolean,
            lender: String,
            loanNumber: String,
            originalAmount: Number,
            outstandingAmount: Number,
            monthlyPayment: Number,
            interestRate: Number,
            loanTerm: Number, // years
            startDate: Date,
            maturityDate: Date,
            loanType: String
        },

        expenses: {
            annualExpenses: {
                maintenance: Number,
                insurance: Number,
                propertyTax: Number,
                managementFee: Number,
                utilities: Number,
                security: Number,
                other: Number
            },

            monthlyExpenses: {
                mortgage: Number,
                insurance: Number,
                utilities: Number,
                maintenance: Number,
                management: Number,
                other: Number
            }
        },

        income: {
            rentalIncome: {
                monthly: Number,
                annual: Number,
                occupancyRate: Number // percentage
            },
            otherIncome: Number,
            grossYield: Number, // percentage
            netYield: Number // percentage
        },

        taxInformation: {
            propertyTaxRate: Number,
            annualPropertyTax: Number,
            lastTaxPayment: Date,
            taxAssessedValue: Number,
            taxExemptions: [String]
        }
    },

    // Maintenance and inspections
    maintenance: {
        lastInspectionDate: Date,
        nextInspectionDue: Date,
        inspectionFrequency: {
            type: String,
            enum: ['monthly', 'quarterly', 'semi_annually', 'annually'],
            default: 'annually'
        },

        inspectionReports: [{
            inspectionDate: Date,
            inspector: String,
            inspectorLicense: String,
            reportType: {
                type: String,
                enum: ['routine', 'pre_rental', 'post_rental', 'damage_assessment', 'insurance', 'pre_sale']
            },
            overallCondition: {
                type: String,
                enum: ['excellent', 'good', 'fair', 'poor', 'critical']
            },
            findings: [String],
            recommendations: [String],
            urgentIssues: [String],
            estimatedRepairCosts: Number,
            reportDocument: String,
            photos: [String],
            followUpRequired: Boolean,
            followUpDate: Date
        }],

        maintenanceHistory: [{
            workDate: Date,
            workType: {
                type: String,
                enum: ['repair', 'renovation', 'upgrade', 'preventive', 'emergency', 'cosmetic']
            },
            category: {
                type: String,
                enum: ['electrical', 'plumbing', 'roofing', 'flooring', 'painting', 'hvac', 'structural', 'security', 'landscaping', 'other']
            },
            description: String,
            contractor: String,
            contractorLicense: String,
            cost: Number,
            laborCost: Number,
            materialCost: Number,
            warrantyPeriod: Number, // months
            warrantyDetails: String,
            receipts: [String],
            beforePhotos: [String],
            afterPhotos: [String],
            completed: Boolean,
            completionDate: Date,
            qualityRating: {
                type: Number,
                min: 1,
                max: 5
            },
            notes: String
        }],

        scheduledMaintenance: [{
            taskDescription: String,
            category: String,
            frequency: {
                type: String,
                enum: ['weekly', 'monthly', 'quarterly', 'semi_annually', 'annually']
            },
            lastCompleted: Date,
            nextDue: Date,
            contractor: String,
            estimatedCost: Number,
            priority: {
                type: String,
                enum: ['low', 'medium', 'high', 'critical'],
                default: 'medium'
            },
            automated: Boolean,
            reminderSent: Boolean
        }],

        maintenanceBudget: {
            annualBudget: Number,
            spentThisYear: Number,
            remainingBudget: Number,
            emergencyReserve: Number
        },

        preferredContractors: [{
            name: String,
            speciality: String,
            phone: String,
            email: String,
            license: String,
            rating: Number,
            lastUsed: Date
        }]
    },

    // Media and documentation
    media: {
        photos: [{
            filePath: String,
            title: String,
            description: String,
            room: String,
            category: {
                type: String,
                enum: ['exterior', 'interior', 'kitchen', 'bathroom', 'bedroom', 'living_room', 'garden', 'garage', 'other']
            },
            isPrimary: Boolean,
            uploadDate: { type: Date, default: Date.now },
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            fileSize: Number,
            resolution: String
        }],

        videos: [{
            filePath: String,
            title: String,
            description: String,
            category: {
                type: String,
                enum: ['tour', 'exterior', 'interior', 'amenities', 'neighborhood']
            },
            duration: Number, // in seconds
            uploadDate: { type: Date, default: Date.now },
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            fileSize: Number,
            resolution: String,
            thumbnailPath: String
        }],

        virtualTour: {
            tourUrl: String,
            provider: String,
            createdDate: Date,
            lastUpdated: Date
        },

        floorPlans: [{
            filePath: String,
            floor: String,
            scale: String,
            uploadDate: { type: Date, default: Date.now },
            version: String
        }],

        documents: [{
            documentType: {
                type: String,
                enum: ['deed', 'survey', 'plan', 'permit', 'insurance', 'warranty', 'manual', 'inspection', 'tax', 'other']
            },
            filePath: String,
            title: String,
            description: String,
            uploadDate: { type: Date, default: Date.now },
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            expiryDate: Date,
            verified: Boolean,
            verifiedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            verificationDate: Date
        }]
    },

    // Location and accessibility
    accessibility: {
        disabilityAccess: Boolean,
        wheelchairAccess: Boolean,
        ramps: Boolean,
        wideDoorways: Boolean,
        accessibleBathroom: Boolean,
        elevator: Boolean,
        brailleSignage: Boolean,
        hearingLoopSystem: Boolean,
        accessibilityRating: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor', 'none']
        },
        accessibilityFeatures: [String],
        complianceStandards: [String]
    },

    // Environment and sustainability
    sustainability: {
        energyEfficiency: {
            rating: {
                type: String,
                enum: ['A++', 'A+', 'A', 'B', 'C', 'D', 'E']
            },
            annualEnergyConsumption: Number, // kWh
            energyCostAnnual: Number,
            solarPanels: Boolean,
            solarCapacity: String,
            energySavingAppliances: Boolean,
            ledLighting: Boolean,
            insulation: Boolean,
            doubleGlazing: Boolean,
            smartThermostat: Boolean,
            energyAuditDate: Date,
            energyAuditBy: String
        },

        waterConservation: {
            rainwaterHarvesting: Boolean,
            rainwaterCapacity: Number,
            greyWaterRecycling: Boolean,
            lowFlowFixtures: Boolean,
            droughtResistantLandscaping: Boolean,
            waterUsageAnnual: Number, // liters
            waterCostAnnual: Number,
            waterEfficiencyRating: String
        },

        wasteManagement: {
            recyclingFacilities: Boolean,
            compostingArea: Boolean,
            wasteReduction: Boolean,
            separateWasteBins: Number,
            organicWasteDisposal: String,
            wasteGenerationMonthly: Number // kg
        },

        environmentalCertifications: [String],
        carbonFootprint: Number, // tonnes CO2 annually
        sustainabilityScore: {
            type: Number,
            min: 0,
            max: 100
        }
    },

    // Neighborhood and location details
    neighborhood: {
        neighborhoodName: String,
        neighborhoodType: {
            type: String,
            enum: ['urban', 'suburban', 'rural', 'gated_community', 'estate']
        },
        safetyRating: {
            type: Number,
            min: 1,
            max: 5
        },
        noiseLevel: {
            type: String,
            enum: ['very_quiet', 'quiet', 'moderate', 'noisy', 'very_noisy']
        },

        nearbyAmenities: {
            schools: [{
                name: String,
                type: String,
                distance: Number, // in meters
                rating: Number
            }],
            hospitals: [{
                name: String,
                type: String,
                distance: Number,
                specialties: [String]
            }],
            shoppingCenters: [{
                name: String,
                distance: Number,
                type: String
            }],
            restaurants: [{
                name: String,
                distance: Number,
                cuisine: String
            }],
            banks: [{
                name: String,
                distance: Number,
                services: [String]
            }],
            recreationalFacilities: [{
                name: String,
                type: String,
                distance: Number
            }]
        },

        transportation: {
            publicTransport: Boolean,
            busStops: Number,
            nearestBusStop: Number, // distance in meters
            taxiAvailability: String,
            roadCondition: {
                type: String,
                enum: ['excellent', 'good', 'fair', 'poor']
            },
            parkingAvailability: String,
            trafficLevel: {
                type: String,
                enum: ['light', 'moderate', 'heavy', 'congested']
            }
        }
    },

    // Legal and compliance
    legal: {
        titleStatus: {
            type: String,
            enum: ['clean', 'disputed', 'encumbered', 'pending'],
            default: 'clean'
        },
        legalIssues: [{
            issueType: String,
            description: String,
            dateReported: Date,
            status: String,
            resolutionDate: Date
        }],
        complianceStatus: {
            buildingCodes: Boolean,
            zoningLaws: Boolean,
            environmentalRegulations: Boolean,
            fireCode: Boolean,
            healthCode: Boolean
        },
        violations: [{
            violationType: String,
            date: Date,
            description: String,
            fine: Number,
            resolved: Boolean,
            resolutionDate: Date
        }]
    },

    // Status and tracking
    status: {
        type: String,
        enum: ['active', 'inactive', 'under_construction', 'under_renovation', 'demolished', 'condemned'],
        default: 'active'
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'agents_only', 'limited'],
        default: 'public'
    },

    // Performance metrics
    performance: {
        viewCount: { type: Number, default: 0 },
        inquiryCount: { type: Number, default: 0 },
        showingCount: { type: Number, default: 0 },
        favoriteCount: { type: Number, default: 0 },
        lastViewed: Date,
        averageViewDuration: Number, // seconds
        searchRanking: Number,
        marketingEffectiveness: {
            type: Number,
            min: 0,
            max: 10
        }
    },

    // Timestamps and audit
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastModified: Date,
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
PropertySchema.index({ propertyId: 1, status: 1 });
PropertySchema.index({ owner: 1, status: 1 });
PropertySchema.index({ landId: 1 });
PropertySchema.index({ propertyType: 1, 'rental.isForRent': 1 });
PropertySchema.index({ propertyType: 1, 'sale.isForSale': 1 });
PropertySchema.index({ 'rental.isForRent': 1, 'rental.rentAmount': 1 });
PropertySchema.index({ 'sale.isForSale': 1, 'sale.pricing.askingPrice': 1 });
PropertySchema.index({ 'buildingDetails.bedrooms': 1, 'rental.isForRent': 1 });
PropertySchema.index({ createdAt: -1 });
PropertySchema.index({ 'buildingLicense.licenseNumber': 1 });
PropertySchema.index({ 'permits.occupancyPermit.permitNumber': 1 });

// Virtual fields
PropertySchema.virtual('isRentOverdue').get(function() {
    if (!this.rental.currentTenant || !this.rental.currentTenant.endDate) return false;
    return this.rental.currentTenant.endDate < new Date();
});

PropertySchema.virtual('monthsToRenewal').get(function() {
    if (!this.rental.currentTenant || !this.rental.currentTenant.endDate) return null;
    const now = new Date();
    const endDate = this.rental.currentTenant.endDate;
    return Math.round((endDate - now) / (1000 * 60 * 60 * 24 * 30));
});

PropertySchema.virtual('propertyAge').get(function() {
    if (!this.buildingDetails.builtYear) return null;
    return new Date().getFullYear() - this.buildingDetails.builtYear;
});

PropertySchema.virtual('netRentalYield').get(function() {
    if (!this.rental.rentAmount || !this.financial.valuation.currentMarketValue) return null;
    const annualRent = this.rental.rentAmount * (this.rental.rentType === 'monthly' ? 12 : 1);
    const expenses = this.financial.expenses.annualExpenses.maintenance || 0;
    return ((annualRent - expenses) / this.financial.valuation.currentMarketValue) * 100;
});

PropertySchema.virtual('totalFloorArea').get(function() {
    return this.buildingDetails.totalFloorArea || 0;
});

PropertySchema.virtual('maintenanceCostPerSqm').get(function() {
    if (!this.buildingDetails.totalFloorArea || !this.financial.expenses.annualExpenses.maintenance) return 0;
    return this.financial.expenses.annualExpenses.maintenance / this.buildingDetails.totalFloorArea;
});

PropertySchema.virtual('marketingAge').get(function() {
    if (!this.sale.marketingDetails.listedDate) return null;
    const now = new Date();
    const listedDate = this.sale.marketingDetails.listedDate;
    return Math.floor((now - listedDate) / (1000 * 60 * 60 * 24));
});

// Instance methods
PropertySchema.methods.updateRentalStatus = function(isForRent, rentAmount, deposit) {
    this.rental.isForRent = isForRent;
    if (isForRent) {
        this.rental.rentAmount = rentAmount;
        this.rental.fees.securityDeposit = deposit;
    }
    this.updatedAt = new Date();
    return this.save();
};

PropertySchema.methods.addTenant = function(tenantId, startDate, endDate, rentAmount, deposit, agreementPath) {
    // Move current tenant to history if exists
    if (this.rental.currentTenant && this.rental.currentTenant.tenant) {
        this.rental.tenancyHistory.push({
            ...this.rental.currentTenant.toObject(),
            endDate: new Date()
        });
    }

    // Set new current tenant
    this.rental.currentTenant = {
        tenant: tenantId,
        startDate: startDate,
        endDate: endDate,
        rentAmount: rentAmount,
        depositPaid: deposit,
        agreementDocument: agreementPath,
        status: 'active'
    };

    this.rental.isForRent = false;
    this.updatedAt = new Date();
    return this.save();
};

PropertySchema.methods.terminateTenancy = function(reason, damagesDeducted = 0) {
    if (!this.rental.currentTenant.tenant) {
        throw new Error('No current tenant to terminate');
    }

    // Move to history
    this.rental.tenancyHistory.push({
        ...this.rental.currentTenant.toObject(),
        endDate: new Date(),
        terminationReason: reason,
        damagesDeducted: damagesDeducted
    });

    // Clear current tenant
    this.rental.currentTenant = {};
    this.updatedAt = new Date();
    return this.save();
};

PropertySchema.methods.addMaintenanceRecord = function(workType, category, description, cost, contractor) {
    this.maintenance.maintenanceHistory.push({
        workDate: new Date(),
        workType,
        category,
        description,
        cost,
        contractor,
        completed: true,
        completionDate: new Date()
    });

    // Update maintenance budget
    if (this.maintenance.maintenanceBudget.spentThisYear) {
        this.maintenance.maintenanceBudget.spentThisYear += cost;
        this.maintenance.maintenanceBudget.remainingBudget -= cost;
    }

    this.updatedAt = new Date();
    return this.save();
};

PropertySchema.methods.scheduleInspection = function(inspectionDate, inspectorName, reportType = 'routine') {
    this.maintenance.nextInspectionDue = inspectionDate;
    this.maintenance.inspectionReports.push({
        inspectionDate,
        inspector: inspectorName,
        reportType,
        overallCondition: 'pending'
    });
    this.updatedAt = new Date();
    return this.save();
};

PropertySchema.methods.addOffer = function(offerAmount, offeredBy, conditions = []) {
    this.sale.offers.push({
        offerAmount,
        offerDate: new Date(),
        offeredBy,
        status: 'pending',
        conditions,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days validity
    });

    this.updatedAt = new Date();
    return this.save();
};

PropertySchema.methods.updateMarketValue = function(newValue, valuationDate, valuedBy) {
    // Add to valuation history
    this.financial.valuation.valuationHistory.push({
        value: this.financial.valuation.currentMarketValue || 0,
        date: this.financial.valuation.lastValuationDate || new Date(),
        valuedBy: this.financial.valuation.valuedBy || 'Unknown'
    });

    // Update current valuation
    this.financial.valuation.currentMarketValue = newValue;
    this.financial.valuation.lastValuationDate = valuationDate || new Date();
    this.financial.valuation.valuedBy = valuedBy;

    this.updatedAt = new Date();
    return this.save();
};

PropertySchema.methods.recordPayment = function(month, year, amount, paymentMethod, receiptNumber) {
    if (!this.rental.currentTenant.tenant) {
        throw new Error('No current tenant to record payment for');
    }

    this.rental.currentTenant.paymentHistory.push({
        month,
        year,
        amount,
        dueDate: new Date(year, month - 1, 1),
        paidDate: new Date(),
        paymentMethod,
        receiptNumber,
        status: 'paid'
    });

    return this.save();
};

PropertySchema.methods.addDocument = function(documentType, filePath, title, uploadedBy) {
    this.media.documents.push({
        documentType,
        filePath,
        title,
        uploadDate: new Date(),
        uploadedBy,
        verified: false
    });

    return this.save();
};

PropertySchema.methods.updatePerformanceMetrics = function(action) {
    switch (action) {
        case 'view':
            this.performance.viewCount += 1;
            this.performance.lastViewed = new Date();
            break;
        case 'inquiry':
            this.performance.inquiryCount += 1;
            break;
        case 'showing':
            this.performance.showingCount += 1;
            break;
        case 'favorite':
            this.performance.favoriteCount += 1;
            break;
    }

    return this.save();
};

// Static methods
PropertySchema.statics.findByOwner = function(ownerId) {
    return this.find({ owner: ownerId, status: 'active' });
};

PropertySchema.statics.findForRent = function(criteria = {}) {
    const query = { 'rental.isForRent': true, status: 'active' };

    if (criteria.propertyType) query.propertyType = criteria.propertyType;
    if (criteria.minRent) query['rental.rentAmount'] = { $gte: criteria.minRent };
    if (criteria.maxRent) query['rental.rentAmount'] = { ...query['rental.rentAmount'], $lte: criteria.maxRent };
    if (criteria.bedrooms) query['buildingDetails.bedrooms'] = criteria.bedrooms;
    if (criteria.location) query['neighborhood.neighborhoodName'] = new RegExp(criteria.location, 'i');
    if (criteria.furnishing) query['rental.preferences.furnishingLevel'] = criteria.furnishing;

    return this.find(query).populate('owner', 'firstName lastName phone email');
};

PropertySchema.statics.findForSale = function(criteria = {}) {
    const query = { 'sale.isForSale': true, status: 'active' };

    if (criteria.propertyType) query.propertyType = criteria.propertyType;
    if (criteria.minPrice) query['sale.pricing.askingPrice'] = { $gte: criteria.minPrice };
    if (criteria.maxPrice) query['sale.pricing.askingPrice'] = { ...query['sale.pricing.askingPrice'], $lte: criteria.maxPrice };
    if (criteria.bedrooms) query['buildingDetails.bedrooms'] = criteria.bedrooms;
    if (criteria.location) query['neighborhood.neighborhoodName'] = new RegExp(criteria.location, 'i');

    return this.find(query).populate('owner', 'firstName lastName phone email');
};

PropertySchema.statics.getMaintenanceDue = function() {
    const now = new Date();
    return this.find({
        'maintenance.nextInspectionDue': { $lte: now },
        status: 'active'
    }).populate('owner', 'firstName lastName email phone');
};

PropertySchema.statics.getExpiringPermits = function(daysAhead = 30) {
    const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
    return this.find({
        $or: [
            { 'buildingLicense.expiryDate': { $lte: futureDate } },
            { 'permits.occupancyPermit.expiryDate': { $lte: futureDate } },
            { 'permits.fireSafetyCertificate.expiryDate': { $lte: futureDate } }
        ],
        status: 'active'
    }).populate('owner', 'firstName lastName email phone');
};

PropertySchema.statics.getRentalStatistics = function() {
    return this.aggregate([
        { $match: { status: 'active' } },
        {
            $group: {
                _id: null,
                totalProperties: { $sum: 1 },
                propertiesForRent: { $sum: { $cond: ['$rental.isForRent', 1, 0] } },
                propertiesOccupied: {
                    $sum: { $cond: [{ $ne: ['$rental.currentTenant.tenant', null] }, 1, 0] }
                },
                averageRent: { $avg: '$rental.rentAmount' },
                totalRentalIncome: { $sum: '$rental.rentAmount' },
                averageYield: { $avg: '$financial.income.netYield' }
            }
        }
    ]);
};

PropertySchema.statics.getPropertyStatistics = function() {
    return this.aggregate([
        { $match: { status: 'active' } },
        {
            $group: {
                _id: '$propertyType',
                count: { $sum: 1 },
                averageValue: { $avg: '$financial.valuation.currentMarketValue' },
                totalValue: { $sum: '$financial.valuation.currentMarketValue' },
                averageSize: { $avg: '$buildingDetails.totalFloorArea' }
            }
        }
    ]);
};

PropertySchema.statics.getMarketTrends = function(period = '12m') {
    let dateFrom = new Date();
    switch (period) {
        case '6m': dateFrom.setMonth(dateFrom.getMonth() - 6); break;
        case '12m': dateFrom.setMonth(dateFrom.getMonth() - 12); break;
        case '24m': dateFrom.setMonth(dateFrom.getMonth() - 24); break;
    }

    return this.aggregate([
        { $match: { 'financial.valuation.lastValuationDate': { $gte: dateFrom } } },
        {
            $group: {
                _id: {
                    year: { $year: '$financial.valuation.lastValuationDate' },
                    month: { $month: '$financial.valuation.lastValuationDate' },
                    propertyType: '$propertyType'
                },
                averageValue: { $avg: '$financial.valuation.currentMarketValue' },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
};

PropertySchema.statics.getTopPerformingProperties = function(limit = 10, metric = 'viewCount') {
    const sortField = `performance.${metric}`;
    return this.find({ status: 'active' })
        .sort({ [sortField]: -1 })
        .limit(limit)
        .populate('owner', 'firstName lastName');
};

PropertySchema.statics.searchProperties = function(searchCriteria) {
    const query = { status: 'active' };

    // Text search
    if (searchCriteria.keyword) {
        query.$or = [
            { title: new RegExp(searchCriteria.keyword, 'i') },
            { description: new RegExp(searchCriteria.keyword, 'i') },
            { 'neighborhood.neighborhoodName': new RegExp(searchCriteria.keyword, 'i') }
        ];
    }

    // Property type filter
    if (searchCriteria.propertyType) {
        query.propertyType = searchCriteria.propertyType;
    }

    // Price range filter
    if (searchCriteria.minPrice || searchCriteria.maxPrice) {
        const priceQuery = {};
        if (searchCriteria.minPrice) priceQuery.$gte = searchCriteria.minPrice;
        if (searchCriteria.maxPrice) priceQuery.$lte = searchCriteria.maxPrice;

        query.$or = query.$or || [];
        query.$or.push(
            { 'rental.rentAmount': priceQuery },
            { 'sale.pricing.askingPrice': priceQuery }
        );
    }

    // Bedrooms filter
    if (searchCriteria.bedrooms) {
        query['buildingDetails.bedrooms'] = searchCriteria.bedrooms;
    }

    // Bathrooms filter
    if (searchCriteria.bathrooms) {
        query['buildingDetails.bathrooms'] = { $gte: searchCriteria.bathrooms };
    }

    // Area filter
    if (searchCriteria.minArea || searchCriteria.maxArea) {
        const areaQuery = {};
        if (searchCriteria.minArea) areaQuery.$gte = searchCriteria.minArea;
        if (searchCriteria.maxArea) areaQuery.$lte = searchCriteria.maxArea;
        query['buildingDetails.totalFloorArea'] = areaQuery;
    }

    // Features filter
    if (searchCriteria.features && searchCriteria.features.length > 0) {
        searchCriteria.features.forEach(feature => {
            query[`buildingDetails.features.${feature}.available`] = true;
        });
    }

    return this.find(query).populate('owner', 'firstName lastName phone email');
};

// Pre-save middleware
PropertySchema.pre('save', function(next) {
    this.updatedAt = new Date();
    this.lastModified = new Date();

    // Calculate net rental yield if data is available
    if (this.rental.rentAmount && this.financial.valuation.currentMarketValue) {
        const annualRent = this.rental.rentAmount * (this.rental.rentType === 'monthly' ? 12 : 1);
        const expenses = this.financial.expenses.annualExpenses.maintenance || 0;
        this.financial.income.netYield = ((annualRent - expenses) / this.financial.valuation.currentMarketValue) * 100;
    }

    // Update maintenance budget remaining
    if (this.maintenance.maintenanceBudget.annualBudget && this.maintenance.maintenanceBudget.spentThisYear) {
        this.maintenance.maintenanceBudget.remainingBudget =
            this.maintenance.maintenanceBudget.annualBudget - this.maintenance.maintenanceBudget.spentThisYear;
    }

    // Set next inspection date if not set
    if (!this.maintenance.nextInspectionDue && this.maintenance.inspectionFrequency) {
        const frequency = this.maintenance.inspectionFrequency;
        const months = {
            'monthly': 1,
            'quarterly': 3,
            'semi_annually': 6,
            'annually': 12
        };

        this.maintenance.nextInspectionDue = new Date(
            Date.now() + months[frequency] * 30 * 24 * 60 * 60 * 1000
        );
    }

    // Update sustainability score if energy and water data available
    if (this.sustainability.energyEfficiency.rating && this.sustainability.waterConservation.waterEfficiencyRating) {
        let score = 0;

        // Energy efficiency scoring
        const energyScores = { 'A++': 100, 'A+': 90, 'A': 80, 'B': 70, 'C': 60, 'D': 50, 'E': 40 };
        score += (energyScores[this.sustainability.energyEfficiency.rating] || 40) * 0.4;

        // Water conservation scoring
        score += (this.sustainability.waterConservation.rainwaterHarvesting ? 15 : 0);
        score += (this.sustainability.waterConservation.greyWaterRecycling ? 15 : 0);
        score += (this.sustainability.waterConservation.lowFlowFixtures ? 10 : 0);

        // Waste management scoring
        score += (this.sustainability.wasteManagement.recyclingFacilities ? 10 : 0);
        score += (this.sustainability.wasteManagement.compostingArea ? 10 : 0);

        this.sustainability.sustainabilityScore = Math.min(score, 100);
    }

    next();
});

// Post-save middleware
PropertySchema.post('save', function(doc) {
    if (this.isModified('rental.isForRent')) {
        console.log(`Property ${doc.propertyId} rental status changed: ${doc.rental.isForRent}`);
    }

    if (this.isModified('sale.isForSale')) {
        console.log(`Property ${doc.propertyId} sale status changed: ${doc.sale.isForSale}`);
    }

    if (this.isModified('buildingLicense.status')) {
        console.log(`Property ${doc.propertyId} building license status: ${doc.buildingLicense.status}`);
    }
});

// Text index for search functionality
PropertySchema.index({
    title: 'text',
    description: 'text',
    'neighborhood.neighborhoodName': 'text'
});

module.exports = mongoose.model('Property', PropertySchema);