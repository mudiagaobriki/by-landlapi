const express = require('express');
const router = express.Router();
const { createTransaction, completeTransaction, getAllTransactions } = require('../controllers/transactionController');
const { authenticateToken, authorize } = require('../middleware/auth');

router.post('/', authenticateToken, createTransaction);
router.post('/:id/complete', authenticateToken, authorize(['admin', 'government']), completeTransaction);
router.get('/', authenticateToken, authorize(['admin', 'government']), getAllTransactions);

module.exports = router;