import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from './WalletConnector';

const Navbar = () => {
  const { connected, balance, network } = useWallet();
  
  return (
    <nav className="glass-effect px-6 py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-2xl">₳</span>
          </div>
          <Link to="/" className="text-2xl font-bold gradient-text">
            Cardano DApp
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="hidden md:flex items-center space-x-8"
        >
          <Link to="/" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <Link to="/send" className="hover:text-blue-400 transition-colors">Send ADA</Link>
          <Link to="/transactions" className="hover:text-blue-400 transition-colors">Transactions</Link>
        </motion.div>
        
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center space-x-4"
        >
          {connected && (
            <div className="hidden md:flex items-center space-x-3 bg-black/30 px-4 py-2 rounded-full">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">{network}</span>
              </div>
              <div className="border-l border-white/20 pl-3">
                <span className="font-bold">{balance} ₳</span>
              </div>
            </div>
          )}
          <WalletConnect />
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;