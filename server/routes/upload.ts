import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";

const router = express.Router();

// ✅ Store images in the `public/uploads/` folder
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },

});

const upload = multer({ storage });

// ✅ API to upload profile picture
router.post("/:userId", upload.single("picture"), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { picturePath: req.file.filename }, // ✅ Store filename in DB
      { new: true }
    );

    res.status(200).json({ message: "Profile picture updated", picturePath: user?.picturePath });
  } catch (err) {
    res.status(500).json({ message: "Error uploading image" });
  }
});

// ✅ API to serve images from `public/uploads/`
router.get("/:filename", (req, res) => {
  res.sendFile(path.resolve(`./public/uploads/${req.params.filename}`));
});


export default router;
