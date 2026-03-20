import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableWallets, setAvailableWallets] = useState([]);

  // Check for available wallets
  const checkAvailableWallets = () => {
    const wallets = [];
    
    if (window.cardano) {
      if (window.cardano.nami) wallets.push({ name: 'Nami', icon: '🟠', api: window.cardano.nami });
      if (window.cardano.eternl) wallets.push({ name: 'Eternl', icon: '🔷', api: window.cardano.eternl });
      if (window.cardano.flint) wallets.push({ name: 'Flint', icon: '🔥', api: window.cardano.flint });
      if (window.cardano.typhon) wallets.push({ name: 'Typhon', icon: '🐉', api: window.cardano.typhon });
    }
    
    setAvailableWallets(wallets);
    return wallets.length > 0;
  };

  // Connect to wallet
  const connectWallet = async (walletName) => {
    setLoading(true);
    try {
      if (!window.cardano) {
        toast.error('Please install a Cardano wallet extension (Nami, Eternl, or Flint)');
        return false;
      }
      
      let walletApi;
      switch(walletName.toLowerCase()) {
        case 'nami':
          walletApi = await window.cardano.nami.enable();
          break;
        case 'eternl':
          walletApi = await window.cardano.eternl.enable();
          break;
        case 'flint':
          walletApi = await window.cardano.flint.enable();
          break;
        default:
          walletApi = await window.cardano[walletName.toLowerCase()]?.enable();
      }
      
      if (!walletApi) {
        toast.error('Failed to connect to wallet');
        return false;
      }
      
      const addresses = await walletApi.getUsedAddresses();
      const stakeAddresses = await walletApi.getRewardAddresses();
      const networkId = await walletApi.getNetworkId();
      
      const walletAddress = addresses[0];
      const stakeAddress = stakeAddresses[0];
      
      // Save to backend
      const response = await axios.post('http://localhost:5000/api/wallet/connect', {
        walletAddress,
        stakeAddress,
      });
      
      // Get balance
      const rawBalance = await walletApi.getBalance();
      const adaBalance = (parseInt(rawBalance) / 1000000).toFixed(2);
      
      setWallet({
        name: walletName,
        api: walletApi,
        address: walletAddress,
        stakeAddress: stakeAddress,
        networkId: networkId,
        userData: response.data.user
      });
      
      setBalance(adaBalance);
      setConnected(true);
      setNetwork(networkId === 0 ? 'Testnet' : 'Mainnet');
      
      toast.success(`Successfully connected to ${walletName}!`);
      return true;
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet(null);
    setConnected(false);
    setBalance(null);
    setNetwork(null);
    toast.success('Wallet disconnected');
  };

  // Send ADA transaction
  const sendADA = async (toAddress, amount, metadata = {}) => {
    if (!wallet || !connected) {
      toast.error('Please connect wallet first');
      return false;
    }
    
    setLoading(true);
    try {
      const lovelaceAmount = parseInt(amount * 1000000);
      
      // Create transaction (simplified - in production use Cardano Serialization Lib)
      const tx = {
        to: toAddress,
        amount: lovelaceAmount,
        metadata: metadata
      };
      
      // In a real implementation, you would:
      // 1. Build the transaction using Cardano Serialization Library
      // 2. Sign with wallet API
      // 3. Submit to the network
      
      // Save transaction to backend
      const response = await axios.post('http://localhost:5000/api/transactions', {
        hash: 'pending_' + Date.now(),
        fromAddress: wallet.address,
        toAddress: toAddress,
        amount: amount.toString(),
        lovelaceAmount: lovelaceAmount,
        metadata: metadata
      });
      
      toast.success(`Transaction initiated! Amount: ${amount} ADA`);
      return response.data;
      
    } catch (error) {
      console.error('Error sending ADA:', error);
      toast.error('Failed to send ADA: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get transaction history
  const getTransactionHistory = async (page = 1) => {
    if (!wallet || !connected) return [];
    
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions/wallet/${wallet.address}?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  };

  useEffect(() => {
    checkAvailableWallets();
    
    // Check if wallet was previously connected
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet && window.cardano) {
      connectWallet(savedWallet);
    }
  }, []);

  useEffect(() => {
    if (connected && wallet) {
      localStorage.setItem('connectedWallet', wallet.name);
    } else {
      localStorage.removeItem('connectedWallet');
    }
  }, [connected, wallet]);

  const value = {
    wallet,
    connected,
    balance,
    network,
    loading,
    availableWallets,
    connectWallet,
    disconnectWallet,
    sendADA,
    getTransactionHistory,
    checkAvailableWallets
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};