import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Store from './components/Store';
import Rewards from './components/Rewards';
import Games from './components/Games';
import GamePlay from './components/GamePlay';

function App() {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/store" element={<Store />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:slug" element={<GamePlay />} />
      </Routes>
    </>
  );
}

export default App;
