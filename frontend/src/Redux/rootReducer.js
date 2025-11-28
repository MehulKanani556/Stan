import { combineReducers } from "redux";
import authSlice from "./Slice/auth.slice";
import userSlice from "./Slice/user.slice";
import manageStateSlice from "./Slice/manageState.slice";
import freeGameSlice from "./Slice/freeGame.slice";
import gameSlice from "./Slice/game.slice";
import categorySlice from "./Slice/category.slice";
import cartSlice from "./Slice/cart.slice";
import wishlistSlice from './Slice/wishlist.slice';
import paymentSlice from './Slice/Payment.slice';
import profileSlice from './Slice/profile.slice';
import rewardSlice from './Slice/reward.slice';
import dashboardSlice from "./Slice/dashboard.slice";
import subscribeSlice from './Slice/subscribe.slice';
import TermsSlice from "./Slice/TermsCondition.slice";
import contactSlice from "./Slice/contactUs.slice";
import blogReducer from './Slice/blog.slice';
import faqSlice from './Slice/faq.slice';
import policySlice from "./Slice/PrivacyPolicy.slice";



export const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  manageState: manageStateSlice,
  freeGame: freeGameSlice,
  game: gameSlice,
  category: categorySlice,
  cart: cartSlice,
  wishlist:wishlistSlice,
  payment: paymentSlice,
  profile: profileSlice,
  reward: rewardSlice,
  dashboard: dashboardSlice,
  subscribe: subscribeSlice,
  term: TermsSlice,
  contactUs: contactSlice,
  blog: blogReducer,
  faq: faqSlice,
  policy: policySlice,

});
