// const mongoose = require('mongoose');

// const walletSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   walletAddress: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true
//   },
//   walletName: {
//     type: String,
//     enum: ['nami', 'flint', 'eternl', 'yoroi', 'typhon'],
//     required: true
//   },
//   stakeAddress: String,
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   lastConnected: {
//     type: Date,
//     default: Date.now
//   },
//   network: {
//     type: String,
//     enum: ['mainnet', 'testnet'],
//     default: 'testnet'
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Wallet', walletSchema);