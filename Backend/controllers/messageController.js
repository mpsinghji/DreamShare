import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import catchAsync  from "../utils/catchAsync.js";
import  AppError from "../utils/appError.js";

export const getChats = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Get all messages where user is either sender or receiver
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .sort({ createdAt: -1 })
    .populate("sender receiver", "username name profilePicture");

  // Group messages by chat partner
  const chatMap = new Map();

  messages.forEach((message) => {
    const partnerId =
      message.sender._id.toString() === userId.toString()
        ? message.receiver._id
        : message.sender._id;

    if (!chatMap.has(partnerId.toString())) {
      chatMap.set(partnerId.toString(), {
        _id: partnerId.toString(),
        participants: [
          message.sender._id.toString() === userId.toString()
            ? message.receiver
            : message.sender,
        ],
        lastMessage: message,
        unreadCount: 0,
      });
    }

    // Count unread messages
    if (
      message.receiver._id.toString() === userId.toString() &&
      !message.read
    ) {
      const chat = chatMap.get(partnerId.toString());
      chat.unreadCount += 1;
    }
  });

  const chats = Array.from(chatMap.values());

  res.status(200).json({
    status: "success",
    data: {
      chats,
    },
  });
});

export const getMessages = catchAsync(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  // Verify that the user is part of this chat
  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: chatId },
      { sender: chatId, receiver: userId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender receiver", "username name profilePicture");

  // Mark messages as read
  await Message.updateMany(
    {
      sender: chatId,
      receiver: userId,
      read: false,
    },
    { read: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      messages,
    },
  });
});

export const sendMessage = catchAsync(async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user._id;

  if (!receiverId || !content) {
    throw new AppError("Please provide receiver ID and message content", 400);
  }

  // Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new AppError("Receiver not found", 404);
  }

  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content,
  });

  const populatedMessage = await Message.findById(message._id).populate(
    "sender receiver",
    "username name profilePicture"
  );

  res.status(201).json({
    status: "success",
    data: {
      message: populatedMessage,
    },
  });
});

export const startChat = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.user._id;

  if (!userId) {
    throw new AppError("Please provide user ID", 400);
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check if chat already exists
  const existingMessages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: userId },
      { sender: userId, receiver: currentUserId },
    ],
  }).sort({ createdAt: -1 });

  if (existingMessages.length > 0) {
    const chat = {
      _id: userId,
      participants: [user],
      lastMessage: existingMessages[0],
      unreadCount: existingMessages.filter(
        (m) => m.receiver.toString() === currentUserId && !m.read
      ).length,
    };

    return res.status(200).json({
      status: "success",
      data: {
        chat,
      },
    });
  }

  // Create new chat
  const chat = {
    _id: userId,
    participants: [user],
    lastMessage: null,
    unreadCount: 0,
  };

  res.status(200).json({
    status: "success",
    data: {
      chat,
    },
  });
}); 