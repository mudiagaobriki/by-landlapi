// System Constants for Bayelsa Land Management System

// User Roles and Permissions
const USER_ROLES = {
    ADMIN: 'admin',
    GOVERNMENT: 'government',
    CITIZEN: 'citizen',
    AGENT: 'agent',
    COURT: 'court',
    SURVEYOR: 'surveyor'
};

const ROLE_PERMISSIONS = {
    [USER_ROLES.ADMIN]: ['*'], // All permissions
    [USER_ROLES.GOVERNMENT]: [
        'land:create', 'land:read', 'land:update', 'land:delete',
        'transaction:verify', 'transaction:complete', 'transaction:read',
        'property:approve', 'property:read', 'property:update',
        'incident:read', 'incident:assign', 'incident:resolve',
        'verification:approve', 'tax:collect', 'analytics:view'
    ],
    [USER_ROLES.CITIZEN]: [
        'land:read', 'transaction:create', 'transaction:read',
        'property:create', 'property:read', 'property:update',
        'incident:create', 'verification:request'
    ],
    [USER_ROLES.AGENT]: [
        'land:read', 'transaction:create', 'transaction:read',
        'property:read', 'verification:request'
    ],
    [USER_ROLES.COURT]: [
        'land:read', 'transaction:read', 'incident:read', 'court:access'
    ],
    [USER_ROLES.SURVEYOR]: [
        'land:read', 'survey:upload', 'property:read'
    ]
};

// Bayelsa State LGAs
const BAYELSA_LGAS = [
    'Brass',
    'Ekeremor',
    'Kolokuma/Opokuma',
    'Nembe',
    'Ogbia',
    'Sagbama',
    'Southern Ijaw',
    'Yenagoa'
];

// Land Use Types
const LAND_USE_TYPES = {
    RESIDENTIAL: 'residential',
    COMMERCIAL: 'commercial',
    INDUSTRIAL: 'industrial',
    AGRICULTURAL: 'agricultural',
    MIXED: 'mixed',
    RECREATIONAL: 'recreational',
    EDUCATIONAL: 'educational',
    RELIGIOUS: 'religious'
};

// Property Types
const PROPERTY_TYPES = {
    RESIDENTIAL: 'residential',
    COMMERCIAL: 'commercial',
    INDUSTRIAL: 'industrial',
    MIXED_USE: 'mixed_use',
    INSTITUTIONAL: 'institutional'
};

// Transaction Types
const TRANSACTION_TYPES = {
    SALE: 'sale',
    RENTAL: 'rental',
    LEASE: 'lease',
    TRANSFER: 'transfer',
    INHERITANCE: 'inheritance'
};

// Transaction Statuses
const TRANSACTION_STATUSES = {
    INITIATED: 'initiated',
    PAYMENT_PENDING: 'payment_pending',
    PAYMENT_CONFIRMED: 'payment_confirmed',
    DOCUMENTS_UPLOADED: 'documents_uploaded',
    VERIFIED: 'verified',
    APPROVED: 'approved',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    DISPUTED: 'disputed',
    REFUNDED: 'refunded'
};

// Incident Types
const INCIDENT_TYPES = {
    FRAUD: 'fraud',
    BOUNDARY_DISPUTE: 'boundary_dispute',
    DOUBLE_SALE: 'double_sale',
    FAKE_DOCUMENTS: 'fake_documents',
    ILLEGAL_OCCUPATION: 'illegal_occupation',
    ENCROACHMENT: 'encroachment',
    TITLE_DISPUTE: 'title_dispute',
    INHERITANCE_DISPUTE: 'inheritance_dispute',
    AGENT_MISCONDUCT: 'agent_misconduct',
    PAYMENT_FRAUD: 'payment_fraud',
    DOCUMENT_FORGERY: 'document_forgery',
    IDENTITY_THEFT: 'identity_theft',
    UNAUTHORIZED_CONSTRUCTION: 'unauthorized_construction',
    ENVIRONMENTAL_VIOLATION: 'environmental_violation',
    ZONING_VIOLATION: 'zoning_violation',
    TAX_EVASION: 'tax_evasion',
    CORRUPTION: 'corruption',
    EXTORTION: 'extortion',
    HARASSMENT: 'harassment',
    OTHER: 'other'
};

