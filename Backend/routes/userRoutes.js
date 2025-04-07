import express from "express";
import { signup, verifyAccount, resendOTP } from "../controllers/authController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify",isAuthenticated, verifyAccount);
router.post("/resend-otp",isAuthenticated, resendOTP);

export default router;
