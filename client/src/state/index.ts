import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";

// 🔹 Import `authReducer` correctly
import authReducer from "./index"; 

// 🔹 Define User Type
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  friends: User[];
}

// 🔹 Define Post Type
interface Post {
  _id: string;
  content: string;
  author: string;
}

// 🔹 Define State Type
interface AppState {
  mode: "light" | "dark";
  user: User | null;
  token: string | null;
  posts: Post[];
}

// 🔹 Define Initial State
const initialState: AppState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

// 🔹 Create Redux Slice
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

    setFriends: (state, action: PayloadAction<{ friends: User[] }>) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("User friends non-existent");
      }
    },

    setPosts: (state, action: PayloadAction<{ posts: Post[] }>) => {
      state.posts = action.payload.posts;
    },

    setPost: (state, action: PayloadAction<{ post_id: string; post: Post }>) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload.post_id ? action.payload.post : post
      );
    },
  },
});

// 🔹 Export Actions
export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;

// 🔹 Export Reducer
export default authSlice.reducer;

// 🔹 Correct Redux Store Configuration
export const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ "auth" namespace added
  },
});

// 🔹 Correct Type Exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
