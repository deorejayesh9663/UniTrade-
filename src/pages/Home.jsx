import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Box, ShieldCheck, Zap } from 'lucide-react';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="home-page">
            <section className="hero">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hero-content"
                >
                    <span className="badge">Campus Exclusive</span>
                    <h1>Your Campus Marketplace for <span>Everything.</span></h1>
                    <p>Buy and sell pre-loved items within your college community. Fast, safe, and hyper-local.</p>

                    <div className="hero-actions">
                        <button className="btn-primary btn-large" onClick={() => navigate('/explore')}>
                            Start Browsing <ArrowRight size={20} />
                        </button>
                        <button className="btn-secondary">How it works</button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-val">2.5k+</span>
                            <span className="stat-label">Active Users</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-val">1.2k+</span>
                            <span className="stat-label">Daily Items</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hero-visual"
                >
                    <div className="visual-card main-card glass-card">
                        <div className="item-preview"></div>
                        <div className="item-info">
                            <div className="skeleton-line full"></div>
                            <div className="skeleton-line mid"></div>
                            <div className="price-tag">$49.99</div>
                        </div>
                    </div>
                    <div className="visual-card floating-card-1 glass-card">
                        <Zap size={24} color="var(--secondary)" />
                    </div>
                    <div className="visual-card floating-card-2 glass-card">
                        <ShieldCheck size={24} color="#10b981" />
                    </div>
                    <div className="visual-card floating-card-3 glass-card">
                        <Box size={24} color="var(--primary)" />
                    </div>
                </motion.div>
            </section>

            <section className="trending-categories">
                <div className="section-header">
                    <h2>Trending <span>Categories</span></h2>
                    <p>What's hot in your campus right now.</p>
                </div>
                <div className="category-grid">
                    {[
                        { name: 'Books', icon: '📚', count: '450+' },
                        { name: 'Cycles', icon: '🚲', count: '120+' },
                        { name: 'Electronics', icon: '💻', count: '300+' },
                        { name: 'Notes', icon: '📝', count: '800+' }
                    ].map(cat => (
                        <motion.div
                            key={cat.name}
                            whileHover={{ scale: 1.05 }}
                            className="cat-card glass-card"
                            onClick={() => navigate(`/explore?cat=${cat.name}`)}
                        >
                            <span className="cat-icon">{cat.icon}</span>
                            <h3>{cat.name}</h3>
                            <p>{cat.count} listings</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="features">
                <div className="feature-grid">
                    <div className="feature-card glass-card">
                        <div className="icon-box"><ShieldCheck /></div>
                        <h3>Verified Students</h3>
                        <p>Trade with confidence within your campus community.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="icon-box"><Zap /></div>
                        <h3>Instant Pings</h3>
                        <p>Real-time chat to finalize deals in minutes.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="icon-box"><Box /></div>
                        <h3>Free Listings</h3>
                        <p>List your items for free without any commissions.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
