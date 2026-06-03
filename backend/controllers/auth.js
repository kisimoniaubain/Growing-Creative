const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res) => {
  try {
    const { fullName, age, email, password, trainingTrack } = req.body;

    if (!fullName || !age || !email || !password || !trainingTrack) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (age < 18 || age > 30) {
      return res.status(400).json({ message: "Age must be between 18 and 30." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      age,
      email,
      password: hashedPassword,
      trainingTrack,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        age: user.age,
        email: user.email,
        trainingTrack: user.trainingTrack,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed.", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed.", error: error.message });
  }
};
