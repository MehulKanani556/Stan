import { combineReducers } from "redux";
import authSlice from "./Slice/auth.slice";
import userSlice from "./Slice/user.slice";
import manageStateSlice from "./Slice/manageState.slice";
import freeGameSlice from "./Slice/freeGame.slice";
import gameSlice from "./Slice/game.slice";
import categorySlice from "./Slice/category.slice";

export const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  manageState: manageStateSlice,
  freeGame: freeGameSlice,
  game: gameSlice,
  category: categorySlice,
});
