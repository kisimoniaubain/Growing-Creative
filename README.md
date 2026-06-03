# SSE.org Project

A complete MERN-style web platform for **Sustainable Self Employment (SSE.org)**.

## Project Structure

```plaintext
SSE-ORG-PROJECT/
├── backend/
│   ├── server.js
│   ├── config/
│   ├── models/
│   ├── controllers/
│   └── routes/
└── frontend/
    ├── src/
    │   ├── components/
    │   └── pages/
    └── ...
```

## Features Implemented

- Company-style responsive website with:
  - Home landing page + hero + impact scorecard
  - The Hub page with age-validated application form (18-30)
  - Revolving Fund transparency page with progress meters
  - Marketplace product storefront grid
- Backend API with MongoDB models and routes for:
  - Youth users
  - Enterprises
  - Transactions
  - Hub applications
- Fund statistics endpoint for donor transparency dashboard

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB (Mongoose)

## Setup Instructions

### Quick Start (Run Both From Root)

```bash
cd SSE-ORG-PROJECT
npm run install:all
npm run dev
```

This starts backend and frontend together in one terminal.

Build frontend from root:

```bash
npm run build
```

### 1. Backend

```bash
cd backend
npm install
```

Create an `.env` file in `backend/` based on `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sseorg
JWT_SECRET=change_this_to_a_secure_secret
CLIENT_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

## Core API Endpoints

- `GET /api/health`
- `POST /api/applications`
- `GET /api/applications`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/enterprises`
- `POST /api/enterprises`
- `GET /api/enterprises/fund/stats`
- `GET /api/transactions`
- `POST /api/transactions`

## Notes

- The current marketplace uses placeholder sample products.
- Image assets currently use hosted placeholders and can be replaced with real SSE.org media.
- The Hub form is fully connected to backend storage.
