const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    trainingTrack: {
      type: String,
      enum: ["Arts", "Fashion", "ICT", "Agriculture", "Renewable Energy"],
      required: true,
    },
    role: {
      type: String,
      enum: ["youth", "mentor", "admin", "donor"],
      default: "youth",
    },
    hubLocation: {
      type: String,
      default: "K2 Z2 B7",
    },
    status: {
      type: String,
      enum: ["Applied", "Trained", "Incubated", "Market Linked"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
