import React from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusSquare, User, ShoppingBag, MessageCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/explore?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    return (
        <nav className="navbar glass-card">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <ShoppingBag className="logo-icon" />
                    <span>Uni<span>Trade</span></span>
                </Link>

                <div className="search-bar glass-card">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for books, gadgets, furniture..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>

                <div className="nav-links">
                    <Link to="/explore" className="nav-link">Explore</Link>
                    {user && (
                        <Link to="/chats" className="nav-link">
                            <MessageCircle size={20} />
                        </Link>
                    )}
                    {isAdmin && (
                        <Link to="/admin" className="nav-link admin-link" title="Admin Panel">
                            <Shield size={20} />
                        </Link>
                    )}
                    <Link to="/sell" className="sell-btn btn-primary">
                        <PlusSquare size={18} />
                        <span>Sell Item</span>
                    </Link>
                    <Link to={user ? "/profile" : "/login"} className="user-profile">
                        <User size={20} className="profile-icon" />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
