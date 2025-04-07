import express from "express";
import { signup } from "../controllers/authController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/signup", signup);

export default router;
