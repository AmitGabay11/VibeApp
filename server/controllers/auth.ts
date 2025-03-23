import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ✅ Remove .js if using ts-node
import { OAuth2Client } from "google-auth-library";

// ✅ Google OAuth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER USER
export const register = async (req: Request, res: Response) => {
  try {
    console.log("🔹 Received Registration Request");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const pictureFileName = req.file ? req.file.filename : "default-profile.png";

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      picture: pictureFileName,
      picturePath: pictureFileName, // ✅ Only store filename
      friends: [],
      location: req.body.location,
      occupation: req.body.occupation,
      viewedProfile: Math.floor(Math.random() * 100),
      impressions: Math.floor(Math.random() * 100),
    });

    const savedUser = await newUser.save();
    console.log("✅ User Registered:", savedUser.email);
    res.status(201).json({ success: true, user: savedUser });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ error: "Failed to register user." });
  }
};

// LOGGING IN
export const login = async (req: Request, res: Response) => {
  try {
    console.log("🔹 Received Login Request");

    const { email, password } = req.body;
    console.log(`📩 Email: ${email}`);

    const user = await User.findOne({ email });

    if (!user) {
      console.error("❌ User not found");
      return res.status(400).json({ error: "Wrong credentials!" });
    }

    console.log("✅ User found:", user.email);

    // Validate password
    if (!user.password) {
      console.error("❌ User has no password stored");
      return res.status(400).json({ error: "Wrong credentials!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.error("❌ Invalid password");
      return res.status(400).json({ error: "Wrong credentials!" });
    }

    // Check TOKEN_SECRET
    const TOKEN_SECRET = process.env.JWT_SECRET;
    if (!TOKEN_SECRET) {
      throw new Error("❌ Missing TOKEN_SECRET in environment variables.");
    }

    // Create token
    const token = jwt.sign({ _id: user._id }, TOKEN_SECRET, { expiresIn: "7d" });

    console.log("✅ User Logged In:", user.email);
    res.status(200).json({ success: true, user, token });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// ✅ FIND OR CREATE USER (Google Login Helper)
export const findOrCreateUser = async (payload: any) => {
  console.log("🔹 Checking if user exists or needs to be created");

  const { email, name, picture } = payload;

  // Check if the user already exists in the database
  let user = await User.findOne({ email });

  if (!user) {
    console.log("🔹 User not found, creating a new user");

    // If the user doesn't exist, create a new user
    user = new User({
      email,
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[1] || "",
      picturePath: picture || "default-profile.png",
      friends: [],
      location: "",
      occupation: "",
      viewedProfile: Math.floor(Math.random() * 100),
      impressions: Math.floor(Math.random() * 100),
    });

    await user.save();
    console.log("✅ New User Created:", user.email);
  } else {
    console.log("✅ User already exists:", user.email);
  }

  return user;
};

// ✅ GOOGLE LOGIN
export const googleLogin = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    console.log("🔹 Verifying Google Token");

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure this matches your Google Client ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      console.error("❌ Invalid Google Token Payload");
      return res.status(400).json({ success: false, message: "Invalid Google Token" });
    }

    console.log("✅ Google Token Verified:", payload.email);

    // Handle user registration or login
    const user = await findOrCreateUser(payload);

    // Generate JWT token for the user
    const TOKEN_SECRET = process.env.JWT_SECRET;
    if (!TOKEN_SECRET) {
      throw new Error("❌ Missing TOKEN_SECRET in environment variables.");
    }

    const jwtToken = jwt.sign({ _id: user._id }, TOKEN_SECRET, { expiresIn: "7d" });

    console.log("✅ Google Login Successful:", user.email);
    res.status(200).json({ success: true, user, token: jwtToken });
  } catch (error) {
    console.error("❌ Google Login Error:", error);
    res.status(400).json({ success: false, message: "Google Login Failed" });
  }
};