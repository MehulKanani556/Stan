import './App.css';
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { configureStore } from "./Redux/Store";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import Home from "./Pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Store from "./Pages/Store";
import Rewards from "./Pages/Rewards";
import Transaction from "./components/Transaction";
import Support from "./components/Support";
import ManageAddress from "./components/ManageAddress";
import Games from "./Pages/Games";
import GamePlay from "./components/GamePlay";
import TopGames from "./components/TopGames";
import Profile from "./Pages/Profile";
import GGTalks from './Pages/GGTalks';
import { SocketProvider } from './context/SocketContext';
import SingleGame from './components/SingleGame';
import ChatWidget from './components/ChatWidget';
import Guides from './Pages/Guides';
import FAQs from './components/FAQs';
import TermsService from './components/TermsService.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import Cart from './Pages/Cart.jsx';
import Wishlist from './Pages/Wishlist.jsx';

// Component to conditionally render Header and Footer
function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" ;
  const showFooter  = isAuthPage || location.pathname === "/ggtalks";
  const chatwidegt = location.pathname === "/ggtalks";
  const { store } = configureStore();

  return (
    <>
      <Provider store={store}>
      {!isAuthPage && <Header />}
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}

          autoHideDuration={3000}
        >
          <SocketProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/store" element={<Store />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path='/support' element={<Support />} />
            <Route path='/GGTalks' element={<GGTalks />} />
            <Route path='/manageAddress' element={<ManageAddress />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/:slug" element={<GamePlay />} />
            <Route path="/TopGames" element={<TopGames />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/single" element={<SingleGame/>} />
            {/* <Route path="/guides" element={<Guides/>} /> */}
            <Route path="/single/:id" element={<SingleGame/>} />
            <Route path="/faqs" element={<FAQs/>} />
            <Route path="/terms" element={<TermsService/>} />
            <Route path="/privacy" element={<PrivacyPolicy/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/wishlist" element={<Wishlist/>} />
          </Routes>
           { !chatwidegt &&<ChatWidget />}
          </SocketProvider>
        </SnackbarProvider>

      {(!showFooter ) && <Footer />}
      </Provider>
    </>
  );
}

function App() {
  const { store } = configureStore();
  
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
