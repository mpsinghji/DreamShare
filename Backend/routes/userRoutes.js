import express from "express";
import { signup, verifyAccount } from "../controllers/authController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify",isAuthenticated, verifyAccount);

export default router;
