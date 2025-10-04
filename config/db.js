const mongoose = require('mongoose');


const mongoURI = 'mongodb://localhost:27017/campusDB'; 

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
