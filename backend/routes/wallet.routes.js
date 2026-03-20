const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');

// Routes
router.post('/connect', walletController.connectWallet);
router.get('/:walletAddress', walletController.getUserByWallet);
router.put('/:walletAddress', walletController.updateProfile);
router.get('/', walletController.getAllUsers);

module.exports = router;