// Verification Types
const VERIFICATION_TYPES = {
    OWNERSHIP_CHECK: 'ownership_check',
    TITLE_VERIFICATION: 'title_verification',
    ENCUMBRANCE_CHECK: 'encumbrance_check',
    DUE_DILIGENCE: 'due_diligence',
    PRE_PURCHASE: 'pre_purchase'
};

// Fee Structure (as percentages)
const FEE_STRUCTURE = {
    AGENCY_FEE_RATE: 0.10, // 10%
    GOVERNMENT_REVENUE_RATE: 0.05, // 5%
    PLATFORM_FEE_RATE: 0.01, // 1%
    STAMP_DUTY_RATE: 0.005, // 0.5%
    VERIFICATION_FEE: 5000, // ₦5,000
    GROUND_RENT_ANNUAL: 10000, // ₦10,000
    ANNUAL_TAX_RATE_PER_SQM: 100 // ₦100 per square meter
};

// Certificate Validity Periods (in years)
const CERTIFICATE_VALIDITY = {
    CERTIFICATE_OF_OCCUPANCY: 99,
    BUILDING_LICENSE: 2,
    VERIFICATION_CERTIFICATE: 1
};

// File Upload Limits
const FILE_LIMITS = {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    MAX_FILES_PER_REQUEST: 10,
    ALLOWED_IMAGE_TYPES: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
    ALLOWED_DOCUMENT_TYPES: ['.pdf', '.doc', '.docx', '.txt'],
    ALLOWED_SURVEY_TYPES: ['.pdf', '.dwg', '.dxf', '.jpg', '.jpeg', '.png'],
    ALLOWED_VIDEO_TYPES: ['.mp4', '.avi', '.mov', '.wmv']
};

// Email Types
const EMAIL_TYPES = {
    TRANSACTION_RECEIPT: 'transaction_receipt',
    CERTIFICATE_ISSUED: 'certificate_issued',
    TAX_REMINDER: 'tax_reminder',
    AGENT_NOTIFICATION: 'agent_notification',
    VERIFICATION_COMPLETE: 'verification_complete',
    INCIDENT_UPDATE: 'incident_update',
    WELCOME: 'welcome',
    PASSWORD_RESET: 'password_reset',
    ACCOUNT_VERIFICATION: 'account_verification'
};

// System Status Codes
const STATUS_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

// API Response Messages
const API_MESSAGES = {
    SUCCESS: 'Operation completed successfully',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Access denied',
    VALIDATION_ERROR: 'Validation failed',
    INTERNAL_ERROR: 'Internal server error',
    DUPLICATE_RESOURCE: 'Resource already exists',
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_EXPIRED: 'Authentication token has expired',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions for this action'
};

// Payment Methods
const PAYMENT_METHODS = {
    BANK_TRANSFER: 'bank_transfer',
    CASH: 'cash',
    CHECK: 'check',
    ONLINE: 'online',
    INSTALLMENT: 'installment',
    MORTGAGE: 'mortgage'
};

// Building Materials
const BUILDING_MATERIALS = {
    WALLS: {
        CONCRETE_BLOCKS: 'concrete_blocks',
        BRICKS: 'bricks',
        SANDCRETE: 'sandcrete',
        MUD_BRICKS: 'mud_bricks',
        WOOD: 'wood',
        STEEL: 'steel'
    },
    ROOFING: {
        ALUMINUM_SHEETS: 'aluminum_sheets',
        TILES: 'tiles',
        CONCRETE_SLABS: 'concrete_slabs',
        THATCH: 'thatch',
        ASBESTOS: 'asbestos',
        PVC: 'pvc'
    },
    FLOORING: {
        TILES: 'tiles',
        MARBLE: 'marble',
        TERRAZZO: 'terrazzo',
        CONCRETE: 'concrete',
        WOOD: 'wood',
        CARPET: 'carpet'
    }
};

