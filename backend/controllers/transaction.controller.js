const Transaction = require('../models/Transaction');

class TransactionController {
  // Create transaction record
  async createTransaction(req, res) {
    try {
      const transaction = new Transaction(req.body);
      await transaction.save();
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Error creating transaction', error: error.message });
    }
  }

  // Get transactions by wallet address
  async getTransactionsByWallet(req, res) {
    try {
      const { walletAddress } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const transactions = await Transaction.find({
        $or: [
          { fromAddress: walletAddress },
          { toAddress: walletAddress }
        ]
      })
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
      const total = await Transaction.countDocuments({
        $or: [
          { fromAddress: walletAddress },
          { toAddress: walletAddress }
        ]
      });
      
      res.json({
        transactions,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
  }

  // Update transaction status
  async updateTransactionStatus(req, res) {
    try {
      const { hash } = req.params;
      const { status, blockNumber } = req.body;
      
      const transaction = await Transaction.findOneAndUpdate(
        { hash },
        { status, blockNumber, updatedAt: new Date() },
        { new: true }
      );
      
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Error updating transaction', error: error.message });
    }
  }

  // Get transaction by hash
  async getTransactionByHash(req, res) {
    try {
      const { hash } = req.params;
      const transaction = await Transaction.findOne({ hash });
      
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transaction', error: error.message });
    }
  }
}

module.exports = new TransactionController();