# UniTrade Platform Implementation Plan

## Project Overview
UniTrade is a hyper-local marketplace platform designed specifically for college students. It allows students to buy, sell, or trade items (books, electronics, furniture, etc.) within their campus community.

## Technology Stack
- **Frontend**: Vite + React
- **Styling**: Vanilla CSS (Premium Glassmorphism & Modern UI)
- **Database/Auth**: Firebase (Firestore, Authentication, Storage)
- **Deployment**: Vercel/Netlify

## Phase 1: Project Setup & Foundation
- [x] Initialize Vite + React project.
- [x] Setup Firebase configuration.
- [x] Define Design System (Colors, Typography, Spacing).
- [x] Create core layout components (Navbar, Sidebar, Container).

## Phase 2: User Authentication
- [x] Implement Firebase Auth (Email/Password).
- [ ] Restricted access: Require college email domain (Optional but recommended).
- [x] User Profile setup (Name, College, Department, Profile Picture).

## Phase 3: Marketplace Core (Listings)
- [x] **Creation**: Form to upload items with photos, price, category, and condition.
- [x] **Discovery**: Browse listings with search and advanced filters.
- [x] **Location Integration**: Tag listings with specific campus locations.
- [ ] **Wishlist**: Allow users to save items for later.

## Phase 4: Communication System
- [x] **Real-time Chat**: Connect buyers and sellers directly within the app using Firestore.
- [ ] **Notifications**: Alerts for new messages or price drops.

## Phase 5: Dashboard & Moderation
- [ ] **User Dashboard**: Manage active listings, see sold items.
- [ ] **Admin Panel**: Report/Remove inappropriate listings to maintain campus safety.

## Phase 6: Final Polish & Launch
- [ ] Dark Mode implementation.
- [ ] Responsive design for mobile users.
- [ ] SEO and Performance optimization.
- [ ] Final Testing and Deployment.
