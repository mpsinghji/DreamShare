import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// Get all notifications for the logged-in user
router.get("/", protect, getNotifications);

// Mark a notification as read
router.patch("/:id/read", protect, markAsRead);

// Mark all notifications as read
router.patch("/read-all", protect, markAllAsRead);

// Delete a notification
router.delete("/:id", protect, deleteNotification);

export default router; 