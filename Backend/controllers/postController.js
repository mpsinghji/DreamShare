import catchAsync from "../utils/catchAsync.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import sharp from "sharp";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const createPost = catchAsync(async (req, res, next) => {
  const { caption } = req.body;
  const image = req.file;
  const userId = req.user.id;

  if (!image) {
    return next(new AppError("Image is required", 400));
  }

  const optimizedImageBuffer = await sharp(image.buffer)
    .resize({
      width: 800,
      height: 800,
      fit: "inside",
    })
    .toFormat("jpeg", { quality: 80 })
    .toBuffer();

  const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
    "base64"
  )}`;
  const cloudResponse = await uploadToCloudinary(fileUri);

  let post = await Post.create({
    caption,
    image: {
      url: cloudResponse.secure_url,
      public_id: cloudResponse.public_id,
    },
    user: userId,
  });

  const user = await User.findById(userId);
  if (user) {
    user.posts.push(post._id);
    await user.save({ validateBeforeSave: false });
  }

  post = await post.populate({
    path: "user",
    select: "username profilePicture email bio",
  });

  return res.status(201).json({
    status: "success",
    message: "Post created successfully",
    data: post,
  });
});

export const getPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .populate({
      path: "user",
      select: "username profilePicture bio",
    })
    .populate({
      path: "comments",
      select: "text user",
      populate: {
        path: "user",
        select: "username profilePicture",
      },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

export const getUserPosts = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const posts = await Post.find({ user: userId })
    .populate({
      path: "comments",
      select: "text user",
      populate: {
        path: "user",
        select: "username profilePicture",
      },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

export const saveOrUnsavePost = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isPostSave = user.savedPosts.includes(postId);

  if (isPostSave) {
    user.savedPosts.pull(postId);
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      status: "success",
      message: "Post unsaved",
      data: {
        user,
      },
    });
  } else {
    user.savedPosts.push(postId);
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      status: "success",
      message: "Post saved",
      data: {
        user,
      },
    });
  }
});
