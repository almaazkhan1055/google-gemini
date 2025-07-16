import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { chatroomId, message } = action.payload;
      if (!state[chatroomId]) {
        state[chatroomId] = [];
      }
      state[chatroomId].push(message);
    },
    simulateAiResponse: (state, action) => {},
    loadMessagesFromStorage: (state, action) => {
      return action.payload;
    },
  },
});

export const { addMessage, loadMessagesFromStorage } = messageSlice.actions;

export const simulateAiResponse =
  ({ chatroomId, userMessage, onDone }) =>
  (dispatch) => {
    setTimeout(() => {
      const aiMessage = {
        role: "ai",
        text: `You said: "${userMessage}" 🤖`,
        timestamp: new Date().toISOString(),
      };
      dispatch(addMessage({ chatroomId, message: aiMessage }));
      if (onDone) onDone();
    }, 1500);
  };

export default messageSlice.reducer;
