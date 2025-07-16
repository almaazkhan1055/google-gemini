import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatroomReducer from "./slices/chatRoomSlice";
import messageReducer from "./slices/messageSlice";
import themeReducer from "./slices/themeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chatroom: chatroomReducer,
    messages: messageReducer,
    theme: themeReducer,
  },
});

export default store;
