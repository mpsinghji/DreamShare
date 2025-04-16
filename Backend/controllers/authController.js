import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import generateOTP from "../utils/generateOTP.js";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import sendEmail from "../utils/email.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({ path: "./config/config.env" });

const __dirname = path.resolve();

const loadTemplate = (templateName, replacements) => {
  const templatePath = path.join(
    __dirname,
    "../Backend/emailTemplate",
    templateName
  );
  const source = fs.readFileSync(templatePath, "utf-8");
  const template = handlebars.compile(source);
  return template(replacements);
};

export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  user.otp = undefined;
  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, username, email, password, passwordConfirm } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }
  const otp = generateOTP();
  const otpExpires = Date.now() + 10 * 60 * 1000;
  const newUser = await User.create({
    name,
    username,
    email,
    password,
    passwordConfirm,
    otp,
    otpExpires,
  });

  const htmlTemplate = loadTemplate("OtpTemplate.html", {
    title: "OTP Verification",
    username: newUser.username,
    otp: otp,
    message: "Please verify your email by entering the OTP below.",
  });
  try {
    await sendEmail({
      email: newUser.email,
      subject: "OTP for Email Verification",
      html: htmlTemplate,
    });
    createSendToken(newUser, 201, res, "User created successfully");
  } catch (error) {
    console.error("Email sending error:", error);
    await User.findByIdAndDelete(newUser._id);
    return next(
      new AppError(
        `There is an error creating the account: ${error.message}. Please try again later`,
        500
      )
    );
  }
});

export const verifyAccount = catchAsync(async (req, res, next) => {
  const { otp } = req.body;
  if (!otp) {
    return next(new AppError("Please enter the OTP", 400));
  }
  const user = req.user;

  if (user.otp !== otp) {
    return next(new AppError("Invalid OTP", 400));
  }

  if (Date.now() > user.otpExpires) {
    return next(new AppError("OTP expired", 400));
  }
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });
  createSendToken(user, 200, res, "Account verified successfully");
});

export const resendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is Required", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 400));
  }
  if (user.isVerified) {
    return next(new AppError("User already verified", 400));
  }
  const otp = generateOTP();
  const otpExpires = Date.now() + 24 * 60 * 60 * 1000;
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save({ validateBeforeSave: false });
  const htmlTemplate = loadTemplate("OtpTemplate.html", {
    title: "OTP Verification",
    username: user.username,
    otp: otp,
    message: "Please verify your email by entering the OTP below.",
  });
  try {
    await sendEmail({
      email: user.email,
      subject: "OTP for Email Verification",
      html: htmlTemplate,
    });
    res.status(200).json({
      status: "success",
      message: "A new OTP has been sent to your email",
    });
  } catch (error) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There is an error sending the Email.Please try again later",
        500
      )
    );
  }
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }
  createSendToken(user, 200, res, "Logged in successfully");
});

export const logout = catchAsync(async (req, res, next) => {
  res.cookie("token", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please provide email", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const otp = generateOTP();
  const resetExpires = Date.now() + 300000;

  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpires = resetExpires;

  await user.save({ validateBeforeSave: false });

  const htmlTemplate = loadTemplate("OtpTemplate.html", {
    title: "Password Reset OTP",
    username: user.username,
    otp: otp,
    message: "Please reset your password by entering the OTP below.",
  });
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset OTP (Valid for 5 minutes)",
      html: htmlTemplate,
    });
    res.status(200).json({
      status: "success",
      message: "A Password Reset OTP has been sent to your email",
    });
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There is an error sending the Email.Please try again later",
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, password, passwordConfirm } = req.body;
  const user = await User.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordOTPExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("No user found", 400));
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpires = undefined;

  await user.save();
  createSendToken(user, 200, res, "Password reset successfully");
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;
  const { email } = req.user;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Incorrect current password", 401));
  }
  if (newPassword !== newPasswordConfirm) {
    return next(
      new AppError("New password and confirm password do not match", 400)
    );
  }
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();
  createSendToken(user, 200, res, "Password updated successfully");
});
