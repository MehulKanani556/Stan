import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
 
  selectedUser: null,
  messages: [],

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
  },
});

export const {
  setSelectedUser,
  setMessages,
  addMessage,
} = manageStateSlice.actions;
export default manageStateSlice.reducer;
