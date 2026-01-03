# 🎓 UniTrade - College Marketplace Platform

A premium, full-stack marketplace platform designed exclusively for college students to buy, sell, and trade items within their campus community.

## ✨ Features

- 🔐 **Secure Authentication** - Email/Password login with Firebase
- 🛍️ **Live Marketplace** - Browse and search items with advanced filters
- 📸 **Image Upload** - Real product photos stored in Firebase Storage
- 💬 **Real-time Chat** - Direct messaging between buyers and sellers
- ⭐ **Seller Reviews** - Build trust with ratings and feedback
- 📊 **User Dashboard** - Manage your listings and wishlist
- 🎨 **Premium UI** - Modern glassmorphism design with smooth animations

## 🚀 Quick Deploy to Vercel

### Method 1: Via Vercel Website (Easiest)

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/unitrade-marketplace.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Deploy" (Vercel auto-detects Vite settings)
   - Your site will be live in ~2 minutes! 🎉

### Method 2: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Email/Password)
4. Enable **Firestore Database** (Start in test mode)
5. Enable **Storage**
6. Copy your config and update `src/firebase/config.js`

## 📱 Tech Stack

- **Frontend:** React + Vite
- **Styling:** Vanilla CSS with Glassmorphism
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Deployment:** Vercel

## 📄 License

MIT License - Feel free to use this for your college!

---

Built with ❤️ for campus communities
