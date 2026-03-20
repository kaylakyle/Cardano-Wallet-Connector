const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

// Routes
router.post('/', transactionController.createTransaction);
router.get('/wallet/:walletAddress', transactionController.getTransactionsByWallet);
router.get('/:hash', transactionController.getTransactionByHash);
router.put('/:hash/status', transactionController.updateTransactionStatus);

module.exports = router;