import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    getDoc
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, MoreVertical, Smartphone } from 'lucide-react';
import './Chat.css';

const Chat = () => {
    const { chatId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatInfo, setChatInfo] = useState(null);
    const scrollRef = useRef();

    useEffect(() => {
        if (!chatId || !user) return;

        // Fetch Chat Info (Participants, Item info)
        const fetchChatInfo = async () => {
            const chatDoc = await getDoc(doc(db, "chats", chatId));
            if (chatDoc.exists()) {
                setChatInfo(chatDoc.data());
            }
        };
        fetchChatInfo();

        // Listen for Messages
        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });

        return unsubscribe;
    }, [chatId, user]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await addDoc(collection(db, "chats", chatId, "messages"), {
                text: newMessage,
                senderId: user.uid,
                createdAt: serverTimestamp()
            });
            setNewMessage('');
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    if (!user) return <div className="chat-error">Please login to view chats.</div>;

    return (
        <div className="chat-page">
            <div className="chat-container glass-card">
                {/* Chat Header */}
                <div className="chat-header">
                    <button className="back-icon" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="chat-user-info">
                        <div className="avatar">
                            {chatInfo ? (user.uid === chatInfo.sellerId ? chatInfo.buyerName?.[0] : chatInfo.sellerName?.[0]) : '?'}
                        </div>
                        <div>
                            <h4>{chatInfo ? (user.uid === chatInfo.sellerId ? chatInfo.buyerName : chatInfo.sellerName) : 'Loading...'}</h4>
                            <p>{chatInfo?.itemTitle || 'Negotiation'}</p>
                        </div>
                    </div>
                    <MoreVertical className="more-icon" />
                </div>

                {/* Messages Area */}
                <div className="messages-area">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`message-wrapper ${msg.senderId === user.uid ? 'own' : 'other'}`}
                        >
                            <div className="message-bubble glass-card">
                                <p>{msg.text}</p>
                                <span className="timestamp">
                                    {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                    <div ref={scrollRef} />
                </div>

                {/* Message Input */}
                <form className="chat-input-area" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="send-btn btn-primary">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
