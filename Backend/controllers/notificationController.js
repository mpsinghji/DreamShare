import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Create a notification
export const createNotification = async (recipientId, fromId, type, postId = null, message) => {
  try {
    // Validate required fields
    if (!recipientId || !fromId || !type || !message) {
      console.error("Missing required fields for notification:", { recipientId, fromId, type, message });
      throw new Error("Missing required fields for notification");
    }

    // Validate notification type
    const validTypes = ["like", "comment", "follow"];
    if (!validTypes.includes(type)) {
      console.error("Invalid notification type:", type);
      throw new Error("Invalid notification type");
    }

    // Create the notification
    const notification = await Notification.create({
      recipient: recipientId,
      from: fromId,
      type,
      post: postId,
      message,
    });

    // Populate the notification with user details
    const populatedNotification = await Notification.findById(notification._id)
      .populate({
        path: "from",
        select: "username profilePicture",
      })
      .populate({
        path: "post",
        select: "image",
      });

    console.log("Notification created successfully:", populatedNotification);
    return populatedNotification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Get all notifications for a user
export const getNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .populate({
      path: "from",
      select: "username profilePicture",
    })
    .populate({
      path: "post",
      select: "image",
    });

  if (!notifications) {
    return next(new AppError("No notifications found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      notifications,
    },
  });
});

// Mark a notification as read
export const markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );

  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      notification,
    },
  });
});

// Mark all notifications as read
export const markAllAsRead = catchAsync(async (req, res, next) => {
  const result = await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  );

  if (result.modifiedCount === 0) {
    return next(new AppError("No notifications to mark as read", 404));
  }

  res.status(200).json({
    status: "success",
    message: "All notifications marked as read",
  });
});

// Delete a notification
export const deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Notification deleted successfully",
  });
}); 