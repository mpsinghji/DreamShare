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
import { editProfile, followUnfollow, getMe, getProfile, searchUsers, suggestedUsers } from "../controllers/userController.js";
import upload from "../middleware/multer.js";
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
router.get("/profile/id/:id", isAuthenticated, getProfile);
router.get("/profile/username/:username", isAuthenticated, getProfile);
router.patch("/profile", isAuthenticated, upload.single("profilePicture"), editProfile);
router.get("/suggested-users", isAuthenticated, suggestedUsers);
router.post("/follow-unfollow/:id", isAuthenticated, followUnfollow);
router.get("/me", isAuthenticated, getMe);
router.get("/search", searchUsers);


export default router;
