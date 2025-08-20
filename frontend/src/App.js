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

// Component to conditionally render Header and Footer
function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const { store } = configureStore();

  return (
    <>
      {!isAuthPage && <Header />}
      <Provider store={store}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          autoHideDuration={3000}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/store" element={<Store />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path='/support' element={<Support />} />
            {/* <Route path='/GGTalks' element={<GGTalks />} /> */}
            <Route path='/manageAddress' element={<ManageAddress />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/:slug" element={<GamePlay />} />
            <Route path="/TopGames" element={<TopGames />} />
            <Route path="/Profile" element={<Profile />} />
          </Routes>
        </SnackbarProvider>
      </Provider>
      {!isAuthPage && <Footer />}
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
