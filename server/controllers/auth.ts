import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // ✅ Remove .js if using ts-node

// REGISTER USER
export const register = async (req: Request, res: Response) => {
    try {
        // Generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            picture: req.file ? req.file.path : '',
            friends: [],
            location: req.body.location,
            occupation: req.body.occupation,
            viewedProfile: Math.floor(Math.random() * 100),
            impressions: Math.floor(Math.random() * 100),
            picturePath: req.file ? req.file.path : "default-profile.png",
        });

        // Save user and respond
        const savedUser = await newUser.save();
        res.status(201).json({ success: true, user: savedUser });
    } catch (err) {
        res.status(500).json(err);
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
  