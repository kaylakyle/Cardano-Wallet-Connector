import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const walletService = {
  connectWallet: async (walletData) => {
    const response = await api.post('/wallets/connect', walletData);
    return response.data;
  },

  disconnectWallet: async (walletData) => {
    const response = await api.post('/wallets/disconnect', walletData);
    return response.data;
  },

  getWalletInfo: async (address) => {
    const response = await api.get(`/wallets/info/${address}`);
    return response.data;
  },

  getWalletBalance: async (address) => {
    const response = await api.get(`/wallets/balance/${address}`);
    return response.data;
  },

  sendTransaction: async (txData) => {
    const response = await api.post('/transactions/send', txData);
    return response.data;
  },

  getTransactionHistory: async (walletAddress) => {
    const response = await api.get(`/transactions/history/${walletAddress}`);
    return response.data;
  },

  getTransactionDetails: async (txHash) => {
    const response = await api.get(`/transactions/${txHash}`);
    return response.data;
  }
};

export const authService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  }
};