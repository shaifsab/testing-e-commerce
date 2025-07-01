const cloudinary = require("../helpers/cloudinary");
const generateRandomString = require("../helpers/randomStringGenerator");
const { sendMail } = require("../helpers/emailService");
const { verifyEmailTemplate, resetPassTemplate } = require("../helpers/templateHelper");
const { emailValidator } = require("../helpers/validationHelper");
const userSchema = require("../models/userSchema");
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Register a new user
const registerUser = async (req, res) => {
  const { fullName, email, password, avatar, address, phone, role } = req.body;

  try {
    // Validate required fields
    if (!fullName) return res.status(400).send({ error: "Full name is required!" });
    if (!email) return res.status(400).send({ error: "Email is required!" });
    if (!phone) return res.status(400).send({ error: "Phone number is required!" });
    if (!password) return res.status(400).send({ error: "Password is required!" });
    if (!emailValidator(email)) return res.status(400).send({ error: "Email is not valid!" });

    const existingUser = await userSchema.findOne({ email });
    if (existingUser) return res.status(400).send({ error: "Email already exists!" });

    // Generate random 4-digit OTP (between 1000–9999)
    const randomOtp = Math.floor(1000 + Math.random() * 9000);

    // Create new user
    const user = new userSchema({
      fullName,
      email,
      password,
      avatar,
      address,
      phone,
      role,
      otp: randomOtp,
      otpExpiredAt: new Date(Date.now() + 5 * 60 * 1000) // OTP valid for 5 minutes
    });
    await user.save();

    // Send OTP to user's email
    await sendMail(email, "Verify your email", verifyEmailTemplate, randomOtp);

    res.status(201).send({ success: "Registration successful! Please check your email to verify your account." });
  } catch (error) {
    res.status(500).send({ error: "Internal server error while registering user." });
  }
};

// Verify User Email
const verifyUserEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) return res.status(400).send({ error: "Email and OTP are required!" });

    const verifiedUser = await userSchema.findOne({
      email,
      otp,
      otpExpiredAt: { $gt: Date.now() }
    });

    if (!verifiedUser) return res.status(400).send({ error: "Invalid or expired OTP!" });

    verifiedUser.otp = null;
    verifiedUser.otpExpiredAt = null;
    verifiedUser.isVerified = true;
    await verifiedUser.save();

    res.status(200).send({ success: "Email has been successfully verified!" });
  } catch (error) {
    res.status(500).send({ error: "Internal server error during email verification." });
  }
};

// Authenticate user login
const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) return res.status(400).send({ error: "Email is required!" });
    if (!emailValidator(email)) return res.status(400).send({ error: "Email is not valid!" });
    if (!password) return res.status(400).send({ error: "Password is required!" });

    const existingUser = await userSchema.findOne({ email });
    if (!existingUser) return res.status(400).send({ error: "User not found!" });

    const passCheck = await existingUser.isPasswordValid(password);
    if (!passCheck) return res.status(400).send({ error: "Incorrect password!" });

    if (!existingUser.isVerified) return res.status(400).send({ error: "Please verify your email before logging in." });

    // Create JWT access token
    const accessToken = jwt.sign({
      data: {
        email: existingUser.email,
        id: existingUser._id,
        role: existingUser.role
      }
    }, process.env.JWT_SEC, { expiresIn: '24h' });

    const loggedUser = {
      email: existingUser.email,
      _id: existingUser._id,
      fullName: existingUser.fullName,
      avatar: existingUser.avatar,
      isVerified: existingUser.isVerified,
      phone: existingUser.phone,
      address: existingUser.address,
      role: existingUser.role,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt
    };

    res.status(200).send({ success: "Login successful!", user: loggedUser, accessToken });
  } catch (error) {
    res.status(500).send({ error: "Internal server error during authentication." });
  }
};

// Initiate password reset
const initiatePasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).send({ error: "Email is required!" });

    const existingUser = await userSchema.findOne({ email });
    if (!existingUser) return res.status(400).send({ error: "User not found!" });

    const randomString = generateRandomString(28);
    existingUser.resetPassId = randomString;
    existingUser.resetPassExpiredAt = new Date(Date.now() + 10 * 60 * 1000); // Link valid for 10 minutes
    await existingUser.save();

    await sendMail(email, "Reset your password", resetPassTemplate, randomString);
    res.status(201).send({ success: "Password reset link sent. Please check your email." });
  } catch (error) {
    res.status(500).send({ error: "Internal server error during password reset request." });
  }
};

// Reset user password
const resetUserPassword = async (req, res) => {
  try {
    const { newPass } = req.body;
    const randomString = req.params.randomstring;
    const email = req.query.email;

    const existingUser = await userSchema.findOne({
      email,
      resetPassId: randomString,
      resetPassExpiredAt: { $gt: Date.now() }
    });

    if (!existingUser) return res.status(400).send({ error: "Invalid or expired reset link." });
    if (!newPass) return res.status(400).send({ error: "New password is required!" });

    existingUser.password = newPass;
    existingUser.resetPassId = null;
    existingUser.resetPassExpiredAt = null;
    await existingUser.save();

    res.status(200).send({ success: "Password reset successful!" });
  } catch (error) {
    res.status(500).send({ error: "Internal server error while resetting password." });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { fullName, password } = req.body;

  try {
    const existingUser = await userSchema.findById(req.user.id);

    // Update full name or password if provided
    if (fullName) existingUser.fullName = fullName.trim().split(/\s+/).join(' ');
    if (password) existingUser.password = password;

    // Handle avatar upload
    if (req?.file?.path) {
      // Delete existing avatar if it exists
      if (existingUser.avatar) {
        await cloudinary.uploader.destroy(existingUser.avatar.split('/').pop().split('.')[0]);
      }

      // Upload new avatar
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "Avatar" });
      existingUser.avatar = result.url;
      fs.unlinkSync(req.file.path); // Delete local file after upload
    }

    await existingUser.save();
    res.status(200).send(existingUser);
  } catch (error) {
    res.status(500).send({ error: "Internal server error while updating profile." });
  }
};

module.exports = {
  registerUser,
  verifyUserEmail,
  authenticateUser,
  initiatePasswordReset,
  resetUserPassword,
  updateUserProfile
};
