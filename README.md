# PhishGuard AI

A production-ready, full-stack web application designed to detect phishing websites using AI-driven rule-based analysis. Built with React, Vite, Tailwind CSS, Python Flask, and SQLite.

## Features

- **Advanced URL Analysis**: Analyzes URL structure, SSL/HTTPS, Domain Age/Subdomains, Redirect chains, and Phishing Keywords.
- **Beautiful Dashboard**: Modern, responsive UI with glassmorphism, dark/light mode, and animations.
- **Interactive Analytics**: Pie, Bar, and Line charts visualizing platform usage and phishing trends.
- **Export & Share**: Download security reports as JSON, export to PDF, or copy/share results.
- **Robust Backend**: Flask API with rate limiting, error handling, CORS protection, and SQLite integration.

---

## 🚀 Quick Start Guide

### 1. Backend Setup (Flask API)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd phishguard-ai/backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the development server:
   ```bash
   python app.py
   ```
   *The backend runs on `http://localhost:5000`*

### 2. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd phishguard-ai/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend runs on `http://localhost:5173` (or similar, check terminal output)*

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v3 (Dark Mode enabled)
- **Icons**: Lucide React
- **Charts**: Chart.js / react-chartjs-2
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend
- **Framework**: Python Flask 3.0
- **Database**: SQLite3 (No setup required, auto-creates `instance/phishguard.sqlite`)
- **Security**: Flask-Limiter (Rate limiting), Flask-CORS
- **Detection Engine**: Modular Object-Oriented design

---

## 🔍 API Documentation

### POST `/api/analyze`
Analyzes a given URL.
- **Body**: `{"url": "https://example.com"}`
- **Returns**: Risk score, status (Safe/Suspicious/Phishing), and detailed reasons.

### GET `/api/stats`
Fetches global platform statistics for the dashboard charts.

### GET `/api/recent?limit=10`
Fetches the most recent scans.

### GET `/api/history?page=1&limit=20&search=google`
Fetches paginated scan history with optional URL search.

---

## 🔒 Security Measures Implemented

- **Rate Limiting**: Limits API requests to prevent abuse (200/day, 50/hour per IP).
- **SQL Injection Prevention**: Uses parameterized SQLite queries exclusively.
- **Input Sanitization**: Validates and normalizes URLs before processing.
- **Graceful Degradation**: If a detector crashes (e.g., WHOIS timeout), the app logs the error and continues analysis.
- **CORS Protection**: Configured securely via `flask-cors`.

---

## 🐳 Production Deployment

### Backend (Gunicorn + Nginx)
```bash
pip install gunicorn
gunicorn -w 4 -b 127.0.0.1:5000 'app:create_app()'
```

### Frontend (Static Hosting)
```bash
npm run build
```
Upload the `dist/` folder to Vercel, Netlify, or serve via Nginx.
