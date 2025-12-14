# SweetShop

SweetShop is a sweet shop management system that helps you manage sweets, stock, pricing, and images through a simple web interface. It supports user accounts and protected inventory actions.

---

## Deployed Link
- https://sweet-shop-1-zyfk.onrender.com

---

## Folder Structure
```
SweetCorner/
├─ backend/
└─ frontend/
```

---

## Features
- Register & Login
- Add / View / Update / Delete sweets
- Purchase & Restock (inventory control)
- Upload and display sweet images
- Search and filter in the UI

---

## Run Locally (Setup)

### Prerequisites
- Node.js (LTS)
- npm
- MongoDB URI (Atlas/local)
- Cloudinary credentials (for image uploads)

---

## Backend

### 1) Install dependencies
```bash
cd backend
npm install
```

### 2) Create `.env`
Create: `backend/.env`

```env
PORT=3500

MONGOURL=YOUR_MONGODB_URI
MONGOURL_TEST=YOUR_MONGODB_TEST_URI

JWT_SECRET=YOUR_SECRET

FRONTEND_URL=<your frontend url>
BACKEND_URL=<your backend url>

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

### 3) Start backend
```bash
npm run dev
```

---

## Frontend

### 1) Install dependencies
```bash
cd ../frontend
npm install
```

### 2) Set backend URL (if using Vite env variables)
Create: `frontend/.env`

```env
VITE_APP_BACKENDURL=<your backend url>
```

> If your frontend already has a constants/config file for the backend URL, update that instead.

### 3) Start frontend
```bash
npm run dev
```

---

## Deployment Notes
- Set all backend environment variables on your hosting platform.
- Update backend `FRONTEND_URL` to your deployed frontend domain.
- Update frontend API base URL to your deployed backend domain.
- Keep `.env` private and never push it to GitHub.

---
