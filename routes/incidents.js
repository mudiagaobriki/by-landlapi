const express = require('express');
const router = express.Router();
const { createIncident, getAllIncidents, getIncidentById, updateIncident, assignOfficer } = require('../controllers/incidentController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { uploadConfigs } = require('../middleware/upload');

router.post('/', authenticateToken, uploadConfigs.incidentEvidence, createIncident);
router.get('/', authenticateToken, authorize(['admin', 'government', 'court']), getAllIncidents);
router.get('/:id', authenticateToken, authorize(['admin', 'government', 'court']), getIncidentById);
router.put('/:id', authenticateToken, authorize(['admin', 'government']), updateIncident);
router.put('/:id/assign', authenticateToken, authorize(['admin', 'government']), assignOfficer);

module.exports = router;