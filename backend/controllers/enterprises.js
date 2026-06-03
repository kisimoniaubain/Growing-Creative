const Enterprise = require("../models/Enterprise");
const Transaction = require("../models/Transaction");

exports.createEnterprise = async (req, res) => {
  try {
    const { ownerId, name, category, businessIdeaAbstract, startupAmount } = req.body;

    if (!ownerId || !name || !category || !businessIdeaAbstract) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const enterprise = await Enterprise.create({
      ownerId,
      name,
      category,
      businessIdeaAbstract,
      incubationPhase: "Training",
    });

    if (startupAmount && startupAmount > 0) {
      await Transaction.create({
        enterpriseId: enterprise._id,
        userId: ownerId,
        type: "Loan",
        amount: startupAmount,
        repaymentStatus: "Pending",
        notes: "Initial youth revolving fund disbursement",
      });
    }

    return res.status(201).json({ message: "Enterprise created.", enterprise });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create enterprise.", error: error.message });
  }
};

exports.getEnterprises = async (_req, res) => {
  try {
    const enterprises = await Enterprise.find()
      .populate("ownerId", "fullName email trainingTrack")
      .sort({ createdAt: -1 });

    return res.status(200).json(enterprises);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch enterprises.", error: error.message });
  }
};

exports.getFundStats = async (_req, res) => {
  try {
    const totalSeedCapital = 30000;

    const transactions = await Transaction.find();

    const totals = transactions.reduce(
      (acc, tx) => {
        if (tx.type === "Loan" || tx.type === "Grant") acc.disbursed += tx.amount;
        if (tx.type === "Repayment") acc.repaid += tx.amount;
        if (tx.type === "Admin Fee") acc.fees += tx.amount;
        return acc;
      },
      { disbursed: 0, repaid: 0, fees: 0 }
    );

    const availablePool = Math.max(totalSeedCapital - totals.disbursed + totals.repaid, 0);
    const utilization = Math.min(Math.round((totals.disbursed / totalSeedCapital) * 100), 100);
    const repaymentRate = totals.disbursed
      ? Math.min(Math.round((totals.repaid / totals.disbursed) * 100), 100)
      : 0;

    return res.status(200).json({
      totalSeedCapital,
      disbursed: totals.disbursed,
      repaid: totals.repaid,
      adminFees: totals.fees,
      availablePool,
      utilization,
      repaymentRate,
      loanRange: "$200 - $1,000",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch fund statistics.", error: error.message });
  }
};
