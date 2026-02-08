# 🚀 Deployment Guide (Render.com)

This project consists of a **Node.js Backend** and a **React Frontend**. Follow these steps to deploy both to Render.com for free.

---

## 📦 Part 1: Deploy Backend (Node.js + MongoDB)

1.  **Push your code** to GitHub.
2.  Log in to [Render.com](https://render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Configure the Service**:
    *   **Name**: `shopease-backend` (or unique name)
    *   **Root Directory**: `backend-node` (⚠️ Very Important!)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
6.  **Environment Variables** (Scroll down to "Advanced"):
    *   Add Key: `MONGODB_URL`
    *   Value: *(Paste your connection string from Atlas)*
    *   Add Key: `JWT_SECRET`
    *   Value: `your-secret-key-here`
7.  Click **Create Web Service**.
8.  **Wait for deployment**. Once live, copy the **Backend URL** (e.g., `https://shopease-backend.onrender.com`).

---

## 🎨 Part 2: Deploy Frontend (React)

1.  Go to Render Dashboard.
2.  Click **New +** -> **Static Site**.
3.  Connect the **SAME** GitHub repository.
4.  **Configure the Service**:
    *   **Name**: `shopease-frontend`
    *   **Root Directory**: `frontend` (⚠️ Very Important!)
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
5.  **Environment Variables**:
    *   Add Key: `VITE_API_URL`
    *   Value: *(Paste your Backend URL from Part 1)* **IMPORTANT**: Do NOT add a trailing slash `/`.
        *   Example: `https://shopease-backend.onrender.com`
6.  Click **Create Static Site**.
7.  **Wait for deployment**.

---

## 🎉 Done!
Open your Frontend URL. It will automatically talk to your deployed Backend and MongoDB.
