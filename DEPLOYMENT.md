# Expense Tracker - Render Deployment Guide

## Prerequisites
- A [Render](https://render.com) account
- A MongoDB Atlas account (or other cloud MongoDB provider)

## Deployment Steps

### 1. Set Up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) for Render access
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/expense-tracker`)

### 2. Deploy on Render

#### Option A: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will detect `render.yaml` and set up both services
6. Add environment variables:

**For expense-tracker-api:**
- `MONGODB_URI`: Your MongoDB connection string
- `CLIENT_URL`: Will be your frontend URL (e.g., `https://expense-tracker-frontend.onrender.com`)

**For expense-tracker-frontend:**
- `VITE_API_URL`: Will be your backend URL (e.g., `https://expense-tracker-api.onrender.com`)

7. Deploy both services

#### Option B: Manual Deployment

**Backend:**
1. Click "New" → "Web Service"
2. Connect your repository
3. Configure:
   - Name: `expense-tracker-api`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables (MONGODB_URI, CLIENT_URL, PORT=5000)

**Frontend:**
1. Click "New" → "Static Site"
2. Connect your repository
3. Configure:
   - Name: `expense-tracker-frontend`
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add environment variable: VITE_API_URL

### 3. Update Environment Variables
After both services are deployed, update the URLs:
- In backend: Set `CLIENT_URL` to your frontend URL
- In frontend: Set `VITE_API_URL` to your backend URL

### 4. Redeploy
Trigger a redeploy of both services for the environment variables to take effect.

## Local Development
1. Copy `.env.example` to `.env` in both `server` and `client` folders
2. Fill in your local MongoDB connection string
3. Run:
   ```
   # Terminal 1 - Backend
   cd server
   npm install
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm install
   npm run dev
   ```

## Important Notes
- Free tier services on Render spin down after inactivity - first request may be slow
- Make sure to whitelist Render IPs in MongoDB Atlas
- Keep your `.env` files private (already in `.gitignore`)
