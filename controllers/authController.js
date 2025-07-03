const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res) => {
  const { email, password, username } = req.body;
  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: "Email already exists" });

  const user = await User.create({ email, password, username });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.status(201).json({ token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};

exports.getAllUser = async (req, res) => {
  try {
    console.log("Fetching all users except the current user",req);
    
    const users = await User.find({ _id: { $ne: req.userId } });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = Math.random().toString(36).substring(2, 12);
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  // Simulated email sending
  await sendEmail(user.email, `Your reset token is: ${token}`);
  res.json({ message: "Reset token sent to email" });
};

exports.varifyOtp = async (req, res) => {
  const { email, token } = req.body;
  const user = await User.findOne({
    email,
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  res.json({ success: true, message: "OTP verified" });
};

exports.resetPassword = async (req, res) => {
  
  const { email, token, newPassword } = req.body;
  const user = await User.findOne({
    email,
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });
  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};
