import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';

// Remove these imports:
// import { FiWallet, FiLogOut, FiChevronDown } from 'react-icons/fi';

const WalletConnect = () => {
  const { connected, wallet, balance, network, availableWallets, connectWallet, disconnectWallet, loading } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleConnect = async (walletName) => {
    const success = await connectWallet(walletName);
    if (success) setIsOpen(false);
  };
  
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };
  
  if (connected && wallet) {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 rounded-full hover:shadow-lg transition-all"
        >
          <span className="text-xl">💰</span>
          <span className="font-semibold">{truncateAddress(wallet.address)}</span>
          <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </motion.button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 glass-effect overflow-hidden z-50"
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Connected Wallet</span>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    {network}
                  </span>
                </div>
                <div className="bg-black/30 p-3 rounded-lg mb-3">
                  <div className="text-xs text-gray-400 mb-1">Address</div>
                  <div className="text-sm font-mono break-all">{wallet.address}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-400">Balance</div>
                    <div className="text-2xl font-bold">{balance} ₳</div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">₳</span>
                  </div>
                </div>
              </div>
              <button
                onClick={disconnectWallet}
                className="w-full py-3 flex items-center justify-center space-x-2 hover:bg-red-500/20 transition-colors text-red-400"
              >
                <span>🚪</span>
                <span>Disconnect</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
        disabled={loading}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <span>🔌</span>
        )}
        <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-72 glass-effect overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold mb-2">Select Wallet</h3>
              <p className="text-xs text-gray-400">Choose a Cardano wallet to connect</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {availableWallets.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  <p>No Cardano wallets found</p>
                  <p className="text-xs mt-2">Install Nami, Eternl, or Flint extension</p>
                </div>
              ) : (
                availableWallets.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleConnect(w.name)}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-2xl">{w.icon}</span>
                    <span className="font-medium">{w.name}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletConnect;