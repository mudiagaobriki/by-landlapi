const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
    const dirs = [
        'uploads',
        'uploads/documents',
        'uploads/images',
        'uploads/surveys',
        'uploads/receipts',
        'uploads/evidence'
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

// Initialize upload directories
createUploadDirs();

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        // Organize files by type
        if (file.fieldname.includes('survey') || file.fieldname.includes('plan')) {
            uploadPath += 'surveys/';
        } else if (file.fieldname.includes('image') || file.fieldname.includes('satellite')) {
            uploadPath += 'images/';
        } else if (file.fieldname.includes('evidence')) {
            uploadPath += 'evidence/';
        } else if (file.fieldname.includes('receipt')) {
            uploadPath += 'receipts/';
        } else {
            uploadPath += 'documents/';
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Create unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extension).replace(/[^a-zA-Z0-9]/g, '-');

        cb(null, `${baseName}-${uniqueSuffix}${extension}`);
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Define allowed file types for different upload types
    const allowedTypes = {
        documents: ['.pdf', '.doc', '.docx', '.txt'],
        images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
        surveys: ['.pdf', '.dwg', '.dxf', '.jpg', '.jpeg', '.png'],
        evidence: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.mp4', '.avi'],
        plans: ['.pdf', '.dwg', '.dxf', '.jpg', '.jpeg', '.png']
    };

    const fileExtension = path.extname(file.originalname).toLowerCase();
    let isAllowed = false;

    // Check based on field name
    if (file.fieldname.includes('survey') || file.fieldname.includes('plan')) {
        isAllowed = allowedTypes.surveys.includes(fileExtension);
    } else if (file.fieldname.includes('image') || file.fieldname.includes('satellite')) {
        isAllowed = allowedTypes.images.includes(fileExtension);
    } else if (file.fieldname.includes('evidence')) {
        isAllowed = allowedTypes.evidence.includes(fileExtension);
    } else {
        isAllowed = allowedTypes.documents.includes(fileExtension);
    }

    if (isAllowed) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${fileExtension} not allowed for field ${file.fieldname}`), false);
    }
};

// Create multer instance with configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        files: 10 // Maximum 10 files per request
    }
});

// Specific upload configurations for different routes
const uploadConfigs = {
    // Land registration uploads
    landRegistration: upload.fields([
        { name: 'surveyPlan', maxCount: 1 },
        { name: 'satelliteImages', maxCount: 5 },
        { name: 'documents', maxCount: 3 }
    ]),

    // Property registration uploads
    propertyRegistration: upload.fields([
        { name: 'buildingPlan', maxCount: 1 },
        { name: 'images', maxCount: 10 },
        { name: 'documents', maxCount: 5 }
    ]),

    // Transaction document uploads
    transactionDocuments: upload.fields([
        { name: 'saleAgreement', maxCount: 1 },
        { name: 'receiptOfPayment', maxCount: 1 },
        { name: 'deedOfAssignment', maxCount: 1 },
        { name: 'governmentConsent', maxCount: 1 },
        { name: 'additionalDocuments', maxCount: 3 }
    ]),

    // Incident evidence uploads
    incidentEvidence: upload.array('evidence', 5),

    // Survey data uploads
    surveyData: upload.fields([
        { name: 'surveyPlan', maxCount: 1 },
        { name: 'coordinateData', maxCount: 1 },
        { name: 'images', maxCount: 5 }
    ]),

    // General single file upload
    singleFile: upload.single('file'),

    // Multiple images upload
    multipleImages: upload.array('images', 10),

    // CSV/Excel file upload
    dataFile: upload.single('dataFile')
};

// Error handling middleware for multer errors
const handleUploadErrors = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        switch (error.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(413).json({
                    message: 'File too large. Maximum size is 50MB',
                    code: 'FILE_TOO_LARGE'
                });
            case 'LIMIT_FILE_COUNT':
                return res.status(413).json({
                    message: 'Too many files. Maximum allowed files exceeded',
                    code: 'TOO_MANY_FILES'
                });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                    message: 'Unexpected file field',
                    code: 'UNEXPECTED_FILE'
                });
            default:
                return res.status(400).json({
                    message: 'File upload error',
                    code: 'UPLOAD_ERROR',
                    details: error.message
                });
        }
    }

    if (error.message.includes('File type')) {
        return res.status(400).json({
            message: error.message,
            code: 'INVALID_FILE_TYPE'
        });
    }

    next(error);
};

// File cleanup utility
const cleanupFiles = (files) => {
    if (!files) return;

    const deleteFile = (filePath) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    };

    if (Array.isArray(files)) {
        files.forEach(file => deleteFile(file.path));
    } else if (typeof files === 'object') {
        Object.values(files).forEach(fileArray => {
            if (Array.isArray(fileArray)) {
                fileArray.forEach(file => deleteFile(file.path));
            } else {
                deleteFile(fileArray.path);
            }
        });
    }
};

// Middleware to validate uploaded files
const validateUploadedFiles = (requiredFields = []) => {
    return (req, res, next) => {
        if (requiredFields.length === 0) {
            return next();
        }

        const missingFields = requiredFields.filter(field => {
            return !req.files || !req.files[field] || req.files[field].length === 0;
        });

        if (missingFields.length > 0) {
            // Cleanup uploaded files if validation fails
            cleanupFiles(req.files);

            return res.status(400).json({
                message: 'Required files missing',
                code: 'MISSING_FILES',
                missingFields: missingFields
            });
        }

        next();
    };
};

// Get file type from extension
const getFileType = (filename) => {
    const extension = path.extname(filename).toLowerCase();

    const typeMap = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp',
        '.dwg': 'application/acad',
        '.dxf': 'application/dxf',
        '.txt': 'text/plain',
        '.csv': 'text/csv',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.xls': 'application/vnd.ms-excel'
    };

    return typeMap[extension] || 'application/octet-stream';
};

module.exports = {
    upload,
    uploadConfigs,
    handleUploadErrors,
    cleanupFiles,
    validateUploadedFiles,
    getFileType,
    createUploadDirs
};