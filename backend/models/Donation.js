const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "received", "failed", "refunded"],
      default: "received",
    },
    issuedAt: {
      type: Date,
      default: Date.now,
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
    paymentGateway: {
      type: String,
      required: true,
      trim: true,
    },
    mobileProvider: {
      type: String,
      enum: ["mpesa", "airtel-money"],
      trim: true,
    },
    mobileChargeRequestId: {
      type: String,
      trim: true,
    },
    mobileTransactionCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    donor: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phoneNumber: {
        type: String,
        trim: true,
      },
    },
    allocation: {
      seedCapital: {
        type: Number,
        required: true,
        min: 0,
      },
      hardware: {
        type: Number,
        required: true,
        min: 0,
      },
      audits: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    auditTrail: {
      model: {
        type: String,
        required: true,
        trim: true,
      },
      encryption: {
        type: String,
        required: true,
        trim: true,
      },
      statement: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
