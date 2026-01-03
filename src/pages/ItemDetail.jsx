import { db } from '../firebase/config';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, ShieldCheck, MessageCircle, ArrowLeft, Share2, Heart } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import './ItemDetail.css';

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [relatedItems, setRelatedItems] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);

    useEffect(() => {
        const fetchItemAndReviews = async () => {
            try {
                const docRef = doc(db, "listings", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const itemData = { id: docSnap.id, ...docSnap.data() };
                    setItem(itemData);

                    // Fetch reviews for this seller
                    const reviewsQ = query(
                        collection(db, "reviews"),
                        where("sellerId", "==", itemData.sellerId),
                        orderBy("createdAt", "desc")
                    );
                    const reviewsSnap = await getDocs(reviewsQ);
                    setReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

                    // Fetch Similar items
                    const relatedQ = query(
                        collection(db, "listings"),
                        where("category", "==", itemData.category),
                        where("sold", "==", false)
                    );
                    const relatedSnap = await getDocs(relatedQ);
                    setRelatedItems(
                        relatedSnap.docs
                            .map(d => ({ id: d.id, ...d.data() }))
                            .filter(i => i.id !== id)
                            .slice(0, 4)
                    );

                    // Check if saved
                    if (user) {
                        const savedQ = query(
                            collection(db, "wishlist"),
                            where("userId", "==", user.uid),
                            where("itemId", "==", id)
                        );
                        const savedSnap = await getDocs(savedQ);
                        setSaved(!savedSnap.empty);
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchItemAndReviews();
    }, [id, user]);

    const handleSave = async () => {
        if (!user) return navigate('/login');

        try {
            if (saved) {
                // Remove from wishlist
                const q = query(
                    collection(db, "wishlist"),
                    where("userId", "==", user.uid),
                    where("itemId", "==", id)
                );
                const snap = await getDocs(q);
                snap.forEach(async (d) => await deleteDoc(doc(db, "wishlist", d.id)));
                setSaved(false);
            } else {
                // Add to wishlist
                await addDoc(collection(db, "wishlist"), {
                    userId: user.uid,
                    itemId: id,
                    itemTitle: item.title,
                    itemPrice: item.price,
                    itemImage: item.image,
                    createdAt: serverTimestamp()
                });
                setSaved(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        if (!reviewText.trim()) return;

        try {
            const reviewData = {
                sellerId: item.sellerId,
                buyerId: user.uid,
                buyerName: user.displayName || "Anonymous",
                text: reviewText,
                rating: rating,
                createdAt: serverTimestamp()
            };
            const docRef = await addDoc(collection(db, "reviews"), reviewData);
            setReviews([{ id: docRef.id, ...reviewData, createdAt: { toDate: () => new Date() } }, ...reviews]);
            setReviewText('');
            alert("Review added!");
        } catch (err) {
            console.error(err);
        }
    };

    const handleMessage = async () => {
        if (!user) {
            alert("Please login to message the seller.");
            return navigate('/login');
        }

        if (user.uid === item.sellerId) {
            alert("You cannot message yourself!");
            return;
        }

        try {
            // Check if conversation already exists
            const chatsRef = collection(db, "chats");
            const q = query(chatsRef,
                where("itemId", "==", item.id),
                where("buyerId", "==", user.uid)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Conversation exists, redirect to it
                navigate(`/chat/${querySnapshot.docs[0].id}`);
            } else {
                // Create new conversation
                const docRef = await addDoc(chatsRef, {
                    itemId: item.id,
                    itemTitle: item.title,
                    sellerId: item.sellerId,
                    sellerName: item.sellerName,
                    buyerId: user.uid,
                    buyerName: user.displayName || "Verified Student",
                    updatedAt: serverTimestamp()
                });
                navigate(`/chat/${docRef.id}`);
            }
        } catch (err) {
            console.error("Error starting chat:", err);
            alert("Could not start chat. Please try again.");
        }
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: item.title,
                    text: `Check out this ${item.title} at ${item.college} campus on UniTrade!`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const handleReport = async () => {
        if (!user) return navigate('/login');
        if (window.confirm("Do you want to report this listing for inappropriate content?")) {
            try {
                await addDoc(collection(db, "reports"), {
                    itemId: id,
                    itemTitle: item.title,
                    reportedBy: user.uid,
                    sellerId: item.sellerId,
                    createdAt: serverTimestamp(),
                    status: 'pending'
                });
                alert("Listing reported. Our team will review it. Thank you for keeping the campus safe!");
            } catch (err) {
                console.error("Report failed:", err);
            }
        }
    };

    if (loading) return <div className="loading-state">Loading item details...</div>;
    if (!item) return <div className="error-state">Item not found.</div>;

    return (
        <div className="item-detail-page">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Back to Browse
            </button>

            <div className="detail-container">
                <div className="image-gallery glass-card">
                    <img src={item.image} alt={item.title} />
                    <div className="image-overlay">
                        <button
                            className={`icon-btn ${saved ? 'active' : ''}`}
                            onClick={handleSave}
                            title="Save to Wishlist"
                        >
                            <Heart size={20} fill={saved ? "currentColor" : "none"} />
                        </button>
                        <button className="icon-btn" onClick={handleShare} title="Share Listing"><Share2 size={20} /></button>
                        <button className="icon-btn report" onClick={handleReport} title="Report Listing"><ShieldCheck size={20} /></button>
                    </div>
                </div>

                <div className="content-side">
                    <div className="header-info">
                        <span className="cat-tag">{item.category}</span>
                        <h1>{item.title}</h1>
                        <div className="meta-row">
                            <span className="price-tag">${item.price}</span>
                            <div className="meta-items">
                                <span><MapPin size={16} /> {item.location}</span>
                                <span><Clock size={16} /> {item.createdAt?.toDate().toLocaleDateString() || "Recently"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="description section glass-card">
                        <h3>Description</h3>
                        <p>{item.description}</p>
                    </div>

                    <div className="seller-box section glass-card">
                        <h3>Seller Information</h3>
                        <div className="seller-profile">
                            <div className="avatar">{item.sellerName?.[0] || 'S'}</div>
                            <div className="seller-meta">
                                <h4>{item.sellerName || "Verified Student"}</h4>
                                <p><MapPin size={12} /> {item.college || "Campus Member"}</p>
                                <div className="stats">
                                    <span>⭐ 4.9 Rating</span>
                                    <span>•</span>
                                    <span>Active Seller</span>
                                </div>
                            </div>
                        </div>
                        <button className="btn-primary chat-btn" onClick={handleMessage}>
                            <MessageCircle size={20} /> Message Seller
                        </button>
                    </div>

                    <div className="safety-tips section glass-card">
                        <div className="safety-header">
                            <ShieldCheck size={20} color="#10b981" />
                            <h3>Safety First</h3>
                        </div>
                        <ul>
                            <li>Meet in public campus areas (Library, Cafeteria).</li>
                            <li>Inspect the item before paying.</li>
                            <li>Prefer digital transfers or exact cash.</li>
                        </ul>
                    </div>

                    <div className="reviews-section section glass-card">
                        <h3>Seller Reviews ({reviews.length})</h3>
                        <div className="reviews-list">
                            {reviews.map(review => (
                                <div key={review.id} className="review-item">
                                    <div className="review-header">
                                        <strong>{review.buyerName}</strong>
                                        <span className="stars">{"⭐".repeat(review.rating)}</span>
                                    </div>
                                    <p>{review.text}</p>
                                </div>
                            ))}
                        </div>

                        {user && user.uid !== item.sellerId && (
                            <form onSubmit={handleAddReview} className="add-review-form">
                                <h4>Leave a Review</h4>
                                <div className="rating-select">
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setRating(num)}
                                            className={rating === num ? 'active' : ''}
                                        >
                                            {num} ⭐
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    placeholder="Share your experience with this seller..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn-primary">Post Review</button>
                            </form>
                        )}
                    </div>

                    {relatedItems.length > 0 && (
                        <div className="related-section-wrapper">
                            <h3 className="section-title">Similar Items You Might Like</h3>
                            <div className="related-grid">
                                {relatedItems.map(rel => (
                                    <div
                                        key={rel.id}
                                        className="related-item-card glass-card"
                                        onClick={() => {
                                            navigate(`/item/${rel.id}`);
                                            window.scrollTo(0, 0);
                                        }}
                                    >
                                        <div className="rel-img-host">
                                            <img src={rel.image} alt={rel.title} />
                                        </div>
                                        <div className="rel-info">
                                            <h4>{rel.title}</h4>
                                            <p>${rel.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;
