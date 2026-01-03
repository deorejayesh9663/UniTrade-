import React from 'react';
import { ShoppingBag, Github, Twitter, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer glass-card">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <ShoppingBag className="logo-icon" />
                        <span>Uni<span>Trade</span></span>
                    </div>
                    <p>The exclusive marketplace for your campus community. Buy, sell, and connect with fellow students safely.</p>
                </div>

                <div className="footer-links">
                    <div className="link-group">
                        <h4>Platform</h4>
                        <a href="/explore">Explore</a>
                        <a href="/sell">Sell Item</a>
                        <a href="/how-it-works">How it works</a>
                    </div>
                    <div className="link-group">
                        <h4>Developer</h4>
                        <span className="dev-name">deorejayeshpramod</span>
                        <a href="tel:9529434491">📞 9529434491</a>
                        <a href="mailto:deorejayesh503@gmail.com">✉️ deorejayesh503@gmail.com</a>
                    </div>
                    <div className="link-group">
                        <h4>Support</h4>
                        <a href="/safety">Safety Tips</a>
                        <a href="/faq">FAQs</a>
                        <a href="/contact">Contact Us</a>
                    </div>
                </div>

                <div className="footer-social">
                    <h4>Connect</h4>
                    <div className="social-icons">
                        <a href="#" className="social-icon"><Twitter size={20} /></a>
                        <a href="#" className="social-icon"><Github size={20} /></a>
                        <a href="#" className="social-icon"><Mail size={20} /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 UniTrade. Designed for students, by students.</p>
            </div>
        </footer>
    );
};

export default Footer;
