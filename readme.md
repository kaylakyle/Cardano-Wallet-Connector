## frontend set up
## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cardano-wallet-dapp.git
cd cardano-wallet-dapp/frontend

### 1. install dependencies
npm install

### 1. config environment .env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Network Configuration
VITE_NETWORK=testnet

# Supported Wallets
VITE_SUPPORTED_WALLETS=nami,eternl,flint

### 1. start development server
npm run dev - http://localhost:5173

### backend setup
installation 
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

###. Simple Steps to Connect Wallet
1. Install a Cardano Wallet Extension
For Chrome/Brave/Edge:

Nami Wallet: https://chrome.google.com/webstore/detail/nami/lpfcbjknjpeeailhpklibjofjimfiof

Eternl Wallet: https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka

Click "Add to Chrome" and install.

### 2. Create/Setup Wallet
Click the extension icon in your browser

Choose "Create New Wallet" or "Restore Wallet"

Save your recovery phrase (12-24 words) safely

Set a spending password

Important: Switch to Testnet mode

In Nami: Click settings → Network → Testnet/main

In Eternl: Click network icon → Select Testnet

### 3. Get Test ADA (Free)
Go to https://docs.cardano.org/cardano-testnet/tools/faucet

Paste your wallet address

Request 1000 test ADA

Wait 1-2 minutes

###4. Connect to Your App
Open your app: http://localhost:5173

Click the "Connect Wallet" button

Select Nami or Eternl

Approve connection in the wallet popup

Done! You'll see your balance and can send ADA

###  5. Send ADA
Click "Send ADA" in navigation

Enter recipient address

Enter amount (e.g., 10)

Click "Send ADA"

Confirm in wallet

Transaction sent!
