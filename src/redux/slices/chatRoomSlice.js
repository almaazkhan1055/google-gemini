import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  chatrooms: [], 
};

const chatroomSlice = createSlice({
  name: "chatroom",
  initialState,
  reducers: {
    addChatroom: (state, action) => {
      state.chatrooms.push(action.payload);
    },
    deleteChatroom: (state, action) => {
      state.chatrooms = state.chatrooms.filter(
        (room) => room.id !== action.payload
      );
    },
    loadChatroomsFromStorage: (state, action) => {
      state.chatrooms = action.payload || [];
    },
  },
});

export const { addChatroom, deleteChatroom, loadChatroomsFromStorage } =
  chatroomSlice.actions;

export default chatroomSlice.reducer;
