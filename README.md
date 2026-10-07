# SafeGuard – Enterprise Elderly Care Coordination Platform

**Team**: Neelaksh Saxena (24BCE2059), Kushl Goel (24BCE2106), Parth Khanayat (24BDS0299)  
**Course**: BCSE302P – Database Systems Lab  

SafeGuard has evolved from an academic MVP into a production-ready, startup-level enterprise platform. It combines real-time location tracking, health event logging, multi-caregiver coordination, predictive AI risk analytics, and telehealth integration to provide a centralized hub for tracking and managing the safety of elderly family members at scale.

## Key Features (Startup-Level Enhancements)

The platform has been massively upgraded to meet startup and enterprise standards, featuring a deep-tech premium design aesthetic and a massive feature set:

*   **Seamless PWA (Progressive Web App)**: Installable to the home screen with offline-first capabilities, background syncing, and native-like push notifications via service workers.
*   **Telemedicine & Video Consultation**: Embedded dashboards for booking doctors, viewing availability, and managing active prescriptions and medication refills.
*   **Wearables & Health Records**: Real-time mock integration with Apple Watch and BP Monitors to track vitals, plus a centralized repository for lab reports and medical history.
*   **AI Predictive Insights**: Machine learning mocked models forecasting 72-hour fall risks, medication adherence patterns, and detecting cardiac anomalies.
*   **Emergency SOS Protocol**: A massive "Hold to SOS" button for elderly users that instantly alerts caregivers and securely transmits live GPS geofencing data.
*   **Enterprise Multi-Tenant UI**: An Organization Settings dashboard for Care Facility Managers offering white-labeling, role-based access control, and network-wide facility tracking.
*   **Caregiver Support Community**: A peer-to-peer network and community hub for caregivers to share resources, join groups, and attend expert Q&As.
*   **Interactive DB Diagnostics**: A visual ER Schema diagram that animates node-by-node execution paths when raw SQL queries are evaluated by the backend.

## Project Structure

```text
./
│
├── backend/                  # Python FastAPI backend
│   ├── main.py               # REST API, endpoints, DB visualizer logic
│   └── requirements.txt      # Python dependencies
│
├── frontend-react/           # Modern React/Vite Frontend
│   ├── src/                  # React components and pages
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite configuration
│
├── frontend/                 # Pure HTML/JS/CSS frontend (Zero Build Tools)
│   ├── app.js                # Core UI logic, Chart.js mapping, API requests, SOS logic
│   ├── index.html            # Dashboard layouts, Sidebars, Modals, Tabs
│   ├── manifest.json         # PWA configuration and app metadata
│   └── service-worker.js     # PWA offline caching and network strategies
│
├── db/                       # Production Database Assets
│   └── schema.sql            # PostgreSQL DDL, triggers, and functions
│
├── docs/                     # Project Deliverables & Reports
│   ├── phase1_competitive_analysis.md
│   ├── phase1_problem_validation.md
│   ├── phase1_requirements.md
│   ├── phase2_database_design.md
│   ├── phase5_uat_report.md
│   └── phase6_demo_prep.md
│
├── vercel.json               # Vercel deployment configuration
├── deployment.md             # Guide for Vercel deployment
└── projectSpec.md            # Original project requirements
```

## Getting Started

### 1. Run the Backend API
The backend uses Python and a local SQLite database for rapid development.

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
4. Start the backend server:
   ```powershell
   uvicorn main:socket_app --reload --port 5000
   ```
*(Note: Ensure your `.env` file is properly configured with your DATABASE_URL if using PostgreSQL. Otherwise, it defaults to a local SQLite database).*

### 2. Run the Frontend Dashboard
We provide two frontend versions: the modern React app and the classic vanilla HTML/JS version.

#### Option A: React Frontend (Recommended)
Built with React and Vite for a modern development experience.

1. Open a new terminal and navigate to the `frontend-react` directory:
   ```powershell
   cd frontend-react
   ```
2. Install the required Node dependencies:
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
4. Open the displayed URL in your browser (usually `http://localhost:5173`).

#### Option B: Classic Vanilla Frontend
The classic frontend relies strictly on modern browser capabilities without any build tools.

1. Simply double-click `frontend/index.html` to open it in your web browser.
2. Use the **Sidebar Navigation** to toggle between Caregiver Monitoring, Telehealth, Wearables, AI Insights, Enterprise Facilities, and Community.
3. Check out the **Elderly App** tab to test the simulated Emergency SOS and Quick Check-in features.

## Deployment

To deploy this project to production (e.g., Vercel), we have included a `vercel.json` configuration and a detailed deployment guide. Please read [deployment.md](deployment.md) for full instructions.

## 🗄️ Database Strategy
While a local SQLite database (`safeguard.db`) is generated by the Python API for immediate visualization and UI prototyping, the robust, normalized schema intended for production environments is written in **PostgreSQL**. You can review the complete DDL including tables, relationships, indexes, constraints, functions, and triggers in `db/schema.sql`.

## Documentation
To trace the project's evolution, please review the files located in the `docs/` folder. These files outline problem validation, requirements, database architecture, user acceptance testing (UAT), and preparation strategies for the final project presentation.
