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
import { v4 as uuidv4 } from 'uuid';

import authRoutes from './routes/auth.js';  
import userRoutes from './routes/users.js'; 
import postRoutes from './routes/posts.js'; 
import imageRoutes from './routes/images.js';
import uploadRoutes from './routes/upload.js';
import geminiRoutes from './routes/gemini.js';

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
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// ✅ Serve static assets from public/assets
app.use("/upload", express.static(path.join(__dirname, "../public/assets")));

// ✅ Multer storage configuration with UUID filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpeg";
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ROUTES WITH FILE UPLOADS
app.post("/auth/register", upload.single("picture"), register);

interface AuthRequest extends express.Request {
  user?: any; // Replace 'any' with the actual type of 'user' if known
}

const handler = (fn: (req: AuthRequest, res: Response) => any) => 
  (req: Request, res: Response) => fn(req as unknown as AuthRequest, res);


app.post("/posts", verifyToken, upload.single("picture"), (req, res) => {
  req.body.picturePath = req.file?.filename || "";
  return createPost(req as unknown as AuthRequest, res);
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/images", imageRoutes);
app.use("/upload", uploadRoutes); // Optional upload route
app.use("/api/gemini", geminiRoutes);

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
