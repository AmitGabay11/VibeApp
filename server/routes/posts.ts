/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management endpoints
 */

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


/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get feed posts for logged-in user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 */

router.get("/", verifyToken, getFeedPosts);

/**
 * @swagger
 * /posts/{userId}/posts:
 *   get:
 *     summary: Get all posts by a specific user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of user's posts
 */

router.get("/:userId/posts", verifyToken, getUserPosts);

/**
 * @swagger
 * /posts/{id}/like:
 *   patch:
 *     summary: Like or unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 67e155785bc662647f6499c7
 *     responses:
 *       200:
 *         description: Post liked or unliked
 *       400:
 *         description: Missing userId or invalid post ID
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/like", verifyToken, likePost);


/**
 * @swagger
 * /posts/{id}/comment:
 *   patch:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added
 */
router.patch("/:id/comment", verifyToken, addComment);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Edit a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post updated
 */
router.put("/:id", verifyToken, upload.single("picture"), editPost); // ✅ Edit a Post

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted
 */
router.delete("/:id", verifyToken, deletePost); // ✅ Delete a Post

export default router;