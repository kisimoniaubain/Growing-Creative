const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.warn("Continuing without database connection. API will stay up; DB-backed features may be unavailable.");
  }
};

module.exports = connectDB;
