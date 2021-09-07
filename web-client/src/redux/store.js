import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import apiMiddleware from "./middleware";
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddleware()),
});

export default store;
