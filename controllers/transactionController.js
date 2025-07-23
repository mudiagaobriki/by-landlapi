const { Transaction, Land, User } = require('../models');
const { generateId, generateReceiptNumber, calculateFees } = require('../utils/helpers');
const PDFService = require('../services/pdfService');
const emailService = require('../services/emailService');

// @desc    Initiate a new land transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res) => {
    const { landId, buyerId, agentId, transactionType, amount } = req.body;

    try {
        const land = await Land.findOne({ landId });
        if (!land) return res.status(404).json({ message: 'Land not found.' });

        if (land.status === 'disputed') {
            return res.status(400).json({ message: 'This land is currently disputed.' });
        }

        const buyer = await User.findOne({ userId: buyerId });
        if (!buyer) return res.status(404).json({ message: 'Buyer not found.' });

        const seller = await User.findById(land.currentOwner);

        let agent = null;
        if (agentId) {
            agent = await User.findOne({ userId: agentId, role: 'agent' });
            if (!agent) return res.status(404).json({ message: 'Agent not found.' });
        }

        const fees = calculateFees(Number(amount));

        const transaction = new Transaction({
            transactionId: generateId('TXN'),
            landId,
            buyer: buyer._id,
            seller: seller._id,
            agent: agent ? agent._id : undefined,
            transactionType,
            amount: Number(amount),
            agencyFee: agent ? fees.agencyFee : 0,
            governmentRevenue: fees.governmentRevenue,
            platformFee: fees.platformFee
        });

        await transaction.save();
        res.status(201).json({ message: 'Transaction initiated successfully.', transaction });

    } catch (error) {
        res.status(500).json({ message: 'Server error creating transaction.', error: error.message });
    }
};

// @desc    Confirm payment and complete a transaction
// @route   POST /api/transactions/:id/complete
// @access  Private (Government, Admin)
exports.completeTransaction = async (req, res) => {
    const { paymentReference } = req.body;
    try {
        const transaction = await Transaction.findOne({ transactionId: req.params.id });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });

        // Update transaction status
        transaction.status = 'completed';
        transaction.paymentReference = paymentReference;
        transaction.completionDate = new Date();

        // Transfer land ownership
        const land = await Land.findOne({ landId: transaction.landId });
        land.ownershipHistory.push({
            owner: land.currentOwner,
            acquiredDate: land.updatedAt,
            acquisitionType: 'purchase'
        });
        land.currentOwner = transaction.buyer;
        land.forSale = false; // Mark as not for sale

        await land.save();
        await transaction.save();

        // Populate details for receipt generation
        await transaction.populate(['buyer', 'seller', 'agent']);

        const receiptNumber = generateReceiptNumber();
        const pdfFileName = await PDFService.generateReceiptPDF(transaction, land, transaction.buyer, transaction.seller, transaction.agent, receiptNumber);

        transaction.receipt.receiptNumber = receiptNumber;
        transaction.receipt.pdfPath = `receipts/${pdfFileName}`;
        transaction.receipt.generatedAt = new Date();
        await transaction.save();

        // Send email receipts
        await emailService.sendReceipt(transaction.buyer.email, transaction, land, transaction.buyer, transaction.seller, transaction.agent, receiptNumber, transaction.receipt.pdfPath);
        await emailService.sendReceipt(transaction.seller.email, transaction, land, transaction.buyer, transaction.seller, transaction.agent, receiptNumber, transaction.receipt.pdfPath);

        res.json({ message: 'Transaction completed and ownership transferred.', transaction });

    } catch (error) {
        res.status(500).json({ message: 'Server error completing transaction.', error: error.message });
    }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private (Government, Admin)
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('buyer seller agent', 'firstName lastName');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};