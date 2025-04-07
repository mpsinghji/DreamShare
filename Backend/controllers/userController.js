import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";

export const getProfile = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id)
    .select(
      "-password -otp -otpExpires -resetPasswordOtp -resetPasswordOTPExpires -passwordConfirm"
    )
    .populate({
      path: "post",
      options: {
        sort: { createdAt: -1 },
      },
    })
    .populate({
      path: "savedPost",
      options: {
        sort: { createdAt: -1 },
      },
    });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const editProfile = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { bio } = req.body;
  const ProfilePicture = req.file;

  let cloudResponse;
  if (ProfilePicture) {
    const fileUri = getDataUri(ProfilePicture);
    cloudResponse = await uploadToCloudinary(fileUri);
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (bio) user.bio = bio;
  if (ProfilePicture) user.profilePicture = cloudResponse?.url;
  await user.save();

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
