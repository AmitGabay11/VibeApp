/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and registration
 */


import express from "express";
import { register, login, googleLogin } from "../controllers/auth.js";
import { googleProfile } from "../controllers/auth.js";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - location
 *               - occupation
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               location:
 *                 type: string
 *                 example: New York, USA
 *               occupation:
 *                 type: string
 *                 example: Software Engineer
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 */


router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/google-login:
 *   post:
 *     summary: Log in using Google OAuth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in via Google
 */
router.post("/google-login", googleLogin);


/**
 * @swagger
 * /auth/google-register:
 *   post:
 *     summary: Register using Google OAuth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registered via Google
 */
router.post("/google-register", googleLogin); // Reuse the same controller for registration

/**
 * @swagger
 * /auth/google-profile:
 *   post:
 *     summary: Get Google profile info from token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google profile returned
 */
router.post("/google-profile", googleProfile);


export default router;