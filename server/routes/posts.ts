import express from "express";
import { getUserPosts, getFeedPosts, likePost, addComment, editPost, deletePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// READ
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

// UPDATE
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, addComment);
router.put("/:id", verifyToken, upload.single("picture"), editPost); // ✅ Edit a Post
router.delete("/:id", verifyToken, deletePost); // ✅ Delete a Post

export default router;