import { combineReducers } from "redux";
import authSlice from "./Slice/auth.slice";
import userSlice from "./Slice/user.slice";
import manageStateSlice from "./Slice/manageState.slice";


export const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  manageState: manageStateSlice,
});
