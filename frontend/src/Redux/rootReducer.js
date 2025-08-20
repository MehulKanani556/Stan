import { combineReducers } from "redux";
import authSlice from "./Slice/auth.slice";
import userSlice from "./Slice/user.slice";

export const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
});
