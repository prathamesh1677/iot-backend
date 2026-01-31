const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  let uri = process.env.MONGODB_URI?.trim();

  if (uri === 'memory' || !uri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log('Using in-memory MongoDB (data resets on restart)');
  }

  const options = {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  };

  if (uri.startsWith('mongodb://') && !uri.includes('mongodb+srv')) {
    options.directConnection = true;
  }

  try {
    const conn = await mongoose.connect(uri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (error.reason) console.error('Reason:', error.reason);
    process.exit(1);
  }
};

module.exports = connectDB;
