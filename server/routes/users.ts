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
  
  // ✅ PUT route for editing user
  //router.put("/:userId", verifyToken, upload.single("picture"), updateUser);

//READ
router.get('/:id', verifyToken, getUser);
router.get('/friends/:userId', verifyToken, getUserFriends);

//UPDATE
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);

router.put("/:id", verifyToken, upload.single("picture"), updateUser);



export default router;
