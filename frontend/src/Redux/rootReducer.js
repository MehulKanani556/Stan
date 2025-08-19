import { combineReducers } from "redux";
import authSlice from "./Slice/auth.slice";

export const rootReducer = combineReducers({
  auth: authSlice,
 
});
