const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { enterpriseId, userId, type, amount, notes } = req.body;

    if (!enterpriseId || !userId || !type || !amount) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const repaymentStatus = type === "Loan" ? "Pending" : "Not Applicable";

    const transaction = await Transaction.create({
      enterpriseId,
      userId,
      type,
      amount,
      notes,
      repaymentStatus,
    });

    return res.status(201).json({ message: "Transaction recorded.", transaction });
  } catch (error) {
    return res.status(500).json({ message: "Failed to record transaction.", error: error.message });
  }
};

exports.getTransactions = async (_req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("enterpriseId", "name category")
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch transactions.", error: error.message });
  }
};
