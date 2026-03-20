const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Import database connection
const { connectDB, dbConnection } = require('./config/db');

// Import routes
const walletRoutes = require('./routes/wallet.routes');
const transactionRoutes = require('./routes/transaction.routes');

// Initialize express app
const app = express();

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression - gzip compression for all responses
app.use(compression());

// ==========================================
// RATE LIMITING
// ==========================================

// General rate limiter for all requests
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count successful requests
});

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again after 5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Transaction limiter
const transactionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 transactions per minute
  message: {
    error: 'Too many transaction attempts, please wait a moment'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general limiter to all routes
app.use('/api', generalLimiter);

// Apply specific limiters to specific routes
app.use('/api/auth', authLimiter);
app.use('/api/wallet/connect', authLimiter);
app.use('/api/transactions', transactionLimiter);

// ==========================================
// LOGGING
// ==========================================

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create write stream for logging
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Morgan logging middleware
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev')); // Console logging

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-RateLimit-Limit', 'X-RateLimit-Remaining']
}));

// ==========================================
// BODY PARSING
// ==========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// REQUEST LOGGING
// ==========================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('  Headers:', JSON.stringify(req.headers, null, 2));
  if (Object.keys(req.body).length > 0) {
    console.log('  Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// ==========================================
// API ROUTES
// ==========================================
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);

// ==========================================
// HEALTH CHECK ENDPOINT
// ==========================================
app.get('/api/health', (req, res) => {
  const dbStatus = dbConnection.getConnectionStatus();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: {
      connected: dbStatus.isConnected,
      readyState: dbStatus.readyStateText,
      name: mongoose.connection.name,
      host: mongoose.connection.host
    },
    memory: process.memoryUsage(),
    version: process.version
  });
});

// ==========================================
// 404 HANDLER
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    path: req.path,
    method: req.method
  });
});

// ==========================================
// ERROR HANDLING MIDDLEWARE
// ==========================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Log error to file
  const errorLog = fs.createWriteStream(
    path.join(logsDir, 'error.log'),
    { flags: 'a' }
  );
  errorLog.write(`${new Date().toISOString()} - ${err.stack}\n`);
  errorLog.end();
  
  // Send appropriate error response
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack,
      name: err.name
    } : undefined,
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log('\n=================================');
      console.log('🚀 Server Started Successfully');
      console.log('=================================');
      console.log(`📍 URL: http://${process.env.HOST || 'localhost'}:${PORT}`);
      console.log(`🏥 Health: http://${process.env.HOST || 'localhost'}:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔢 Port: ${PORT}`);
      console.log(`📁 Logs: ${path.join(__dirname, 'logs')}`);
      console.log('=================================\n');
    });
    
    // Graceful shutdown
    const gracefulShutdown = async () => {
      console.log('\n📴 Received shutdown signal');
      console.log('Closing HTTP server...');
      
      server.close(async () => {
        console.log('HTTP server closed');
        await dbConnection.disconnect();
        console.log('Process terminated');
        process.exit(0);
      });
      
      // Force close after 10 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };
    
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;