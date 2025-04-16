import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import getDataUri from "../utils/dataUri.js";
import uploadToCloudinary from "../utils/cloudinary.js";

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
    const fileUri = getDataUri(ProfilePicture);
    cloudResponse = await uploadToCloudinary(fileUri.content);
  }

  const user = await User.findById(userId).select("-password -passwordConfirm");
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (trimmedBio !== undefined) user.bio = trimmedBio;
  if (ProfilePicture) user.profilePicture = cloudResponse?.url;
  
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
  const users = await User.find({
    _id: { $ne: loginUserId },
  }).select(
    "-password -otp -otpExpires -resetPasswordOtp -resetPasswordOTPExpires -passwordConfirm"
  );

  res.status(200).json({
    status: "success",
    data: users,
  });
});

export const followUnfollow = catchAsync(async (req, res, next) => {
    const loginUserId = req.user.id;
    const targetUserId = req.params.id;
    if(loginUserId.toString() === targetUserId){
        return next(new AppError("You cannot follow or unfollow yourself", 400));
    }

    const targetUser = await User.findById(targetUserId);

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
