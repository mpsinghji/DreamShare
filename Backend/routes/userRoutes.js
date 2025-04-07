import express from "express";
import {
  signup,
  verifyAccount,
  resendOTP,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getProfile } from "../controllers/userController.js";

const router = express.Router();


// Auth Routes
router.post("/signup", signup);
router.post("/verify", isAuthenticated, verifyAccount);
router.post("/resend-otp", isAuthenticated, resendOTP);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", isAuthenticated, changePassword);

// User Routes
router.get("/profile/:id", getProfile);

export default router;
