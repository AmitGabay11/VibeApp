import { Request, Response } from "express";
import User, { IUser } from "../models/User.js";
import Post, { IPost } from "../models/Post.js";

// Define a custom type for Authenticated Requests
interface AuthRequest extends Request {
    user?: IUser; // User is optional to prevent runtime errors
}

// CREATE: Create a New Post
export const createPost = async (req: AuthRequest, res: Response) => {
    try {
      const { userId, description } = req.body;
      const picturePath = req.file?.filename || ""; // ✅ Use filename from multer
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const newPost: IPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location || "",
        description,
        userPicturePath: user.picture || "",
        picturePath,
        likes: new Map(),
        comments: [],
      });
  
      await newPost.save();
      const posts = await Post.find();
      res.status(201).json(posts);
    } catch (err) {
      res.status(409).json({ message: "Failed to create post", error: err });
    }
  };
  

// READ: Get All Feed Posts
export const getFeedPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: "Failed to fetch posts", error: err });
    }
};

// READ: Get Posts for a Specific User
export const getUserPosts = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: "Failed to fetch user posts", error: err });
    }
};

// UPDATE: Like or Unlike a Post
export const likePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const isLiked = post.likes.get(userId);
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: "Failed to like/unlike post", error: err });
    }
};

// PATCH: Add a comment to a post
export const addComment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // postId from the route
      const { comment } = req.body;
  
      if (!comment || comment.trim() === "") {
        return res.status(400).json({ message: "Comment cannot be empty" });
      }
  
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      post.comments.push(comment); // Add the new comment
      const updatedPost = await post.save();
  
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json({ message: "Failed to add comment", error: err });
    }
  };
  
  // UPDATE: Edit a Post
export const editPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Post ID
    const { description } = req.body; // New description
    const picture = req.file?.filename; // New picture (if provided)

    const updateData: any = { description };
    if (picture) {
      updateData.picturePath = `/upload/${picture}`;
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to edit post", error: err });
  }
};

// DELETE: Delete a Post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Post ID

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post", error: err });
  }
};
