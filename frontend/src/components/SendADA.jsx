import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { FiSend, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SendADA = () => {
  const { sendADA, connected, balance, network } = useWallet();
  const [formData, setFormData] = useState({
    toAddress: '',
    amount: '',
    metadata: ''
  });
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate address (basic Cardano address format)
    const addressRegex = /^(addr|stake|addr_test|stake_test)[0-9a-z]+$/i;
    if (!formData.toAddress) {
      newErrors.toAddress = 'Recipient address is required';
    } else if (!addressRegex.test(formData.toAddress)) {
      newErrors.toAddress = 'Invalid Cardano address format';
    }
    
    // Validate amount
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (balance && parseFloat(formData.amount) > parseFloat(balance)) {
      newErrors.amount = `Insufficient balance. You have ${balance} ADA`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setSending(true);
    try {
      const metadata = formData.metadata ? { message: formData.metadata, timestamp: Date.now() } : {};
      const result = await sendADA(formData.toAddress, parseFloat(formData.amount), metadata);
      
      if (result) {
        setFormData({ toAddress: '', amount: '', metadata: '' });
        setShowPreview(false);
        toast.success(`Successfully sent ${formData.amount} ADA!`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Transaction failed: ' + error.message);
    } finally {
      setSending(false);
    }
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };
  
  const getNetworkWarning = () => {
    if (network === 'Testnet') {
      return {
        message: 'You are on Testnet. Use test ADA only!',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10'
      };
    }
    return {
      message: 'You are on Mainnet. Transactions are irreversible!',
      color: 'text-red-400',
      bg: 'bg-red-500/10'
    };
  };
  
  const networkWarning = getNetworkWarning();
  
  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="glass-effect p-12 text-center">
          <div className="inline-flex p-4 bg-blue-500/20 rounded-full mb-4">
            <FiSend className="text-4xl text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Connect Your Wallet</h3>
          <p className="text-gray-400 mb-6">
            Please connect your Cardano wallet to start sending ADA
          </p>
          <div className="text-sm text-gray-500">
            Supported wallets: Nami, Eternl, Flint
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Network Warning */}
      <div className={`${networkWarning.bg} border border-current rounded-lg p-4 mb-6`}>
        <div className="flex items-start space-x-3">
          <FiInfo className={`${networkWarning.color} text-xl flex-shrink-0 mt-0.5`} />
          <div>
            <p className={`${networkWarning.color} font-medium`}>
              {networkWarning.message}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Double-check the recipient address before sending
            </p>
          </div>
        </div>
      </div>
      
      <div className="glass-effect p-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
            <FiSend className="text-3xl text-white" />
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Send ADA</h2>
          <p className="text-gray-300">Send ADA to any Cardano address</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Address */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Recipient Address *
            </label>
            <div className="relative">
              <input
                type="text"
                name="toAddress"
                value={formData.toAddress}
                onChange={handleChange}
                placeholder="addr1..."
                className={`w-full px-4 py-3 bg-black/30 border rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  errors.toAddress ? 'border-red-500' : 'border-white/10'
                }`}
                disabled={sending}
              />
              {errors.toAddress && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <FiAlertCircle className="mr-1" />
                  {errors.toAddress}
                </p>
              )}
            </div>
          </div>
          
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Amount (ADA) *
            </label>
            <div className="relative">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.000001"
                placeholder="0.00"
                className={`w-full px-4 py-3 bg-black/30 border rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  errors.amount ? 'border-red-500' : 'border-white/10'
                }`}
                disabled={sending}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ₳
              </div>
            </div>
            {errors.amount ? (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <FiAlertCircle className="mr-1" />
                {errors.amount}
              </p>
            ) : balance && (
              <p className="text-xs text-gray-400 mt-1">
                Available balance: {balance} ADA
              </p>
            )}
          </div>
          
          {/* Metadata */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Message (Optional)
            </label>
            <textarea
              name="metadata"
              value={formData.metadata}
              onChange={handleChange}
              rows="3"
              placeholder="Add a message or note..."
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
              disabled={sending}
            />
            <p className="text-xs text-gray-400 mt-1">
              Max 255 characters. This message will be stored on the blockchain
            </p>
          </div>
          
          {/* Preview Button */}
          {formData.toAddress && formData.amount && !errors.toAddress && !errors.amount && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          )}
          
          {/* Transaction Preview */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-black/40 rounded-lg p-4 space-y-2"
              >
                <h4 className="font-semibold mb-2">Transaction Preview</h4>
                <div className="text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Send:</span>
                    <span className="font-mono">{formData.amount} ADA</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">To:</span>
                    <span className="font-mono text-xs break-all text-right">
                      {formData.toAddress}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-white/10 mt-2 pt-2">
                    <span className="text-gray-400">Fee:</span>
                    <span>~0.17 ADA</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold">
                    <span className="text-gray-400">Total:</span>
                    <span>~{(parseFloat(formData.amount) + 0.17).toFixed(6)} ADA</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={sending || !formData.toAddress || !formData.amount}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            {sending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending Transaction...</span>
              </>
            ) : (
              <>
                <FiSend />
                <span>Send ADA</span>
              </>
            )}
          </motion.button>
          
          {/* Warning */}
          <div className="text-center text-xs text-gray-500">
            <p>⚠️ Transactions are irreversible. Please verify the recipient address carefully.</p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SendADA;