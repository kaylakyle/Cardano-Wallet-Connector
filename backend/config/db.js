const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

class DatabaseConnection {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

 getConnectionOptions() {
  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    retryReads: true,
  };

  // Add SSL for production
  if (process.env.NODE_ENV === 'production') {
    options.tls = true;
    options.tlsAllowInvalidCertificates = false;
  }

  return options;
}

  // Connect to MongoDB
  async connect() {
    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cardano-wallet-dapp';
      
      console.log('📡 Connecting to MongoDB...');
      console.log(`📍 URI: ${mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials in log
      
      const options = this.getConnectionOptions();
      
      this.connection = await mongoose.connect(mongoURI, options);
      this.isConnected = true;
      
      console.log('✅ MongoDB Connected Successfully');
      console.log(`📁 Database: ${this.connection.connection.name}`);
      console.log(`🖥️  Host: ${this.connection.connection.host}`);
      console.log(`🔢 Port: ${this.connection.connection.port}`);
      
      // Set up connection event listeners
      this.setupEventListeners();
      
      return this.connection;
      
    } catch (error) {
      console.error('❌ MongoDB Connection Error:', error.message);
      console.error('💡 Troubleshooting tips:');
      console.error('   1. Make sure MongoDB is installed and running');
      console.error('   2. Check if MongoDB service is started');
      console.error('   3. Verify the connection string in .env file');
      console.error('   4. Try running "mongosh" in terminal to test connection');
      process.exit(1);
    }
  }

  // Set up event listeners for connection monitoring
  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      this.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      this.isConnected = true;
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  // Disconnect from database
  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      console.log('📴 MongoDB disconnected');
      this.isConnected = false;
    }
  }

  // Check connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      readyStateText: this.getReadyStateText(mongoose.connection.readyState)
    };
  }

  getReadyStateText(state) {
    switch(state) {
      case 0: return 'disconnected';
      case 1: return 'connected';
      case 2: return 'connecting';
      case 3: return 'disconnecting';
      default: return 'unknown';
    }
  }
}

// Create and export a singleton instance
const dbConnection = new DatabaseConnection();

const connectDB = async () => {
  return await dbConnection.connect();
};

module.exports = {
  connectDB,
  dbConnection
};