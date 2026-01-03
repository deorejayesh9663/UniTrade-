import Chat from './pages/Chat';
import MyChats from './pages/MyChats';
import Profile from './pages/Profile';
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
