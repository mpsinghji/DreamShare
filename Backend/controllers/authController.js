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
  const { username, email, password, passwordConfirm } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }
  const otp = generateOTP();
  const otpExpires = Date.now() + 10 * 60 * 1000;
  const newUser = await User.create({
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
