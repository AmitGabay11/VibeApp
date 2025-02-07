import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';  
import userRoutes from './routes/users.js'; 
import morgan from 'morgan';
import { register } from './controllers/auth.js';  
import postRoutes from './routes/posts.js'; 
import { createPost } from './controllers/posts.js';  
import { verifyToken } from './middleware/auth.js';


// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('common'));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// FILE STORAGE
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// ROUTES WITH FILES
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts' , verifyToken, upload.single('picture'), createPost); 

// ROUTES
app.use('/auth', authRoutes); 
app.use('/users', userRoutes);  
app.use('/posts', postRoutes);  

// MONGOOSE SETUP
const PORT = process.env.PORT || 5000;
const MONGO_URL: string = process.env.MONGO_URL as string;  // ✅ Fixed

app.get("/", (req, res) => {
    res.send("<h1>Welcome to the Vibe App Server! 🚀</h1>");
});

mongoose.connect(MONGO_URL).then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Connected to MongoDB & Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
});
