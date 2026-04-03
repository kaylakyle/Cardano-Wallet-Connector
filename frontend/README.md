  <h1>Cardano DApp</h1>
  <p><strong>Production-Ready React Application for Cardano Blockchain</strong></p>
  
  [![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  
  <p>A modern, production-ready decentralized application that connects Cardano wallets, enables ADA transfers, and provides real-time transaction tracking with a beautiful UI/UX.</p>
</div>

## Key Features

<table>
<tr>
<td width="50%">

### **Wallet Integration**
- Connect to **Nami**, **Eternl**, and **Flint** wallets
- CIP-30 compliant wallet API
- Automatic network detection (Testnet/Mainnet)
- Real-time balance updates

</td>
<td width="50%">

###  **Send ADA**
- Transfer ADA to any Cardano address
- Metadata support for transactions
- Transaction preview before sending
- Fee estimation

</td>
</tr>
<tr>
<td width="50%">

### **Dashboard**
- Real-time balance display
- Transaction volume charts
- Network status indicator
- Recent transaction history

</td>
<td width="50%">

###  **Modern UI/UX**
- Glass morphism design
- Smooth animations with Framer Motion
- Fully responsive
- Dark theme optimized

</td>
</tr>
</table>

## Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend Framework** | React 18, React Router 6 |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 4, CSS3 |
| **Animations** | Framer Motion |
| **State Management** | React Context API |
| **HTTP Client** | Axios |
| **Notifications** | React Hot Toast |
| **Charts** | Recharts |
| **Icons** | React Icons |

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **Cardano Wallet Extension** (choose one):
  - [Nami Wallet](https://chrome.google.com/webstore/detail/nami/lpfcbjknjpeeailhpklibjofjimfiof)
  - [Eternl Wallet](https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka)
  - [Flint Wallet](https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj)

## Quick Start

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

### Project Structure
frontend/
├── src/
│   ├── components/               # Reusable UI Components
│   │   ├── Navbar.jsx           # Navigation with wallet status
│   │   ├── WalletConnector.jsx  # Wallet connection modal
│   │   ├── Dashboard.jsx        # Main dashboard view
│   │   ├── SendADA.jsx          # Send ADA form
│   │   └── Transactions.jsx     # Transaction history
│   ├── contexts/                # React Context Providers
│   │   └── WalletContext.jsx    # Global wallet state
│   ├── styles/                  # Global styles
│   │   └── index.css            # Tailwind imports & custom styles
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Application entry point
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies
└── README.md                    # Documentation

### . Wallet Connection Flow
// Simplified wallet connection process
1. User clicks "Connect Wallet"
2. App scans for installed Cardano wallets
3. User selects preferred wallet
4. Wallet extension requests permissions
5. User approves connection
6. App retrieves:
   - Wallet address
   - Stake address
   - Network ID
   - ADA balance
7. Connection established

###. Sending ADA
// Transaction flow
1. User enters recipient address
2. Input amount in ADA
3. Optional metadata/message
4. Preview transaction details
5. User confirms in wallet
6. Transaction signed and submitted
7. Real-time status updates

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
