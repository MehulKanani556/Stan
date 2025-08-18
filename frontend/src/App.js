import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Store from './components/Store';
import Rewards from './components/Rewards';
import Header from './components/Header';
import Transaction from './components/Transaction';
import Support from './components/Support';
import ManageAddress from './components/ManageAddress';
import Games from './components/Games';
import GamePlay from './components/GamePlay';

function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/store" element={<Store />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path='/support' element={<Support />} />
        <Route path='/manageAddress' element={<ManageAddress />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:slug" element={<GamePlay />} />
      </Routes>

    </>
  );
}

export default App;
