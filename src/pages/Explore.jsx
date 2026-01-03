import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Tag, Clock, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Explore.css';

const Explore = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [communityFilter, setCommunityFilter] = useState('My College');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    time: doc.data().createdAt?.toDate().toLocaleDateString() || "Just now"
                }));
                setItems(data);
            } catch (err) {
                console.error("Error fetching listings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    useEffect(() => {
        document.title = activeCategory === 'All'
            ? 'Explore Campus Listings - UniTrade'
            : `${activeCategory} for Sale - UniTrade Marketplace`;
    }, [activeCategory]);

    const categories = ['All', 'Books', 'Electronics', 'Furniture', 'Lab Gear', 'Clothing', 'Cycles', 'Study Notes', 'Hostel Gear', 'Instruments', 'Other'];

    const filteredItems = items.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = maxPrice === '' || item.price <= parseFloat(maxPrice);
        const isNotSold = !item.sold;

        // Community Filter Logic
        let matchesCollege = true;
        if (user && communityFilter === 'My College' && user.college) {
            matchesCollege = item.college === user.college;
        }

        return matchesCategory && matchesSearch && matchesPrice && isNotSold && matchesCollege;
    });

    return (
        <div className="explore-page">
            <header className="explore-header">
                <h1>Explore <span>Listings</span></h1>
                <p>Find what you need from fellow students around campus.</p>
            </header>

            <div className="search-filter-section glass-card">
                <div className="search-input-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="price-filter-box">
                    <span>Max Price ($):</span>
                    <input
                        type="number"
                        placeholder="Any"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
            </div>

            <div className="filter-bar glass-card">
                {user && user.college && (
                    <div className="community-select">
                        <label><GraduationCap size={16} /> Community:</label>
                        <select
                            value={communityFilter}
                            onChange={(e) => setCommunityFilter(e.target.value)}
                        >
                            <option value="My College">{user.college}</option>
                            <option value="Global">All Campuses</option>
                        </select>
                    </div>
                )}
                <div className="category-scroll">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="sort-box">
                    <Filter size={18} />
                    <span>Sort: Latest</span>
                </div>
            </div>

            <div className="items-grid">
                {loading ? (
                    <div className="loading-spinner">Loading listings...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="no-items">No items found in this category.</div>
                ) : (
                    filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="item-card glass-card"
                            onClick={() => navigate(`/item/${item.id}`)}
                        >
                            <div className="item-image">
                                <img src={item.image} alt={item.title} />
                                <div className="category-badge">{item.category}</div>
                            </div>
                            <div className="item-details">
                                <div className="price-row">
                                    <span className="price">${item.price}</span>
                                    <span className="time"><Clock size={12} /> {item.time}</span>
                                </div>
                                <h3>{item.title}</h3>
                                <div className="location">
                                    <MapPin size={14} />
                                    <span>{item.location}</span>
                                </div>
                                <div className="seller-info">
                                    <div className="avatar">{item.sellerName?.[0] || 'S'}</div>
                                    <span>{item.sellerName || "Verified Student"}</span>
                                </div>
                                <button className="btn-primary view-btn">View Details</button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Explore;
