# SafeGuard – Enterprise Elderly Care Coordination Platform

**Team**: Neelaksh Saxena (24BCE2059), Kushl Goel (24BCE2106), Parth Khanayat (24BDS0299)  
**Course**: BCSE302P – Database Systems Lab  

SafeGuard has evolved from an academic MVP into a production-ready, startup-level enterprise platform. It combines real-time location tracking, health event logging, multi-caregiver coordination, predictive AI risk analytics, and telehealth integration to provide a centralized hub for tracking and managing the safety of elderly family members at scale.

## 🚀 Key Architectural Upgrades (Startup-Level Enhancements)

The platform has been massively upgraded to meet startup and enterprise standards, featuring a deep-tech premium design aesthetic and a massive feature set:

*   **Hybrid React Architecture:** The frontend utilizes Vite and React with `zustand` for global state management. The classic massive 15-tab legacy UI is seamlessly preserved inside an iframe, allowing the application to utilize modern state management without losing visual fidelity.
*   **Real-Time WebSockets:** The FastAPI backend is wrapped in an ASGI `Socket.io` server. Emergency SOS events, live location check-ins, and alerts are broadcasted bi-directionally to the frontend in real-time.
*   **PostgreSQL & SQLAlchemy Engine:** The raw SQLite queries have been replaced with a scalable SQLAlchemy ORM model layer. The backend gracefully defaults to SQLite for local rapid-prototyping but is fully configured for a production PostgreSQL connection via `DATABASE_URL`.
*   **HIPAA-Compliant Audit Logging:** A custom FastAPI middleware automatically traces every request execution (IP, Response Time, Status) into the terminal. An internal database table `audit_log` records mutations across all critical tables.
*   **Seamless PWA (Progressive Web App):** Installable to the home screen with offline-first capabilities, background syncing, and native-like push notifications via service workers.
*   **AI Predictive Insights:** Machine learning mocked models forecasting 72-hour fall risks, medication adherence patterns, and detecting cardiac anomalies.
*   **Emergency SOS Protocol:** A massive "Hold to SOS" button for elderly users that instantly alerts caregivers and securely transmits live GPS geofencing data.

## 📂 Project Structure

```text
./
│
├── backend/                  # Python FastAPI & Socket.io Backend
│   ├── main.py               # REST API, WebSockets, DB ORM Models
│   ├── test_main.py          # Pytest suite for endpoints & rate limiting
│   └── requirements.txt      # Python dependencies (SQLAlchemy, Socket.io, etc)
│
├── frontend-react/           # Modern React/Vite Frontend
│   ├── src/                  # React components, Zustand store, Socket context
│   ├── public/legacy/        # The complete legacy vanilla UI mounted via iframe
│   ├── package.json          # Node dependencies
│   ├── tailwind.config.js    # Styling configuration
│   └── vite.config.js        # Vite configuration
│
├── db/                       # Production Database Assets
│   └── schema.sql            # PostgreSQL DDL, triggers, and functions
│
├── docs/                     # Project Deliverables & Reports
│   ├── SafeGuard_Code_Integrity_Report.md
│   └── SafeGuard_Feature_Gap_Analysis.md
```

## 🛠️ Getting Started (How-To)

Follow these steps to run the full stack architecture locally with live WebSockets.

### 1. Run the Backend API (FastAPI + Socket.io)
The backend uses Python and dynamically generates a local SQLite database for rapid development if no Postgres URL is provided.

1. Open your terminal and navigate to the `backend` directory:
   ```powershell
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install the required dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Start the backend server using the Socket.io ASGI wrapper:
   ```powershell
   uvicorn main:socket_app --reload --port 5000
   ```
*(Note: Ensure your `.env` file is properly configured with your `DATABASE_URL` if using PostgreSQL).*

### 2. Run the React Frontend Dashboard
Built with React, Vite, TailwindCSS, and Zustand.

1. Open a new terminal and navigate to the `frontend-react` directory:
   ```powershell
   cd frontend-react
   ```
2. Install the required Node dependencies (legacy-peer-deps recommended):
   ```powershell
   npm install --legacy-peer-deps
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
4. Open `http://localhost:5173/` in your browser. 

### 3. How to Test the Integration
To test the real-time functionality of the app:
1. Ensure both the backend and frontend are running.
2. Open the dashboard in your browser.
3. Switch the role dropdown (top right) to **"Patient View"**.
4. Click **"Check-in Live Location"** or **"I'M SAFE"**.
5. You will observe the API call hit the backend terminal logs, trigger the WebSocket, and instantly spawn a dynamic green notification on the frontend UI.

## 🗄️ Database Strategy
While a local SQLite database (`safeguard.db`) is generated by the Python API via SQLAlchemy for immediate visualization, the robust, normalized schema intended for production environments is written in **PostgreSQL**. You can review the complete raw DDL including tables, relationships, indexes, constraints, functions, and triggers in `db/schema.sql`.

## 📚 Documentation
To trace the project's evolution, gap analysis, and code integrity audits, please review the files located in the `docs/` folder.
