import express from "express";
import {
  createPost,
  getPosts,
  getUserPosts,
  saveOrUnsavePost,
  deletePost,
  likeOrDislikePost,
  addComment,
} from "../controllers/postController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/create-post",
  isAuthenticated,
  upload.single("image"),
  createPost
);
router.get("/all", getPosts);
router.get("/user-posts/:id", getUserPosts);
router.post("/save-unsave-post/:postId", isAuthenticated, saveOrUnsavePost);
router.delete("/delete-post/:id", isAuthenticated, deletePost);
router.post("/like-dislike/:id", isAuthenticated, likeOrDislikePost);
router.post("/comment/:id", isAuthenticated, addComment);

export default router;
