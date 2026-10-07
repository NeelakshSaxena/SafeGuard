# SafeGuard – Enterprise Elderly Care Coordination Platform

**Team**: Neelaksh Saxena (24BCE2059), Kushl Goel (24BCE2106), Parth Khanayat (24BDS0299)  
**Course**: BCSE302P – Database Systems Lab  

SafeGuard is an enterprise-grade elderly care coordination and safety monitoring platform. It combines real-time vitals monitoring, geofenced location tracking, emergency SOS dispatch, medication adherence logging, caregiver/doctor/patient role workflows, and telehealth integration.

---

## 🚀 Key Architectural Highlights

* **Modern React Single-Page Application (SPA):** Built with **Vite**, **React 18/19**, **React Router v7**, and **lucide-react**, replacing the legacy vanilla JS monolith with clean, modular, and performant components.
* **Role-Based Context:** Dynamic, client-side persona switching (**Caregiver**, **Doctor**, **Patient**) powered by React Context (`RoleContext.jsx`).
* **Real-Time WebSockets & REST:** FastAPI backend wrapped with an ASGI `Socket.io` server for instant SOS alerts, check-ins, and notifications.
* **Dual Database Support (PostgreSQL / SQLite):** Powered by SQLAlchemy ORM. Automatically defaults to SQLite (`safeguard.db`) locally for instant out-of-the-box development, while supporting production PostgreSQL via `DATABASE_URL`.
* **Security & HIPAA-Aligned Auditing:** Middleware rate-limiting (`slowapi`), JWT auth helpers, and database audit logs tracking mutation events.
* **Progressive Web App (PWA):** Offline capability, service worker auto-update, and installable UI via `vite-plugin-pwa`.

---

## 📂 Project Structure

```text
SafeGuard/
│
├── backend/                       # Python FastAPI & Socket.io Backend
│   ├── main.py                    # REST API, Socket.io ASGI app, SQLAlchemy ORM
│   ├── test_main.py               # Pytest test suite
│   ├── safeguard.db               # Local SQLite development database
│   ├── requirements.txt           # Python dependencies
│   └── .env.example               # Environment variables template
│
├── frontend-react/                # Modern React / Vite Frontend
│   ├── src/
│   │   ├── components/            # Layout, Navbar, Sidebar
│   │   ├── context/               # RoleContext (Caregiver, Doctor, Patient)
│   │   ├── pages/                 # 11 Modular Pages (Dashboard, Alerts, Analytics...)
│   │   ├── App.jsx                # Client-side router configuration
│   │   └── index.css              # Custom Glassmorphic Dark Design System
│   ├── package.json               # Node dependencies & scripts
│   └── vite.config.js             # Vite + PWA configuration
│
├── db/                            # Production Database Assets
│   └── schema.sql                 # PostgreSQL DDL, triggers, and functions
│
└── docs/                          # Project Deliverables & Reports
    ├── SafeGuard_Code_Integrity_Report.md
    └── SafeGuard_Feature_Gap_Analysis.md
```

---

## 🛠️ Quick Start Guide

Run the full stack locally in two terminal windows (one for the Backend, one for the Frontend).

### Prerequisites
- **Python**: 3.10+ (tested on Python 3.12 / 3.14)
- **Node.js**: 18+ or 20+ & **npm**

---

### Step 1: Run the Backend (FastAPI + Socket.io)

1. Open a terminal and navigate to the `backend/` directory:
   ```powershell
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass   # If script execution is disabled
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (Command Prompt):**
     ```cmd
     python -m venv venv
     venv\Scripts\activate.bat
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn main:socket_app --reload --port 5000
   ```
   - **API Base URL:** `http://127.0.0.1:5000`
   - **Interactive API Docs (Swagger):** `http://127.0.0.1:5000/docs`

> **Note on Database:** By default, the backend will auto-initialize and read/write to the local SQLite database (`safeguard.db`). No PostgreSQL server setup is required for local testing!

---

### Step 2: Run the Frontend (React + Vite)

1. Open a **second terminal** and navigate to the `frontend-react/` directory:
   ```powershell
   cd frontend-react
   ```

2. Install Node dependencies:
   ```powershell
   npm install --legacy-peer-deps
   ```
   *(Note: Use `--legacy-peer-deps` to guarantee clean installation across React 19 testing library peer requirements).*

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```

4. Open the displayed local URL in your browser:
   **`http://localhost:5173`**

---

## 🧪 Verifying the Application

1. **Role Switching:** Click the role switcher in the top right of the navigation bar to switch between **Caregiver**, **Doctor**, and **Patient**. Notice the sidebar tabs adapt according to role permissions.
2. **Patient Emergency SOS:** Switch to **Patient View** and go to **Elderly App** to test the one-touch **Emergency SOS Alert**.
3. **Interactive Analytics:** Visit **Analytics** to view live telemetry trends generated with Chart.js.
4. **Backend Health Check:** Verify the API connection by visiting `http://127.0.0.1:5000/api/dashboard-stats` in your browser or Postman.
5. **Run Backend Tests:**
   ```powershell
   cd backend
   pytest
   ```

---

## 🗄️ Database Architecture

* **Local Development:** The application automatically runs out of the box using SQLite (`safeguard.db`) managed via SQLAlchemy models in [`backend/main.py`](file:///d:/Desktop/DBTHON/SafeGuard/backend/main.py).
* **Production PostgreSQL:** For enterprise deployment, configure `DATABASE_URL=postgresql://user:password@localhost:5432/safeguard` in `backend/.env`. The complete production schema with indexes, constraints, and audit triggers is available in [`db/schema.sql`](file:///d:/Desktop/DBTHON/SafeGuard/db/schema.sql).
