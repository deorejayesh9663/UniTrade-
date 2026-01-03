import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Tag, DollarSign, Info } from 'lucide-react';
import { db, storage } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Sell.css';

const Sell = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: '',
        location: '',
        description: ''
    });

    const categories = ['Books', 'Electronics', 'Furniture', 'Lab Gear', 'Clothing', 'Other'];
    const campusLocations = ['Main Library', 'Engineering Block', 'Hostel Block A', 'Hostel Block B', 'Cafeteria', 'Sports Ground'];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600";

        const storageRef = ref(storage, `listings/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        return await getDownloadURL(snapshot.ref);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to post a listing.");
            return navigate('/login');
        }

        setLoading(true);
        try {
            const imageUrl = await uploadImage();

            await addDoc(collection(db, "listings"), {
                ...formData,
                price: parseFloat(formData.price),
                sellerId: user.uid,
                sellerName: user.displayName || "Student",
                createdAt: serverTimestamp(),
                image: imageUrl
            });
            alert("Listing created successfully!");
            navigate('/explore');
        } catch (err) {
            console.error(err);
            alert("Error creating listing: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sell-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sell-container glass-card"
            >
                <header className="sell-header">
                    <h1>Post <span>New Listing</span></h1>
                    <p>Turn your unused items into cash within your campus.</p>
                </header>

                <form onSubmit={handleSubmit} className="sell-form">
                    <div className="upload-section">
                        <div className={`upload-placeholder glass-card ${imagePreview ? 'has-image' : ''}`}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="preview-img" />
                            ) : (
                                <>
                                    <Camera size={40} />
                                    <span>Add Photo</span>
                                    <p>Click or drag to upload</p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="file-input"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label><Tag size={16} /> Item Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Organic Chemistry Textbook (3rd Ed)"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label><DollarSign size={16} /> Price ($)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label><MapPin size={16} /> Campus Meetup Location</label>
                            <select
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            >
                                <option value="">Select Location</option>
                                {campusLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label><Info size={16} /> Description</label>
                            <textarea
                                placeholder="Describe the condition, age, and details of the item..."
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary submit-btn" disabled={loading}>
                        {loading ? 'Creating Listing...' : 'Create Listing'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Sell;
