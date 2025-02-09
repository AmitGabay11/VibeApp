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
        });

        // Save user and respond
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
};

// LOGGING IN
export const login = async (req: Request, res: Response) => {
    try {
        // Find user
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json("Wrong credentials!");

        // Validate password
        if (!user.password) return res.status(400).json("Wrong credentials!");
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json("Wrong credentials!");

        // Check TOKEN_SECRET
        const TOKEN_SECRET = process.env.TOKEN_SECRET;
        if (!TOKEN_SECRET) {
            throw new Error("❌ Missing TOKEN_SECRET in environment variables.");
        }

        // Create token
        const token = jwt.sign({ _id: user._id }, TOKEN_SECRET);

        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json(err);
    }
};