// SLA (Service Level Agreement) Times in hours
const SLA_TIMES = {
    VERIFICATION: {
        STANDARD: 72, // 3 days
        EXPRESS: 24, // 1 day
        URGENT: 4 // 4 hours
    },
    INCIDENT_RESPONSE: {
        CRITICAL: 4,
        HIGH: 24,
        MEDIUM: 72,
        LOW: 168 // 1 week
    },
    TRANSACTION_PROCESSING: {
        PAYMENT_TO_VERIFICATION: 24,
        VERIFICATION_TO_COMPLETION: 72,
        MAX_TOTAL_TIME: 168 // 1 week
    }
};

// Regex Patterns
const REGEX_PATTERNS = {
    NIGERIAN_PHONE: /^(\+234|234|0)(70|80|81|90|91|70|80|81|90|91)\d{8}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    LAND_ID: /^LAND-\d{13}-[A-Z0-9]{9}$/,
    TRANSACTION_ID: /^TXN-\d{13}-[A-Z0-9]{9}$/,
    USER_ID: /^USER-\d{13}-[A-Z0-9]{9}$/,
    PROPERTY_ID: /^PROP-\d{13}-[A-Z0-9]{9}$/,
    INCIDENT_ID: /^INC-\d{13}-[A-Z0-9]{9}$/,
    VERIFICATION_ID: /^VERIFY-\d{13}-[A-Z0-9]{9}$/,
    RECEIPT_NUMBER: /^RCP-BAY-\d{8}[A-Z0-9]{4}$/,
    COFO_NUMBER: /^BAY-COF-\d{8}[A-Z0-9]{4}$/
};

// Error Codes
const ERROR_CODES = {
    // Authentication Errors
    TOKEN_REQUIRED: 'TOKEN_REQUIRED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    ACCOUNT_NOT_VERIFIED: 'ACCOUNT_NOT_VERIFIED',
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',

    // Authorization Errors
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
    OWNERSHIP_REQUIRED: 'OWNERSHIP_REQUIRED',

    // Validation Errors
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

    // Business Logic Errors
    LAND_NOT_FOR_SALE: 'LAND_NOT_FOR_SALE',
    LAND_DISPUTED: 'LAND_DISPUTED',
    TRANSACTION_INVALID_STATUS: 'TRANSACTION_INVALID_STATUS',
    PAYMENT_ALREADY_CONFIRMED: 'PAYMENT_ALREADY_CONFIRMED',
    INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',

    // System Errors
    DATABASE_ERROR: 'DATABASE_ERROR',
    EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
    FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
    PDF_GENERATION_FAILED: 'PDF_GENERATION_FAILED',
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR'
};

// Notification Channels
const NOTIFICATION_CHANNELS = {
    EMAIL: 'email',
    SMS: 'sms',
    PUSH: 'push',
    IN_APP: 'in_app',
    WEBHOOK: 'webhook'
};

// Priority Levels
const PRIORITY_LEVELS = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent',
    CRITICAL: 'critical'
};

module.exports = {
    USER_ROLES,
    ROLE_PERMISSIONS,
    BAYELSA_LGAS,
    LAND_USE_TYPES,
    PROPERTY_TYPES,
    TRANSACTION_TYPES,
    TRANSACTION_STATUSES,
    INCIDENT_TYPES,
    VERIFICATION_TYPES,
    FEE_STRUCTURE,
    CERTIFICATE_VALIDITY,
    FILE_LIMITS,
    EMAIL_TYPES,
    STATUS_CODES,
    API_MESSAGES,
    PAYMENT_METHODS,
    BUILDING_MATERIALS,
    SLA_TIMES,
    REGEX_PATTERNS,
    ERROR_CODES,
    NOTIFICATION_CHANNELS,
    PRIORITY_LEVELS
};