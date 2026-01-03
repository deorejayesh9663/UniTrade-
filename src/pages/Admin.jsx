import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import {
    collection,
    query,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    setDoc,
    getDoc,
    where
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Package,
    DollarSign,
    ShieldAlert,
    Trash2,
    Settings,
    TrendingUp,
    CheckCircle
} from 'lucide-react';
import './Admin.css';

const Admin = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalListings: 0,
        soldItems: 0,
        totalRevenue: 0
    });
    const [listings, setListings] = useState([]);
    const [platformFee, setPlatformFee] = useState(30); // Default 30 RS
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState('');
    const [cleanupStatus, setCleanupStatus] = useState('');

    useEffect(() => {
        if (!isAdmin) {
            navigate('/explore');
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Fetch Stats
                const usersSnap = await getDocs(collection(db, "users"));
                const listingsSnap = await getDocs(collection(db, "listings"));

                const listingsData = listingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const sold = listingsData.filter(item => item.sold).length;

                // Fetch settings
                const settingsDoc = await getDoc(doc(db, "system", "settings"));
                const fee = settingsDoc.exists() ? settingsDoc.data().platformFee : 30;
                setPlatformFee(fee);

                setStats({
                    totalUsers: usersSnap.size,
                    totalListings: listingsSnap.size,
                    soldItems: sold,
                    totalRevenue: sold * fee // Revenue = Sold Items * Flat Fee
                });

                setListings(listingsData);
            } catch (err) {
                console.error("Error fetching admin data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAdmin, navigate]);

    const handleSaveSettings = async () => {
        try {
            await setDoc(doc(db, "system", "settings"), {
                platformFee: parseFloat(platformFee),
                updatedAt: new Date(),
                updatedBy: user.uid
            });
            setSaveStatus('Success! Revenue model updated.');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (err) {
            console.error("Error saving settings:", err);
            setSaveStatus('Error saving settings.');
        }
    };

    const handleCleanup = async () => {
        if (!window.confirm("This will permanently delete images and listings that have been 'Sold' for more than 30 days. Proceed?")) return;

        setCleanupStatus('Starting cleanup...');
        let count = 0;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        try {
            const oldSoldListings = listings.filter(item =>
                item.sold &&
                item.soldAt &&
                (item.soldAt instanceof Date ? item.soldAt : item.soldAt.toDate()) < thirtyDaysAgo
            );

            for (const item of oldSoldListings) {
                // 1. Delete Image from Storage if it exists
                if (item.image && item.image.includes('firebasestorage')) {
                    try {
                        const imgRef = ref(storage, item.image);
                        await deleteObject(imgRef);
                    } catch (e) {
                        console.error("Image delete failed:", e);
                    }
                }
                // 2. Delete Doc from Firestore
                await deleteDoc(doc(db, "listings", item.id));
                count++;
            }

            setCleanupStatus(`Cleanup complete! Removed ${count} old items.`);
            // Refresh listings
            const listingsSnap = await getDocs(collection(db, "listings"));
            setListings(listingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error("Cleanup error:", err);
            setCleanupStatus('Error during cleanup.');
        }
        setTimeout(() => setCleanupStatus(''), 5000);
    };

    const handleDeleteListing = async (id) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                await deleteDoc(doc(db, "listings", id));
                setListings(listings.filter(item => item.id !== id));
            } catch (err) {
                console.error("Error deleting listing:", err);
            }
        }
    };

    if (loading) return <div className="admin-loading">Loading Admin Panel...</div>;

    return (
        <div className="admin-page">
            <header className="admin-header">
                <h1>Admin <span>Control Panel</span></h1>
                <p>Manage platform users, listings, and global revenue settings.</p>
            </header>

            <div className="stats-grid">
                <motion.div whileHover={{ y: -5 }} className="stat-card glass-card">
                    <Users size={24} className="stat-icon purple" />
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Students</p>
                    </div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="stat-card glass-card">
                    <Package size={24} className="stat-icon blue" />
                    <div className="stat-info">
                        <h3>{stats.totalListings}</h3>
                        <p>Active Listings</p>
                    </div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="stat-card glass-card">
                    <CheckCircle size={24} className="stat-icon green" />
                    <div className="stat-info">
                        <h3>{stats.soldItems}</h3>
                        <p>Items Sold</p>
                    </div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="stat-card glass-card">
                    <DollarSign size={24} className="stat-icon gold" />
                    <div className="stat-info">
                        <h3>RS {stats.totalRevenue.toFixed(2)}</h3>
                        <p>Total Platform Profit</p>
                    </div>
                </motion.div>
            </div>

            <div className="admin-content-grid">
                {/* Platform Settings */}
                <section className="admin-section settings-section glass-card">
                    <div className="section-header">
                        <Settings size={20} />
                        <h2>Revenue Model</h2>
                    </div>
                    <div className="settings-form">
                        <div className="form-group">
                            <label>Platform Fee per Sale (RS)</label>
                            <input
                                type="number"
                                value={platformFee}
                                onChange={(e) => setPlatformFee(e.target.value)}
                            />
                            <p className="help-text">Flat amount charged to the seller for every item marked as sold.</p>
                        </div>
                        <button onClick={handleSaveSettings} className="btn-primary">Update Revenue Model</button>
                        {saveStatus && <p className="status-msg">{saveStatus}</p>}
                    </div>
                </section>

                {/* Storage Maintenance */}
                <section className="admin-section settings-section glass-card">
                    <div className="section-header">
                        <Trash2 size={20} />
                        <h2>Storage Maintenance</h2>
                    </div>
                    <div className="settings-form">
                        <p className="help-text" style={{ marginBottom: '1rem' }}>
                            Free up Firebase Storage by deleting images and data for items that were sold more than 30 days ago.
                        </p>
                        <button onClick={handleCleanup} className="btn-primary delete-btn">Run Storage Cleanup</button>
                        {cleanupStatus && <p className="status-msg">{cleanupStatus}</p>}
                    </div>
                </section>

                {/* Listing Moderation */}
                <section className="admin-section listings-section glass-card">
                    <div className="section-header">
                        <ShieldAlert size={20} />
                        <h2>Listing Moderation</h2>
                    </div>
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Seller</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listings.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.title}</td>
                                        <td>{item.sellerName}</td>
                                        <td>${item.price}</td>
                                        <td>
                                            <span className={`status-badge ${item.sold ? 'sold' : 'active'}`}>
                                                {item.sold ? 'Sold' : 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteListing(item.id)}
                                                className="btn-icon delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Admin;
