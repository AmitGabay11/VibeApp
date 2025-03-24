import express from "express";
import { register, login, googleLogin } from "../controllers/auth.js";
import { googleProfile } from "../controllers/auth.js";

const router = express.Router();

// Regular registration and login
router.post("/register", register);
router.post("/login", login);

// Google login
router.post("/google-login", googleLogin);

//Google register
router.post("/google-register", googleLogin); // Reuse the same controller for registration
router.post("/google-profile", googleProfile);


export default router;