import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    updateUser,
} from '../controllers/users.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
// Storage setup (for profile picture)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });
  
  const upload = multer({ storage });
  
 

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data returned
 */
router.get('/:id', verifyToken, getUser);

/**
 * @swagger
 * /users/friends/{userId}:
 *   get:
 *     summary: Get a user's friends list
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's friends
 */
router.get('/friends/:userId', verifyToken, getUserFriends);

/**
 * @swagger
 * /users/{id}/{friendId}:
 *   patch:
 *     summary: Add or remove a friend
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: string
 *         description: Friend ID
 *     responses:
 *       200:
 *         description: Friendship status updated
 */
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               occupation:
 *                 type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated
 */
router.put("/:id", verifyToken, upload.single("picture"), updateUser);



export default router;
