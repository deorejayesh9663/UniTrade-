import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ItemDetail from './pages/ItemDetail';
import Sell from './pages/Sell';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import MyChats from './pages/MyChats';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import './styles/variables.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content" style={{ minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              <Route path="/chats" element={<MyChats />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
