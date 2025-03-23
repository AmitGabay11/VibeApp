import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER USER
export const register = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const pictureFileName = req.file ? req.file.filename : "default-profile.png";

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      picture: pictureFileName,
      picturePath: pictureFileName,
      friends: [],
      location: req.body.location,
      occupation: req.body.occupation,
      viewedProfile: Math.floor(Math.random() * 100),
      impressions: Math.floor(Math.random() * 100),
    });

    const savedUser = await newUser.save();
    res.status(201).json({ success: true, user: savedUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user." });
  }
};

// LOGGING IN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(400).json({ error: "Wrong credentials!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Wrong credentials!" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// FIND OR CREATE USER (Google Login Helper)
export const findOrCreateUser = async (payload: any) => {
  const { email, name, picture } = payload;

  let user = await User.findOne({ email });
  if (!user) {
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
  }
  return user;
};

// GOOGLE LOGIN
export const googleLogin = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ success: false, message: "Invalid Google Token" });
    }

    const user = await findOrCreateUser(payload);
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }
    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ success: true, user, token: jwtToken });
  } catch (error) {
    res.status(400).json({ success: false, message: "Google Login Failed" });
  }
};