const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    // REMOVE: unique: true
  },
  fromAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  toAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  amount: {
    type: String,
    required: true
  },
  lovelaceAmount: {
    type: Number,
    required: true
  },
  assets: {
    type: Map,
    of: String,
    default: {}
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  blockNumber: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Keep only these indexes (add unique here)
transactionSchema.index({ hash: 1 }, { unique: true });
transactionSchema.index({ fromAddress: 1 });
transactionSchema.index({ toAddress: 1 });
transactionSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);