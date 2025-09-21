const mongoose = require('mongoose');
require('dotenv').config();



const mongoURI = process.env.MONGO_DB_KEY;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

module.exports = connectDB;
