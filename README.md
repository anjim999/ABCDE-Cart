# 🛒 ShopEase - E-Commerce Shopping Cart Application

> A full-stack e-commerce shopping cart application built with **Go (Gin + GORM)** backend and **React (Vite)** frontend.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Bonus Features](#bonus-features)

## ✨ Features

### Core Features
- ✅ User Registration & Authentication (JWT)
- ✅ Single-Device Login Enforcement
- ✅ Item Catalog Management
- ✅ Shopping Cart Operations
- ✅ Order Placement & History
- ✅ Protected Routes with Middleware

### Bonus Features
- 🎁 Password Hashing with bcrypt
- 🎁 Request Rate Limiting
- 🎁 Input Validation & Sanitization
- 🎁 Graceful Error Handling
- 🎁 API Response Pagination
- 🎁 Comprehensive Unit Tests with Ginkgo
- 🎁 Premium UI with Animations
- 🎁 Responsive Design
- 🎁 Dark Mode Support

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

```
shopease/
├── backend/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go          # Application entry point
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go        # Configuration management
│   │   ├── database/
│   │   │   └── database.go      # Database connection & migration
│   │   ├── handlers/
│   │   │   ├── user.go          # User handlers
│   │   │   ├── item.go          # Item handlers
│   │   │   ├── cart.go          # Cart handlers
│   │   │   └── order.go         # Order handlers
│   │   ├── middleware/
│   │   │   ├── auth.go          # JWT authentication middleware
│   │   │   └── cors.go          # CORS middleware
│   │   ├── models/
│   │   │   ├── user.go          # User model
│   │   │   ├── item.go          # Item model
│   │   │   ├── cart.go          # Cart model
│   │   │   └── order.go         # Order model
│   │   ├── repository/
│   │   │   ├── user.go          # User repository
│   │   │   ├── item.go          # Item repository
│   │   │   ├── cart.go          # Cart repository
│   │   │   └── order.go         # Order repository
│   │   ├── routes/
│   │   │   └── routes.go        # Route definitions
│   │   └── utils/
│   │       ├── jwt.go           # JWT utilities
│   │       └── response.go      # Response helpers
│   ├── tests/
│   │   ├── user_test.go
│   │   ├── cart_test.go
│   │   └── order_test.go
│   ├── go.mod
│   ├── go.sum
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ItemList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── CartModal.jsx
│   │   │   └── OrderHistory.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── ShopPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Go 1.21 or higher
- Node.js 18 or higher
- npm or yarn

### Backend Setup

```bash
cd backend
go mod download
go run cmd/server/main.go
```

The server will start at `http://localhost:8080`

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
