const { connectDB, dbConnection } = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

async function testConnection() {
  console.log('Testing MongoDB connection...');
  
  try {
    await connectDB();
    
    const status = dbConnection.getConnectionStatus();
    console.log('\nConnection Status:', status);
    
    // Test inserting a document
    const testCollection = dbConnection.connection.db.collection('test');
    await testCollection.insertOne({
      test: true,
      timestamp: new Date()
    });
    
    console.log('✅ Test document inserted successfully');
    
    // Clean up
    await testCollection.deleteMany({ test: true });
    console.log('✅ Test document cleaned up');
    
    await dbConnection.disconnect();
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testConnection();