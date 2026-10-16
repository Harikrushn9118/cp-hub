# CP-Hub 🚀

**CP-Hub — Competitive Programming Companion & Analytics Dashboard**

CP-Hub is a full-stack web application that helps users track and analyze their competitive programming progress. It integrates the **Codeforces API** with a custom **Node.js + PostgreSQL backend** to provide user comparisons, problem tracking, and near real-time contest updates through an interactive dashboard.

![React](https://img.shields.io/badge/Frontend-React_Vite-blue)
![Node](https://img.shields.io/badge/Backend-Node_Express-green)
![DB](https://img.shields.io/badge/Database-PostgreSQL_Prisma-blue)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 🎯 Project Highlights

- Full-stack architecture using React, Node.js, Express, and PostgreSQL  
- API orchestration to fetch, process, and normalize Codeforces data  
- Live synchronization of bookmarks with Codeforces submissions  
- Secure authentication using JWT and Google OAuth  
- Clean, responsive UI built with Material UI and interactive charts  

---

## ⚙️ Key Engineering Problems Solved

### 🔒 Secure API Proxy (CORS Handling)
**Problem:** Browsers block direct requests to the Codeforces API due to CORS restrictions.  
**Solution:** Implemented a server-side proxy using Express to safely forward requests and centralize API handling.

---

### 🔄 Bookmark & Submission Matching
**Problem:** Bookmark data is stored locally, while solved status comes from Codeforces submissions.  
**Solution:** Designed a matching mechanism using a composite key (`contestId + index`) to verify whether bookmarked problems are solved.

---

### 📊 Data Normalization for Visualization
**Problem:** Codeforces API responses contain nested and inconsistent structures.  
**Solution:** Built a transformation layer that converts raw API responses into normalized formats consumable by Recharts.

---

## 🚀 Core Features

- Analytics dashboard for rating history, tags, and submission trends  
- User comparison for rank, rating, and solved problem counts  
- Problem tracker with filters and automatic solved-status tracking  
- Contest hub with quick access to ongoing and upcoming contests  
- Secure authentication with JWT and Google OAuth  

---

## 🏗️ System Overview

The system architecture consists of four main layers:

1.  **Client (React + Vite)** – Handles UI, interactive charts, and user interactions.  
2.  **Proxy Layer (Express API)** – Fetches and normalizes data from Codeforces, handles authentication, and forwards requests.  
3.  **External Source (Codeforces API)** – Provides live user and contest data.  
4.  **Database (PostgreSQL + Prisma)** – Stores users, bookmarks, sessions, and local caching.

---

## 📂 Project Structure

```text
cp-hub/
│
├── client/                     # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Global state (AuthContext)
│   │   ├── pages/              # Main route pages
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   └── package.json            # Frontend dependencies
│
├── server/                     # Backend Application (Node + Express)
│   ├── config/                 # DB configuration
│   ├── middleware/             # Auth middleware
│   ├── prisma/                 # Database schema
│   ├── routes/                 # API endpoints
│   ├── server.js               # Server entry point
│   └── package.json            # Backend dependencies
│
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```

---

## 🛠️ Tech Stack

| Domain | Technologies |
|--------|--------------|
| **Frontend** | React.js, Vite, Material UI, Recharts, Framer Motion |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | PostgreSQL |
| **Authentication** | JWT, Google OAuth 2.0 |

---



## 🔌 Quick Start

Create `server/.env` from `server/.env.example` and set `DATABASE_URL`, a strong `JWT_SECRET`, and the Google OAuth web client ID. Create `client/.env` from `client/.env.example`; set `VITE_API_URL` to the backend origin (for example `http://localhost:5001`) and use the same OAuth web client ID for `VITE_GOOGLE_CLIENT_ID`. The client adds `/api` to the configured backend origin automatically.

In Google Cloud Console, configure the OAuth client as a **Web application** and add the frontend's local and deployed origins to **Authorized JavaScript origins**. Add the deployed frontend origin as well as `http://localhost:5173` during local development. Keep the OAuth client ID public; never put the client secret in the frontend.

```bash
# 1. Clone Repository
git clone https://github.com/Harikrushn9118/cp-hub.git

# 2. Backend Setup
cd cp-hub/server
npm install
npx prisma db push
npm run dev

# 3. Frontend Setup
cd ../client
npm install
npm run dev
```

Open the frontend at `http://localhost:5173`. The landing page explains the public features; sign in or create an account to access the personalized tools. Google sign-in requires a matching `GOOGLE_CLIENT_ID` on the server and `VITE_GOOGLE_CLIENT_ID` on the client.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
