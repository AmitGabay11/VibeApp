import mongoose, { Document, Schema, Model } from 'mongoose';

// Define TypeScript interface for User document
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    picture?: string;
    location?: string;
    occupation?: string;
    viewedProfile?: number;  
    impressions?: number;
    createdAt?: Date;
    updatedAt?: Date;
    friends: mongoose.Types.ObjectId[];
    _v: number;
}

// Define Mongoose schema
const userSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50,
        },
        lastName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            maxlength: 255,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 1024,
        },
        picture: {
            type: String,
            default: '',
        },
        location: { type: String, default: '' },
        occupation: { type: String, default: '' },
        viewedProfile: { type: Number, default: 0 },  // Fixed typo
        impressions: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
