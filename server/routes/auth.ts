import express from "express";
import { register, login, googleLogin } from "../controllers/auth.js";

const router = express.Router();

// Regular registration and login
router.post("/register", register);
router.post("/login", login);

// Google login
router.post("/google-login", googleLogin);

export default router;