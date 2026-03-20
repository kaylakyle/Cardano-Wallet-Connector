const validateWalletAddress = (req, res, next) => {
  const { walletAddress } = req.params;
  
  // Basic Cardano address validation (Bech32 format)
  const addressRegex = /^(addr|stake|addr_test|stake_test)[0-9a-z]+$/i;
  
  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }
  
  if (!addressRegex.test(walletAddress)) {
    return res.status(400).json({ message: 'Invalid wallet address format' });
  }
  
  next();
};

const validateTransaction = (req, res, next) => {
  const { toAddress, amount } = req.body;
  
  const addressRegex = /^(addr|stake|addr_test|stake_test)[0-9a-z]+$/i;
  
  if (!toAddress || !addressRegex.test(toAddress)) {
    return res.status(400).json({ message: 'Invalid recipient address' });
  }
  
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount. Must be greater than 0' });
  }
  
  next();
};

module.exports = {
  validateWalletAddress,
  validateTransaction
};