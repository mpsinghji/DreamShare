import express from "express";
import {
  getChats,
  getMessages,
  sendMessage,
  startChat,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all chats
router.get("/chats", getChats);

// Get messages for a specific chat
router.get("/:chatId", getMessages);

// Send a message
router.post("/send", sendMessage);

// Start a new chat
router.post("/start-chat", startChat);

export default router; 