import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  currentConversation: null,
};

const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    addConversation: (state, action) => {
      const convoIndex = state.conversations.findIndex(
        (c) => c.conversationId._id === action.payload.conversationId._id
      );
      if (convoIndex === -1) state.conversations.push(action.payload);
      else {
        state.conversations[convoIndex] = action.payload;
      }
    },
    addMessage: (state, action) => {
      const convoIndex = state.conversations.findIndex(
        (c) => c.conversationId._id === action.payload.conversationId
      );
      state.conversations[convoIndex].conversationId.messages.push(
        action.payload.message
      );
    },
    updateMessage: (state, action) => {
      const convoIndex = state.conversations.findIndex(
        (c) => c.conversationId._id === action.payload.conversationId
      );
      const msgIndex = state.conversations[
        convoIndex
      ].conversationId.messages.findIndex(
        (m) => m._id === action.payload.messageId
      );
      state.conversations[convoIndex].conversationId.messages[msgIndex] = {
        ...state.conversations[convoIndex].conversationId.messages[msgIndex],
        ...action.payload.data,
      };
    },
    reset: (state, action) => {
      return initialState;
    },
  },
});

export default conversationSlice.reducer;
export const {
  setConversations,
  setCurrentConversation,
  addMessage,
  updateMessage,
  addConversation,
  reset,
} = conversationSlice.actions;
