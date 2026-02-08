# 🛒 ShopEase - Premium E-Commerce Platform

A high-performance, full-stack shopping application featuring a modular Node.js/Go backend and a stunning React frontend. Built with modern UI/UX principles, smooth animations, and a robust design system.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 🌐 Live Demo

**Frontend (Render):** [https://shopease-frontend.onrender.com](https://shopease-frontend.onrender.com)  
**Backend (Render):** [https://shopease-backend.onrender.com](https://shopease-backend.onrender.com)

> ⚠️ **Note:** The backend on Render may take 30-60 seconds to wake up if it has been idle (free tier).

---

## ✨ Features

### Core Modules

| Module | Icon | Description |
| :--- | :---: | :--- |
| **Authentication** | 🔐 | Secure JWT login with single-device enforcement |
| **Product Discovery** | 🛍️ | Smart filtering, search, and category exploration |
| **Shopping Cart** | 🛒 | Real-time cart management with cloud syncing |
| **Wishlist** | ❤️ | One-tap favorites to track your desired items |
| **Order History** | 📜 | Detailed logs of your past purchases and status |
| **Dark Mode** | 🌙 | Premium dark/light mode with system preference |

### Advanced Capabilities
- 🛡️ **Security**: Password hashing with Bcrypt, Rate limiting, and Security headers.
- ⚡ **Auto-Seeding**: The Node.js and Go backends automatically populate with 20+ premium products on first run.
- � **Rich UI**: Built with Lucide-React icons, Framer-motion-like transitions, and a custom CSS design system.
- 📱 **Mobile First**: Fully responsive layout optimized for all device sizes.

## 🛠️ Tech Stack

### Backend
- **Language**: Go 1.21+
- **Framework**: Gin (HTTP Web Framework)
- **ORM**: GORM (Go ORM)
- **Database**: SQLite (easy setup) / PostgreSQL (production)
- **Testing**: Ginkgo + Gomega
- **Authentication**: JWT (JSON Web Tokens)

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## 📁 Project Structure

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/      # UI Components (Modals, Navbar, etc.)
│   ├── pages/           # Page-level components (Home, Shop, Cart)
│   ├── hooks/           # Custom React hooks for business logic
│   ├── layouts/         # Layout wrappers (MainLayout)
│   ├── context/         # AuthContext for global state
│   ├── services/        # API service layers (Axios)
│   ├── config.js        # Environment & API configuration
│   ├── App.jsx          # Main Router & Entry Point
│   └── index.css        # Premium Design System
```

### Backend (Node.js & Go)
```
backend-node/            # Node.js + Express + MongoDB
├── routes/              # Modular route definitions
├── utils/              # Seeder & Helper functions
└── server.js            # Entry point with auto-seeding

backend/                 # Go + Gin + GORM + SQLite
├── internal/
│   ├── handlers/        # API request handlers
│   ├── routes/          # Unified route setup
│   └── database/        # DB connection & auto-seeding
└── cmd/server/main.go   # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Go 1.21 or higher
- Node.js 18 or higher
- npm or yarn

### Backend Setup (Option 1: Node.js + MongoDB - Recommended)

```bash
cd backend-node
npm install
# Create a .env file with your MONGODB_URL
npm start
```
*Note: The database will **automatically seed** with initial products if it's empty.*

The server will start at `http://localhost:8080`.

### Backend Setup (Option 2: Go + SQLite)

```bash
cd backend
go mod download
go run cmd/server/main.go
```

The server will start at `http://localhost:8080`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users` | Create new user | No |
| GET | `/users` | List all users | No |
| POST | `/users/login` | User login | No |
| POST | `/users/logout` | User logout | Yes |

### Item Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/items` | Create new item | No |
| GET | `/items` | List all items | No |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/carts` | Add item to cart | Yes |
| GET | `/carts` | List all carts | Yes |
| GET | `/carts/my` | Get user's cart | Yes |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create order from cart | Yes |
| GET | `/orders` | List all orders | Yes |
| GET | `/orders/my` | Get user's orders | Yes |

## 🎁 Bonus Features Implemented

1. **Security Enhancements**
   - Password hashing with bcrypt
   - JWT token expiration
   - Single-device session management

2. **API Improvements**
   - Request validation
   - Structured error responses
   - Pagination support

3. **Testing**
   - Unit tests with Ginkgo/Gomega
   - Integration tests for API endpoints

4. **UI/UX**
   - Modern, premium design
   - Smooth animations
   - Dark mode support
   - Responsive layout

---

**Built with ❤️ for ABCDE Ventures Assignment**
