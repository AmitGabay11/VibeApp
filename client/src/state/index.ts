// src/state/index.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// =====================
// 🔹 Types
// =====================

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  friends: User[];
  picturePath?: string;
  location?: string;
  occupation?: string;
}

export interface Post {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  location: string;
  picturePath: string;
  userPicturePath: string;
  likes: { [userId: string]: boolean };
  comments: string[];
}

interface AppState {
  mode: "light" | "dark";
  user: User | null;
  token: string | null;
  posts: Post[];
}

// =====================
// 🔹 Initial State
// =====================

const initialState: AppState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

// =====================
// 🔹 Redux Slice
// =====================

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action: PayloadAction<User[]>) => {
      if (state.user) {
        state.user.friends = action.payload;
      }
    },
    setPosts: (state, action: PayloadAction<{ posts: Post[] }>) => {
      state.posts = Array.isArray(action.payload.posts) ? action.payload.posts : [];
    },
    setPost: (state, action: PayloadAction<{ post: Post }>) => {
      const updatedPosts = state.posts.map((p) =>
        p._id === action.payload.post._id ? action.payload.post : p
      );
      state.posts = updatedPosts;
    },
    deletePost: (state, action: PayloadAction<{ postId: string }>) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload.postId);
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  deletePost,
} = authSlice.actions;

export default authSlice.reducer;
