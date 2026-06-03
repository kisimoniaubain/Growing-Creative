const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    name: {
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
      lowercase: true,
      trim: true,
    },
    trainingTrack: {
      type: String,
      enum: ["Arts", "Fashion", "ICT", "Agriculture", "Renewable Energy"],
      required: true,
    },
    businessIdeaAbstract: {
      type: String,
      required: true,
      minlength: 30,
    },
    source: {
      type: String,
      default: "Website Hub Form",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
