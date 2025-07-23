const express = require('express');
const router = express.Router();
const { registerLand, getAllLands, getLandById, issueCertificateOfOccupancy, updateTaxInfo } = require('../controllers/landController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { uploadConfigs } = require('../middleware/upload');

router.post('/', authenticateToken, authorize(['admin', 'government']), uploadConfigs.landRegistration, registerLand);
router.get('/', getAllLands);
router.get('/:id', getLandById);
router.post('/:id/issue-cofo', authenticateToken, authorize(['admin', 'government']), issueCertificateOfOccupancy);
router.put('/:id/tax', authenticateToken, authorize(['admin', 'government']), updateTaxInfo);

module.exports = router;