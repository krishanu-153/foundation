import crypto from "crypto";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { generateToken, sendTokenCookie } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const emailVerificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    phone,
    emailVerificationToken: crypto
      .createHash("sha256")
      .update(emailVerificationToken)
      .digest("hex"),
    emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000,
  });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${emailVerificationToken}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your email - Sadhana Foundation",
    html: `<p>Hi ${user.name},</p><p>Please verify your email by clicking the link below:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
  });

  res.status(201).json({
    success: true,
    message:
      "Registration successful. Please check your email to verify your account.",
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isEmailVerified) {
    res.status(403);
    throw new Error(
      "Please verify your email address before logging in."
    );
  }

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVolunteer: user.isVolunteer,
      volunteerStatus: user.volunteerStatus,
    },
  });
});

//@desc Verify Email
//@route GET/api//verify-email/:token
//@access public
export const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired verification link.",
    });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Email verified successfully.",
  });
});
// @desc    Forgot password - send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error("No account found with this email");
  }

  if (!user.isEmailVerified) {
    res.status(400);
    throw new Error(
      "Please verify your email before resetting your password."
    );
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Password Reset - Sadhana Foundation",
    html: `<p>You requested a password reset. Click below to set a new password (valid for 1 hour):</p><a href="${resetUrl}">${resetUrl}</a>`,
  });

  res.json({ success: true, message: "Password reset link sent to your email" });
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful. Please log in." });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
});
