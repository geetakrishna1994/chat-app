import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import conversationReducer from "./conversationSlice";
import contactsReducer from "./contactsSlice";
import apiMiddleware from "./middleware";

const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationReducer,
    contacts: contactsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddleware()),
});

export default store;
