import catchAsync from "../utils/catchAsync.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import sharp from "sharp";
import uploadToCloudinary from "../utils/cloudinary.js";
import Comment from "../models/commentModel.js";

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
  const cloudResponse = await uploadToCloudinary(fileUri, "post");

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
  const userId = req.params.id;
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

export const deletePost = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(id).populate("user");
    if(!post){
        return next(new AppError("Post not found", 404));
    }

    if(post.user._id.toString() !== userId.toString()){
        return next(new AppError("You are not allowed to delete this post", 403));
    }
    
    //remove the post from the user's posts
    await User.updateMany({_id:userId},{$pull:{posts:id}});

    //remove the posts from users saved list
    await User.updateMany({savedPosts:id},{$pull:{savedPosts:id}});

    //removed the comments from the post
    await Comment.deleteMany({post:id});

    // remove image from cloudinary
    if(post.image.public_id){
        await cloudinary.uploader.destroy(post.image.public_id);
    }

    //remove the post
    await Post.findByIdAndDelete(id);

    return res.status(200).json({
        status: "success",
        message: "Post deleted successfully",
    });
});

export const likeOrDislikePost = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if(!post){
        return next(new AppError("Post not found", 404));
    }
    
    const isliked= post.likes.includes(userId);

    if(isliked){
        await Post.findByIdAndUpdate(id,{$pull:{likes:userId}},{new:true});
        return res.status(200).json({
            status: "success",
            message: "Post disliked",
        });
    }else{
        await Post.findByIdAndUpdate(id,{$addToSet:{likes:userId}},{new:true});
        return res.status(200).json({
            status: "success",
            message: "Post liked",
        });
    }
});

export const addComment = catchAsync(async (req, res, next) => {
    const { id : postId } = req.params;
    const userId = req.user.id;

    const { text } = req.body;

    const post = await Post.findById(postId);
    if(!post){
        return next(new AppError("Post not found", 404));
    }

    if(!text){
        return next(new AppError("Comment text is required", 400));
    }

    const comment = await Comment.create({
        text,
        user: userId,
        createdAt: new Date(),
    });
    
    post.comments.push(comment);
    await post.save({validateBeforeSave: false});

    await comment.populate({
        path: "user",
        select: "username profilePicture",
    });

    return res.status(201).json({
        status: "success",
        message: "Comment added successfully",
        data: {
            comment,
        },
    });
});
