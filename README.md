# 🕸️ CareerMentor AI — Personalized AI Career & Placement Mentor

**CareerMentor AI** is a full-stack web application built for college students preparing for technical campus placement drives. It provides personalized AI Skill Gap Analysis, an interactive 5-question Mock Placement Interview Simulator with real-time scoring, a customized 6-Week Action Roadmap, and an Executive Demo Dashboard.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Modern Custom CSS (Spider-Verse Neons, Glassmorphism, Dark Mode)
- **Backend**: Node.js + Express
- **Database**: SQLite via `better-sqlite3` (Zero-config, automatic WAL mode, persistent file DB)
- **AI Engine**: Anthropic Claude API (`claude-3-5-sonnet-20241022`) via `@anthropic-ai/sdk` with built-in retries, 15s timeout, and instant mock fallback net for offline/venue Wi-Fi reliability.
- **Package Manager**: `npm`

---

## 📁 Project Structure
```
career-mentor-ai/
├── server/
│   ├── index.js                  # Express API Server Entry
│   ├── db/
│   │   ├── schema.sql            # SQLite schema
│   │   └── db.js                 # SQLite database helper (better-sqlite3)
│   ├── services/
│   │   ├── claudeClient.js       # Anthropic API client with fallback net
│   │   └── mockData.js           # Hackathon offline mock dataset
│   ├── routes/
│   │   ├── skillGap.js           # POST /api/skill-gap
│   │   ├── interview.js          # POST /api/interview/start & /answer
│   │   └── roadmap.js            # POST /api/roadmap
│   ├── .env.example
│   └── package.json
├── client/
│   ├── index.html
│   ├── vite.config.js            # Vite proxy -> http://localhost:5000
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles.css            # Dark mode glassmorphism & Spider-Verse design
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── LoadingSpinner.jsx
│       │   └── ErrorBoundary.jsx
│       └── pages/
│           ├── Home.jsx          # Role & Skills Selection Form
│           ├── SkillGap.jsx      # Match Percentage & Priority Matrix
│           ├── Interview.jsx     # Hero 5-Question AI Interview Simulator
│           ├── Roadmap.jsx       # 6-Week Milestone Action Plan
│           └── Dashboard.jsx     # Executive Presentation Dashboard
├── README.md
└── DEMO_SCRIPT.md
```

---

## ⚡ Quick Start & Run Instructions

### 1. Install Dependencies

In a terminal, install dependencies for **both** server and client:

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Configure Environment & API Key (Google Gemini or Anthropic)

Create a `.env` file inside the `server/` directory:

```bash
# Inside server/.env
GEMINI_API_KEY=your_google_gemini_api_key_here

# Anthropic API Key (Alternative)
ANTHROPIC_API_KEY=

PORT=5000
```

> 💡 **Safety Net Guarantee**: If `ANTHROPIC_API_KEY` is omitted or API calls fail/timeout, **CareerMentor AI** automatically switches to fast mock data responses so your demo never crashes or stalls!

---

### 3. Launch Servers

Open two separate terminal windows (or tabs):

#### Terminal 1: Start Backend Server
```bash
cd server
npm run dev
```
*Backend will run at `http://localhost:5000` with SQLite DB initialized.*

#### Terminal 2: Start Frontend Dev Server
```bash
cd client
npm run dev
```
*Frontend will launch at `http://localhost:5173`.*

---

## 🚀 3-Minute Live Hackathon Demo
Refer to [`DEMO_SCRIPT.md`](file:///C:/Users/venka/.gemini/antigravity-ide/scratch/career-mentor-ai/DEMO_SCRIPT.md) for step-by-step presentation guidelines.
