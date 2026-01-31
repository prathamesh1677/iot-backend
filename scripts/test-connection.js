/**
 * Run: npm run test:db
 * Tests MongoDB connection and prints diagnostics.
 */
require('dotenv').config();

async function test() {
  console.log('MongoDB Connection Test\n');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? '***set***' : '(not set)');
  console.log('');

  if (!process.env.MONGODB_URI) {
    console.log('No MONGODB_URI in .env - run with: npm run dev:memory');
    console.log('Or set MONGODB_URI in .env');
    process.exit(1);
  }

  try {
    const mongoose = require('mongoose');
    const uri = process.env.MONGODB_URI;
    const options = {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    };
    if (uri.startsWith('mongodb://') && !uri.includes('mongodb+srv')) {
      options.directConnection = true;
    }
    await mongoose.connect(uri, options);
    console.log('SUCCESS: Connected to MongoDB');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err.message);
    if (err.reason) console.error('Reason:', err.reason);
    console.log('\nTry: npm run dev:memory  (uses in-memory DB, no Atlas needed)');
    process.exit(1);
  }
}

test();
