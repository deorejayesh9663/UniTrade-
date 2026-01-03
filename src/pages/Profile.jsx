import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Heart, LogOut, Trash2, CheckCircle, Edit, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('listings');
    const [myListings, setMyListings] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                // Fetch My Listings
                const listingsQ = query(collection(db, "listings"), where("sellerId", "==", user.uid));
                const listingsSnap = await getDocs(listingsQ);
                setMyListings(listingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Fetch Saved Items (Wishlist)
                const savedQ = query(collection(db, "wishlist"), where("userId", "==", user.uid));
                const savedSnap = await getDocs(savedQ);
                setSavedItems(savedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) {
                console.error("Error fetching profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error("Failed to log out", err);
        }
    };

    const handleDeleteListing = async (listingId) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                await deleteDoc(doc(db, "listings", listingId));
                setMyListings(prev => prev.filter(item => item.id !== listingId));
            } catch (err) {
                alert("Error deleting listing");
            }
        }
    };

    const handleMarkSold = async (listingId) => {
        try {
            await updateDoc(doc(db, "listings", listingId), {
                sold: true,
                soldAt: new Date() // Store the time it was sold for cleanup
            });
            setMyListings(prev => prev.map(item =>
                item.id === listingId ? { ...item, sold: true, soldAt: new Date() } : item
            ));
        } catch (err) {
            alert("Error marking as sold");
        }
    };

    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="profile-header glass-card">
                <div className="profile-info">
                    <div className="profile-avatar">
                        {user.displayName?.[0] || user.email[0]}
                    </div>
                    <div className="profile-details">
                        <h1>{user.displayName || "Verified Student"}</h1>
                        <p>{user.email}</p>
                        <div className="profile-badges">
                            <span className="badge campus-badge">
                                <MapPin size={14} /> Campus Verified
                            </span>
                        </div>
                    </div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className="profile-tabs">
                <button
                    className={activeTab === 'listings' ? 'active' : ''}
                    onClick={() => setActiveTab('listings')}
                >
                    <Package size={18} /> My Listings ({myListings.length})
                </button>
                <button
                    className={activeTab === 'saved' ? 'active' : ''}
                    onClick={() => setActiveTab('saved')}
                >
                    <Heart size={18} /> Saved Items ({savedItems.length})
                </button>
            </div>

            <div className="tab-content">
                <AnimatePresence mode="wait">
                    {activeTab === 'listings' ? (
                        <motion.div
                            key="listings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="listings-grid"
                        >
                            {myListings.length === 0 ? (
                                <div className="empty-state glass-card">
                                    <Package size={40} />
                                    <p>You haven't posted any items yet.</p>
                                    <button className="btn-primary" onClick={() => navigate('/sell')}>Sell Something</button>
                                </div>
                            ) : (
                                myListings.map(item => (
                                    <div key={item.id} className={`profile-item-card glass-card ${item.sold ? 'sold' : ''}`}>
                                        <div className="item-img-wrapper">
                                            <img src={item.image} alt={item.title} />
                                            {item.sold && <div className="sold-overlay">SOLD</div>}
                                        </div>
                                        <div className="item-info">
                                            <h3>{item.title}</h3>
                                            <p className="price">${item.price}</p>
                                            <div className="item-actions">
                                                {!item.sold && (
                                                    <button className="action-btn check" onClick={() => handleMarkSold(item.id)} title="Mark as Sold">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                <button className="action-btn delete" onClick={() => handleDeleteListing(item.id)} title="Delete Listing">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="saved"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="saved-grid"
                        >
                            {savedItems.length === 0 ? (
                                <div className="empty-state glass-card">
                                    <Heart size={40} />
                                    <p>Your wishlist is empty.</p>
                                    <button className="btn-primary" onClick={() => navigate('/explore')}>Browse Items</button>
                                </div>
                            ) : (
                                savedItems.map(item => (
                                    <div key={item.id} className="profile-item-card glass-card" onClick={() => navigate(`/item/${item.itemId}`)}>
                                        <div className="item-img-wrapper">
                                            <img src={item.itemImage} alt={item.itemTitle} />
                                        </div>
                                        <div className="item-info">
                                            <h3>{item.itemTitle}</h3>
                                            <p className="price">${item.itemPrice}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Profile;
