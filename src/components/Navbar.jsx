import React from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusSquare, User, ShoppingBag, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user } = useAuth();
    return (
        <nav className="navbar glass-card">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <ShoppingBag className="logo-icon" />
                    <span>Uni<span>Trade</span></span>
                </Link>

                <div className="search-bar glass-card">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search for books, gadgets, furniture..." />
                </div>

                <div className="nav-links">
                    <Link to="/explore" className="nav-link">Explore</Link>
                    {user && (
                        <Link to="/chats" className="nav-link">
                            <MessageCircle size={20} />
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
