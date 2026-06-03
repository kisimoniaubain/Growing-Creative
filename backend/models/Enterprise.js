const mongoose = require("mongoose");

const enterpriseSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Arts", "Fashion", "ICT", "Agriculture", "Renewable Energy", "Other"],
      required: true,
    },
    incubationPhase: {
      type: String,
      enum: ["Ideation", "Training", "Incubation", "Growth"],
      default: "Ideation",
    },
    marketLinkStatus: {
      type: String,
      enum: ["Pending", "Local Market", "Online Marketplace", "Export Ready"],
      default: "Pending",
    },
    businessIdeaAbstract: {
      type: String,
      required: true,
    },
    launchDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enterprise", enterpriseSchema);
