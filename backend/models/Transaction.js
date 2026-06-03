const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    enterpriseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enterprise",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Grant", "Loan", "Repayment", "Admin Fee"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: "USD",
    },
    repaymentStatus: {
      type: String,
      enum: ["Not Applicable", "Pending", "In Progress", "Completed", "Defaulted"],
      default: "Not Applicable",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
