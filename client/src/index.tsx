import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import authReducer from "./state";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

// 🔹 Define Persist Config
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// 🔹 Correctly Persisted Reducer
const persistedReducer = persistReducer(persistConfig, authReducer);

// 🔹 Properly Define Redux Store
export const store = configureStore({
  reducer: {
    auth: persistedReducer, // ✅ FIXED: Wrapped in an object
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 🔹 Define Correct Type Exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 🔹 Persistor Instance
const persistor = persistStore(store);

// 🔹 Render App with Redux Provider & PersistGate
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
