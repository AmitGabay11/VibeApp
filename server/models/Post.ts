import mongoose, { Schema, Document, Model } from "mongoose";

// Define TypeScript interface for Post document
export interface IPost extends Document {
    userId: string;
    firstName: string;
    lastName: string;
    location?: string;
    description?: string;
    picturePath?: string;
    userPicturePath?: string;
    likes: Map<string, boolean>;
    comments: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Define Mongoose schema
const postSchema = new Schema<IPost>(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: { type: String, default: "" },
        description: { type: String, default: "" },
        picturePath: { type: String, default: "" },
        userPicturePath: { type: String, default: "" },
        likes: {
            type: Map,
            of: Boolean,
            default: new Map(),
        },
        comments: {
            type: [String], // ✅ Define comments as an array of strings
            default: [],
        },
    },
    { timestamps: true }
);

// Create and export the Post model
const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);
export default Post;
