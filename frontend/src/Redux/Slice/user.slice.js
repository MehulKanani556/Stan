import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sessionStorage from "redux-persist/es/storage/session";
import axios from "axios";
import { BASE_URL } from "../../Utils/baseUrl";
import axiosInstance from "../../Utils/axiosInstance";
// import { Socket } from "socket.io-client";
// import { enqueueSnackbar } from 'notistack';
import { enqueueSnackbar } from 'notistack';
const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};
const initialState = {
  user: null,
  allCallUsers: [],
  // onlineUser: [],
  allUsers: [],
  allMessageUsers: [],
  messages: [],
  groups: [],
  isAuthenticated:
    !!sessionStorage.getItem("token") &&
    sessionStorage.getItem("role") === "admin",
  loading: false,
  error: null,
  loggedIn: false,
  isLoggedOut: false,
  message: null,
};




export const getUser = createAsyncThunk(
  "auth/getUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/singleUser/${userId}`);
      return response.data; // Assuming the API returns the user data
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

// export const updateUser = createAsyncThunk(
//     'auth/updateUser',
//     async ({ id, values }, { rejectWithValue }) => {
//         console.log(values);
//         try {
//             const response = await axios.post(`${BASE_URL}/user/${id}`, values);
//             return response.data; // Assuming the API returns the updated user data
//         } catch (error) {
//             return handleErrors(error, null, rejectWithValue);
//         }
//     }
// );
// Get user by ID
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/getUserById/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch user";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return rejectWithValue(error.response?.data || { message: errorMessage });
    }
  }
);
export const createPlan = createAsyncThunk(
  "auth/createPlan",
  async (planData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/plan`, planData);
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/getAllUsers");
      return response.data.result;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getAllMessageUsers = createAsyncThunk(
  "user/getAllMessageUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/getAllMessageUsers");
      return response.data.users;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getAllCallUsers = createAsyncThunk(
  "user/getAllCallUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/allCallUsers");
      return response.data.users;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

// export const getOnlineUsers = createAsyncThunk(
//     'user/getOnlineUsers',
//     async (_, { rejectWithValue }) => {
//         try {
//             const token = await sessionStorage.getItem("token");
//             const response = await axios.get(`${BASE_URL}/online-users`,{
//                 headers:{
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             return response.data;
//         } catch (error) {
//             return handleErrors(error, null, rejectWithValue);
//         }
//     }
// );

export const getAllMessages = createAsyncThunk(
  "user/getAllMessages",
  async ({ selectedId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/allMessages", { selectedId });
      return response.data.messages;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "user/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/deleteMessage/${messageId}`);
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const updateMessage = createAsyncThunk(
  "user/updateMessage",
  async ({ messageId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/updateMessage/${messageId}`, { content });
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ id, values }, { rejectWithValue }) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    try {
      const response = await axiosInstance.put(`/editUser/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data; // Assuming the API returns the updated user data
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const createGroup = createAsyncThunk(
  "user/createGroup",
  async ({ groupData, socket }, { rejectWithValue }) => {
    const formData = new FormData();
    Object.keys(groupData).forEach((key) => {
      if (Array.isArray(groupData[key])) {
        groupData[key].forEach((member) => {
          formData.append(`${key}[]`, member); // Append each member in the array
        });
      } else {
        formData.append(key, groupData[key]);
      }
    });
    try {
      const response = await axiosInstance.post("/createGroup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Emit socket event for group creation
      if (socket) {
        socket.emit("create-group", response.data.group);
      }
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getAllGroups = createAsyncThunk(
  "user/getAllGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/allGroups");
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const updateGroup = createAsyncThunk(
  "user/updateGroup",
  async (groupData, { rejectWithValue }) => {
    const { groupId, userName, members, photo, bio } = groupData;
    const formData = new FormData();
    formData.append("groupId", groupId);
    if (userName) {
      formData.append("userName", userName);
    }
    if (photo) {
      formData.append("photo", photo);
    }
    if (bio) {
      formData.append("bio", bio);
    }
    if (members) {
      members.forEach((member) => {
        formData.append("members[]", member);
      });
    }

    try {
      const response = await axiosInstance.put(
        `/updateGroup/${groupId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);

    }
  }
);

export const editUserProfile = createAsyncThunk(
  "user/editUserProfile",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (userData[key] !== undefined && userData[key] !== null) {
          formData.append(key, userData[key]);
        }
      });

      // Use self-edit endpoint for regular users
      const response = await axiosInstance.put(`/editProfile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      enqueueSnackbar("Profile updated successfully", { variant: "success" });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return rejectWithValue(error.response?.data || { message: errorMessage });
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "user/deleteGroup",
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/deleteGroup/${groupId}`);
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const addParticipants = createAsyncThunk(
  "user/addParticipants",
  async ({ groupId, members, addedBy }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/addParticipants", { groupId, members, addedBy });
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const leaveGroup = createAsyncThunk(
  "user/leaveGroup",
  async ({ groupId, userId, removeId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/leaveGroup",
        { groupId, userId, removeId }
      );
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);
// export const getOnlineUsers = createAsyncThunk(
//   "user/getOnlineUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = await sessionStorage.getItem("token");
//       const response = await axios.get(`${BASE_URL}/online-users`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       return handleErrors(error, null, rejectWithValue);
//     }
//   }
// );

export const archiveUser = createAsyncThunk(
  "user/archiveUser",
  async ({ selectedUserId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/archiveUser",
        { selectedUserId }
      );
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const clearChat = createAsyncThunk(
  "user/clearChat",
  async ({ selectedId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/clearChat",
        { selectedId }
      );
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const updateUserGroupToJoin = createAsyncThunk(
  "user/updateUserGroupToJoin",
  async ({ id, groupToJoin }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/updateUserGroupToJoin/${id}`, { groupToJoin });
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const updateUserProfilePhotoPrivacy = createAsyncThunk(
  "user/updateUserProfilePhotoPrivacy",
  async ({ id, profilePhoto }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/updateUserProfilePhotoPrivacy/${id}`, { profilePhoto });
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const blockUser = createAsyncThunk(
  "user/blockUser",
  async ({ selectedUserId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/blockUser",
        { selectedUserId }
      );
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteChat = createAsyncThunk(
  "user/deleteChat",
  async ({ selectedUserId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/deleteChat", { selectedId:selectedUserId });
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const pinChat = createAsyncThunk(
  "user/pinChat",
  async ({ selectedUserId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/pinChat", { selectedUserId });
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const muteChat = createAsyncThunk(
  "user/muteChat",
  async ({ selectedUserId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/muteChat", { selectedUserId });
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);


export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (id, { dispatch, rejectWithValue }) => {

     
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // dispatch(setAlert({ text: response.data.message, color: 'success' }));
        enqueueSnackbar( "Logged out successfully", { variant: "success" });
        return ;
      }
    
  
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state, action) => {
      state.user = null;
      state.allCallUsers = null;
      state.isAuthenticated = false;
      state.loggedIn = false;
      state.isLoggedOut = true;
      state.message = action.payload?.message || "Logged out successfully";
      window.localStorage.clear();
      window.sessionStorage.clear();
    },
    // setOnlineuser: (state, action) => {
    //   state.onlineUser = action.payload;
    // },
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
      state.message = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.error = null;
      state.message = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.users; // Assuming the API returns the user data
        state.loading = false;
        state.error = null;
        state.message = "User retrieved successfully";
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Failed to retrieve user";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.users; // Assuming the API returns the updated user data
        state.loading = false;
        state.error = null;
        state.message = "User updated successfully";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Failed to update user";
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message || "Plan created successfully";
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Failed to create plan";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.loading = false;
        state.error = null;
        state.message = "Users retrieved successfully";
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Failed to retrieve users";
      })
      // .addCase(getOnlineUsers.fulfilled, (state, action) => {
      //   state.onlineUser = action.payload;
      //   state.loading = false;
      //   state.error = null;
      //   state.message = "Online users retrieved successfully";
      // })
      // .addCase(getOnlineUsers.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload.message;
      //   state.message =
      //     action.payload?.message || "Failed to retrieve online users";
      // })
      .addCase(getAllMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
        state.error = null;
        state.message = "Messages retrieved successfully";
      })
      .addCase(getAllMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message =
          action.payload?.message || "Failed to retrieve messages";
      })
      .addCase(getAllMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "Retrieving messages...";
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message =
          action.payload?.message || "Message deleted successfully";
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Failed to delete message";
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Message updated successfully";
      })
      .addCase(updateMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Failed to update message";
      })
      .addCase(getAllMessageUsers.fulfilled, (state, action) => {
        state.allMessageUsers = action.payload;
        state.loading = false;
        state.error = null;
        state.message = "Message users retrieved successfully";
      })
      .addCase(getAllMessageUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message =
          action.payload?.message || "Failed to retrieve message users";
      })
      .addCase(getAllGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
        state.loading = false;
        state.error = null;
        state.message = "Groups retrieved successfully";
      })
      .addCase(getAllGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload?.message || "Failed to retrieve groups";
      })
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Group created successfully";
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload?.message || "Failed to create group";
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Group updated successfully";
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload?.message || "Failed to update group";
      })
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Group left successfully";
      })
      .addCase(leaveGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload?.message || "Failed to leave group";
      })
      .addCase(clearChat.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Chat cleared successfully";
      })
      .addCase(clearChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Failed to clear chat";
      })
      .addCase(getAllCallUsers.fulfilled, (state, action) => {
        state.allCallUsers = action.payload; // Assuming the API returns the call users
        state.loading = false;
        state.error = null;
        state.message = "Call users retrieved successfully";
      })
      .addCase(getAllCallUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message =
          action.payload?.message || "Failed to retrieve call users";
      })
      .addCase(updateUserGroupToJoin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "User group to join updated successfully";
      })
      .addCase(updateUserGroupToJoin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Failed to update user group to join";
      })
      .addCase(updateUserProfilePhotoPrivacy.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "User profile photo privacy updated successfully";
      })
      .addCase(updateUserProfilePhotoPrivacy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Failed to update user profile photo privacy";
        state.message = action.payload?.message || "Failed to archive user";
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "User block status updated successfully";
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message =
          action.payload?.message || "Failed to update block status";
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Chat deleted successfully";
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Failed to delete chat";
      })
      .addCase(pinChat.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Chat pinChat successfully";
      })
      .addCase(pinChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Failed to pinChat chat";
      })
      .addCase(muteChat.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Chat muteChat successfully";
      })
      .addCase(muteChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Failed to muteChat chat";
      })
    
      .addCase(logoutUser.fulfilled, (state, action) => {

        state.user = null;
        state.isAuthenticated = false;
        state.loggedIn = false;
        state.isLoggedOut = true;
        state.currentUser = null;
        window.sessionStorage.clear();
        state.message = action.payload?.message || "Logged out successfully";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload.message;
        state.message = action.payload?.message || "Logout Failed";
      })
      // GetUserById cases
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.result;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user";
        state.currentUser = null;
      })

      // EditUserProfile cases
      .addCase(editUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser && state.currentUser._id === action.payload.result._id) {
          state.currentUser = action.payload.result;
        }
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(editUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update profile";
      });

  },
});

export const { logout, clearUsers, clearCurrentUser, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;