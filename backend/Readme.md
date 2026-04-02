# Cardano DApp Backend

Production-ready Node.js/Express backend for Cardano blockchain dApp with MongoDB integration, JWT authentication, and rate limiting.

##  Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-set
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

##  Overview

This backend service provides REST APIs for the Cardano wallet dApp, handling:
- Wallet registration and management
- Transaction recording and history
- User profiles
- Real-time blockchain interaction
- Rate limiting and security

##  Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express | 4.18+ | Web framework |
| MongoDB | 7.0+ | Database |
| Mongoose | 7.5+ | ODM |
| JWT | 9.0+ | Authentication |
| Helmet | 7.0+ | Security headers |
| CORS | 2.8+ | Cross-origin resource sharing |
| Morgan | 1.10+ | HTTP logging |
| Express-rate-limit | 7.1+ | Rate limiting |

##  Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18.0.0 or higher)
  ```bash
  node --version

  ### . npm (v9.0.0 or higher) - npm --version  && MongoDB (v7.0 or higher) - mongod --version

### installation 
1. clone repository
git clone https://github.com/yourusername/cardano-wallet-dapp.git
cd cardano-wallet-dapp/backend

2.install dependencies and development dependencies 
npm install
npm install -D nodemon

.env
# Server Configuration
PORT=5000
NODE_ENV=development
HOST=localhost

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cardano-wallet-dapp

# JWT Configuration
JWT_SECRET##=your-super-secret-key-minimum-32-characters
JWT_EXPIRE=30d
JWT_REFRESH_EXPIRE=7d

# Cardano Network
CARDANO_NETWORK=testnet
BLOCKFROST_API_KEY=your-api-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=10
TX_RATE_LIMIT_MAX=5

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

### generetate jwt token
# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Mac/Linux
openssl rand -base64 32

## run
npm run dev

## folder structure 
backend/
├── config/
│   ├── db.js              # Database connection configuration
│   └── cardano.js         # Cardano network configuration
├── models/
│   ├── User.js            # User schema and model
│   └── Transaction.js     # Transaction schema and model
├── controllers/
│   ├── wallet.controller.js    # Wallet business logic
│   └── transaction.controller.js # Transaction business logic
├── routes/
│   ├── wallet.routes.js        # Wallet API routes
│   └── transaction.routes.js   # Transaction API routes
├── middleware/
│   ├── validateWallet.js       # Input validation
│   ├── auth.js                 # JWT authentication
│   └── errorHandler.js         # Error handling middleware
├── logs/                   # Application logs (auto-created)
├── server.js              # Main application entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
└── README.md             # Documentation
