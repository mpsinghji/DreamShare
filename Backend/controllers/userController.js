import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import getDataUri from "../utils/dataUri.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import fs from "fs";
import { createNotification } from "./notificationController.js";

export const getProfile = catchAsync(async (req, res, next) => {
  const { id, username } = req.params;

  // Create a query object that will search by either ID or username
  const query = id ? { _id: id } : { username };

  const user = await User.findOne(query)
    .select("username name email profilePicture bio followers following posts")
    .populate({
      path: "posts",
      select: "content image likes comments createdAt",
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: "followers",
      select: "username name profilePicture",
    })
    .populate({
      path: "following",
      select: "username name profilePicture",
    });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const editProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { bio } = req.body;
  const ProfilePicture = req.file;

  // Trim bio to 150 characters if it exists
  const trimmedBio = bio ? bio.substring(0, 150) : undefined;

  let cloudResponse;
  if (ProfilePicture) {
    try {
      // Convert buffer to base64
      const fileUri = getDataUri(ProfilePicture);
      
      // Upload to Cloudinary with specific folder
      cloudResponse = await uploadToCloudinary(fileUri.content, "profile");
    } catch (uploadError) {
      console.error("Profile picture upload error:", uploadError);
      return next(new AppError("Failed to upload profile picture", 500));
    }
  }

  const user = await User.findById(userId).select("-password -passwordConfirm");
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (trimmedBio !== undefined) user.bio = trimmedBio;
  if (ProfilePicture) user.profilePicture = cloudResponse?.secure_url;
  
  // Save without validation for passwordConfirm
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "Profile updated successfully",
    status: "success",
    data: user,
  });
});

export const suggestedUsers = catchAsync(async (req, res, next) => {
  const loginUserId = req.user.id;

  // Get the current logged-in user's following list
  const loginUser = await User.findById(loginUserId).select("following");

  // Get all users except the current user
  const users = await User.find({ _id: { $ne: loginUserId } }).select(
    "-password -otp -otpExpires -resetPasswordOtp -resetPasswordOTPExpires -passwordConfirm"
  );

  // Add isFollowing flag to each user
  const usersWithFollowStatus = users.map((user) => {
    const isFollowing = loginUser.following.includes(user._id);
    return {
      ...user.toObject(),
      isFollowing,
    };
  });

  res.status(200).json({
    status: "success",
    data: usersWithFollowStatus,
  });
});

export const followUnfollow = catchAsync(async (req, res, next) => {
    const loginUserId = req.user.id;
    const targetUserId = req.params.id;
    if(loginUserId.toString() === targetUserId){
        return next(new AppError("You cannot follow or unfollow yourself", 400));
    }

    const targetUser = await User.findById(targetUserId);
    const loginUser = await User.findById(loginUserId).select("username");

    if(!targetUser){
        return next(new AppError("User not found", 404));
    }

    const isFollowing = targetUser.followers.includes(loginUserId); 

    if(isFollowing){
        await Promise.all([
            User.updateOne({_id: loginUserId}, {$pull: {following: targetUserId}}),
            User.updateOne({_id: targetUserId}, {$pull: {followers: loginUserId}})
        ]);
    }else{
        await Promise.all([
            User.updateOne({_id: loginUserId}, {$addToSet: {following: targetUserId}}),
            User.updateOne({_id: targetUserId}, {$addToSet: {followers: loginUserId}})
        ]);
        
        // Create notification for follow with error handling
        try {
            const notification = await createNotification(
                targetUserId,
                loginUserId,
                "follow",
                null,
                `${loginUser.username} started following you`
            );
            console.log("Follow notification created:", notification);
        } catch (error) {
            console.error("Error creating follow notification:", error);
            // Don't throw error here to prevent breaking the follow functionality
        }
    }

    const updatedLoggedInUser = await User.findById(loginUserId).select("-password");
    res.status(200).json({
        status: "success",
        message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
        data:{
            user: updatedLoggedInUser
        }
    });
});

export const getMe = catchAsync(async (req, res, next) => {
    const user = req.user;
    if(!user){
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        status: "success",
        message: "Authenticated user",
        data: {
            user
        }
    });
});

export const searchUsers = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("name username email profilePicture"); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ message: "Server error during user search" });
  }
};