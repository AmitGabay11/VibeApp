import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../models/User.js"; 

// Define request type
interface AuthRequest extends Request {
    params: Record<string, string>; // ✅ Allows `id`, `userId`, `friendId`
}

// READ: Get User by ID
export const getUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// READ: Get User's Friends
export const getUserFriends = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const friends = await Promise.all(user.friends.map((id) => User.findById(id)));

        // Format response
        const formattedFriends = friends
            .filter((friend): friend is mongoose.Document<unknown, {}, IUser> & IUser & { __v: number } => friend !== null)
            .map((friend) => {
                if (friend) {
                    const { _id, firstName, lastName, occupation, location, picture } = friend;
                    return { _id, firstName, lastName, occupation, location, picture };
                }
                return null;
            }).filter((friend) => friend !== null);

        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// UPDATE: Add or Remove Friend
export const addRemoveFriend = async (req: AuthRequest, res: Response) => {
    try {
        const { id, friendId } = req.params;
        if (id === friendId) return res.status(400).json({ message: "You can't be friends with yourself" });

        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        if (!user || !friend) return res.status(404).json({ message: "User not found" });

        if (user.friends.some((fid) => fid.toString() === friendId)) {
            // Remove friend
            user.friends = user.friends.filter((fid) => fid.toString() !== friendId);
            friend.friends = friend.friends.filter((fid) => fid.toString() !== id);
        } else {
            // Add friend
            user.friends.push(new mongoose.Types.ObjectId(friendId));
            friend.friends.push(new mongoose.Types.ObjectId(id));
        }

        await user.save();
        await friend.save();

        // Get updated friends list
        const friends = await Promise.all(user.friends.map((fid) => User.findById(fid)));

        // Format response
        const formattedFriends = friends
            .filter((friend): friend is mongoose.Document<unknown, {}, IUser> & IUser & { __v: number } => friend !== null)
            .map((friend) => {
                if (friend) {
                    const { _id, firstName, lastName, occupation, location, picture } = friend;
                    return { _id, firstName, lastName, occupation, location, picture };
                }
                return null;
            }).filter((friend) => friend !== null);

        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
