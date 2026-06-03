const Application = require("../models/Application");

exports.submitApplication = async (req, res) => {
  try {
    const { name, age, email, trainingTrack, businessIdeaAbstract } = req.body;

    if (!name || !age || !email || !trainingTrack || !businessIdeaAbstract) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (age < 18 || age > 30) {
      return res.status(400).json({ message: "Age must be between 18 and 30." });
    }

    const application = await Application.create({
      name,
      age,
      email,
      trainingTrack,
      businessIdeaAbstract,
    });

    return res.status(201).json({
      message: "Application received successfully.",
      applicationId: application._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit application.", error: error.message });
  }
};

exports.getApplications = async (_req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch applications.", error: error.message });
  }
};
