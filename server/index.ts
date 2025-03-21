import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';  
import userRoutes from './routes/users.js'; 
import postRoutes from './routes/posts.js'; 
import imageRoutes from './routes/images.js';
import uploadRoutes from './routes/upload.js';

import { register } from './controllers/auth.js';  
import { createPost } from './controllers/posts.js';  
import { verifyToken } from './middleware/auth.js';

// CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('common'));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// ✅ Serve static assets from public/assets
app.use("/upload", express.static(path.join(__dirname, "../public/assets")));

// ✅ Multer storage configuration with unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// ROUTES WITH FILE UPLOADS
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), async (req, res) => {
  // ✅ Use file.filename as the actual saved picturePath
  req.body.picturePath = req.file?.filename || "";
  return createPost(req, res);
});

// API ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/images", imageRoutes);
app.use("/upload", uploadRoutes); // optional if using a /upload router

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Vibe App Server! 🚀</h1>");
});

// DATABASE CONNECTION
const PORT = process.env.PORT || 5000;
const MONGO_URL: string = process.env.MONGO_URL as string;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 MongoDB connected & Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });
