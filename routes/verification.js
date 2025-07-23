const express = require('express');
const router = express.Router();
const { requestVerification, getMyVerifications, fulfillVerification, confirmPayment, updateVerificationStatus } = require('../controllers/verificationController');
const { authenticateToken, authorize } = require('../middleware/auth');

router.post('/', authenticateToken, requestVerification);
router.get('/my-requests', authenticateToken, getMyVerifications);
router.get('/:id/fulfill', authenticateToken, fulfillVerification);
router.post('/:id/confirm-payment', authenticateToken, authorize(['admin']), confirmPayment);
router.put('/:id/status', authenticateToken, authorize(['admin', 'government']), updateVerificationStatus);

module.exports = router;