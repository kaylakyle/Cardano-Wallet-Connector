import React from 'react';
import { useWallet } from '../contexts/WalletContext';

const Dashboard = () => {
  const { connected, balance, wallet } = useWallet();

  if (!connected) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to Cardano DApp</h1>
        <p>Click Connect Wallet to get started</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white/10 rounded-lg p-6">
        <p className="mb-2"><strong>Balance:</strong> {balance} ADA</p>
        <p className="mb-2"><strong>Address:</strong> {wallet?.address?.slice(0, 20)}...</p>
      </div>
    </div>
  );
};

export default Dashboard;