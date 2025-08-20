import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Store from './Pages/Store';
import Rewards from './Pages/Rewards';
import Header from './header/Header';
import Transaction from './components/Transaction';
import Support from './components/Support';
import ManageAddress from './components/ManageAddress';
import Games from './Pages/Games';
import GamePlay from './components/GamePlay';
import { Provider } from 'react-redux';
import { configureStore } from './Redux/Store';
import { SnackbarProvider } from 'notistack';
import TopGames from './components/TopGames';
import GGTalks from './Pages/GGTalks.jsx';
import Footer from './footer/Footer.jsx';
import { SocketProvider } from './context/SocketContext';
const { store, persistor } = configureStore();

function App() {
  return (
    <>
      <Provider store={store}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          autoHideDuration={3000}
        >
          <SocketProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/store" element={<Store />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/transaction" element={<Transaction />} />
              <Route path='/support' element={<Support />} />
              <Route path='/ggtalks' element={<GGTalks />} />
              <Route path='/manageAddress' element={<ManageAddress />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:slug" element={<GamePlay />} />
              <Route path="/TopGames" element={<TopGames />} />
            </Routes>
            {/* <Footer /> */}
          </SocketProvider>
        </SnackbarProvider>
      </Provider>
    </>
  );
}

export default App;
