import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './MyChats.css';

const MyChats = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Query chats where user is either buyer or seller
        const qBuyer = query(
            collection(db, "chats"),
            where("buyerId", "==", user.uid),
            orderBy("updatedAt", "desc")
        );

        const qSeller = query(
            collection(db, "chats"),
            where("sellerId", "==", user.uid),
            orderBy("updatedAt", "desc")
        );

        // Combine results from both queries (Firestore doesn't support 'OR' for different fields in simple way)
        const unsubBuyer = onSnapshot(qBuyer, (snapshot) => {
            const buyerChats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            updateChats(buyerChats, 'buyer');
        });

        const unsubSeller = onSnapshot(qSeller, (snapshot) => {
            const sellerChats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            updateChats(sellerChats, 'seller');
        });

        const updateChats = (newChats, type) => {
            setConversations(prev => {
                const otherType = type === 'buyer' ? 'seller' : 'buyer';
                const filteredPrev = prev.filter(c => !newChats.find(nc => nc.id === c.id));
                const combined = [...newChats, ...prev.filter(c => !newChats.find(nc => nc.id === c.id))];
                return combined.sort((a, b) => b.updatedAt?.seconds - a.updatedAt?.seconds);
            });
            setLoading(false);
        };

        return () => {
            unsubBuyer();
            unsubSeller();
        };
    }, [user]);

    if (!user) return <div className="chats-error">Please login to see your messages.</div>;

    return (
        <div className="my-chats-page">
            <header className="chats-header">
                <h1>My <span>Messages</span></h1>
                <p>Keep track of your negotiations and campus deals.</p>
            </header>

            <div className="conversations-list">
                {loading ? (
                    <div className="loading-chats">Loading conversations...</div>
                ) : conversations.length === 0 ? (
                    <div className="no-chats glass-card">
                        <MessageSquare size={40} />
                        <h3>No messages yet</h3>
                        <p>Start browsing items and contact sellers to see messages here.</p>
                        <button className="btn-primary" onClick={() => navigate('/explore')}>Explore Items</button>
                    </div>
                ) : (
                    conversations.map((chat, index) => (
                        <motion.div
                            key={chat.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="chat-item glass-card"
                            onClick={() => navigate(`/chat/${chat.id}`)}
                        >
                            <div className="chat-item-info">
                                <div className="avatar">
                                    {user.uid === chat.sellerId ? chat.buyerName?.[0] : chat.sellerName?.[0]}
                                </div>
                                <div className="text-content">
                                    <div className="top-row">
                                        <h4>{user.uid === chat.sellerId ? chat.buyerName : chat.sellerName}</h4>
                                        <span className="time">
                                            <Clock size={12} /> {chat.updatedAt?.toDate().toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="item-ref">Item: {chat.itemTitle}</p>
                                </div>
                            </div>
                            <ArrowRight size={20} className="arrow-icon" />
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyChats;
