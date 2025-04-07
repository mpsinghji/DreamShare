import express from "express";
import { createPost, getPosts } from "../controllers/postController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/create-post", isAuthenticated, upload.single("image"), createPost);
router.get("/all", getPosts);

export default router;
