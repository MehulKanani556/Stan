import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {

  selectedUser: null,
  messages: [],
  onlineUsers: [],
  typingUsers: [],
};

const manageStateSlice = createSlice({
  name: "manageState",
  initialState,
  reducers: {

    setSelectedUser: (state, action) => {      
      state.selectedUser = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      const newMessage = action.payload;
      // Add timestamp if not present
      if (!newMessage.time) {
        newMessage.time = new Date(newMessage.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      state.messages.push(newMessage);
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addTypingUser: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(
        (userId) => userId !== action.payload
      );
    },
    setTypingUsers: (state, action) => {
      state.typingUsers = action.payload;
    },
    clearTypingUsers: (state) => {
      state.typingUsers = [];
    }
  },
});

export const {
  setSelectedUser,
  setMessages,
  addMessage,
  setOnlineUsers,
  addTypingUser,
  removeTypingUser,
  setTypingUsers,
  clearTypingUsers
} = manageStateSlice.actions;
export default manageStateSlice.reducer;
