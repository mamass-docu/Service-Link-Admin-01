import { configureStore } from "@reduxjs/toolkit";
import globalsReducer from "./globalsSlice";
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
import storage from "redux-persist/lib/storage"; // Uses localStorage

import { combineReducers } from "redux";

// Combine reducers (if you have multiple reducers)
const rootReducer = combineReducers({
  globals: globalsReducer,
});

// Configure persistence
const persistConfig = {
  key: "globals-state", // Key for localStorage
  storage, // Where to store data
};

// Wrap the reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persist store
export const persistor = persistStore(store);
export default store;
