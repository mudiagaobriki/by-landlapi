const express = require('express');
const router = express.Router();
const { registerProperty, getAllProperties, getPropertyById, generateBuildingLicense } = require('../controllers/propertyController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { uploadConfigs } = require('../middleware/upload');

router.post('/', authenticateToken, uploadConfigs.propertyRegistration, registerProperty);
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.post('/:id/generate-license', authenticateToken, authorize(['government']), generateBuildingLicense);

module.exports = router;