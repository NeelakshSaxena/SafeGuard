# SafeGuard Codebase & Architecture Overview

This document provides a comprehensive explanation of the SafeGuard platform's codebase, outlining **what** the code does, **how** it is structured, and **why** specific architectural decisions were made.

---

## 1. High-Level Architecture
SafeGuard is designed as a modern, real-time web application. It follows a decoupled Client-Server architecture:
- **Frontend (Client)**: A Single-Page Application (SPA) built with React 18/19 and Vite.
- **Backend (Server)**: A RESTful API combined with a WebSocket server, built on Python's FastAPI.
- **Database**: Relational data models managed by SQLAlchemy, supporting SQLite (local dev) and PostgreSQL (production).

> [!NOTE] 
> **Why decouple the frontend and backend?**
> A decoupled architecture allows the React frontend (running in the user's browser) and the FastAPI backend (running on a server) to scale independently. It also makes it trivial to later introduce a native mobile app that consumes the exact same FastAPI endpoints.

---

## 2. Frontend (`frontend-react/`)
The frontend is built using **React** and bundled with **Vite**. 

### Key Technologies:
- **Vite:** Replaces Webpack/CRA for lightning-fast hot module replacement (HMR) and optimized builds.
- **React Context API:** Manages global state, specifically the user's current role (`Caregiver`, `Doctor`, `Patient`).
- **React Router:** Handles client-side navigation without full page reloads.
- **Tailwind/Custom CSS:** Uses a "Glassmorphic Dark Design System" for a premium, accessible UI.

### Why this approach?
- **Role-Based UI:** The app dynamically switches views based on the `RoleContext.jsx`. This prevents the need to build three separate dashboards, keeping the codebase DRY (Don't Repeat Yourself) while securely hiding unauthorized tabs.
- **Progressive Web App (PWA):** By using `vite-plugin-pwa`, the frontend can be installed on a mobile device and function offline, which is critical for an elderly care app where network connectivity might drop.

---

## 3. Backend (`backend/`)
The backend is housed in `backend/main.py`. It is a monolithic FastAPI application.

### Key Technologies:
- **FastAPI:** A modern Python web framework that is heavily reliant on Python type hints.
- **SQLAlchemy:** An Object-Relational Mapper (ORM) that translates Python classes into SQL tables.
- **Socket.IO (python-socketio):** Provides real-time bidirectional communication.
- **Slowapi:** Provides rate-limiting capabilities.

### Detailed Breakdown of `main.py`:

#### A. Database Models (Lines 29-132)
The data layer is defined via SQLAlchemy models:
- `User`, `Elderly`, `PatientProfile`: Core identity and demographics.
- `CheckIn`, `Alert`, `HealthLog`: Telemetry and emergency tracking.
- `Message`, `Consultation`, `MedicationRefill`: Care coordination features.
- `AuditLog`: Security tracking.
**Why SQLAlchemy?** It abstracts SQL dialects. By changing a single `DATABASE_URL` string, the app effortlessly swaps between a file-based SQLite database for local testing and a robust PostgreSQL database for enterprise production.

#### B. Seeding Mechanism (Lines 136-165)
The `seed_data()` function ensures that the database is populated with sample data (devices, profiles, consultations) upon startup. 
**Why?** This guarantees a "zero-configuration" developer experience. When you spin up the backend, the UI immediately has data to display without manual entry.

#### C. Real-Time WebSockets (Lines 182-184, 206-213)
FastAPI (REST) is wrapped in a `socketio.ASGIApp`. 
**Why?** Polling a database every second for an emergency SOS is highly inefficient and slow. WebSockets allow the backend to *push* data (like a fall alert or a location update) to the frontend instantly.

#### D. Security & HIPAA Compliance (Lines 194-201, 226)
- **Audit Logging Middleware:** An `@app.middleware("http")` intercepts every single request, logs the IP, method, endpoint, and processing time. In a real-world healthcare app, tracking *who* accessed *what* is a legal HIPAA requirement.
- **Rate Limiting:** Routes like login (`/api/auth/login`) are protected by `@limiter.limit("5/minute")` to prevent brute-force credential stuffing.

#### E. Endpoints (Lines 217-477)
RESTful routes are strictly separated by domain (e.g., `/api/devices`, `/api/consultations`, `/api/health-logs`). 
**Why?** FastAPI's dependency injection (`Depends(get_db)`) is used in every route to safely open and close database sessions, preventing memory leaks and database locks.

---

## 4. Summary of Data Flow Example (SOS Alert)
To understand how it all connects, here is the lifecycle of an SOS alert:
1. **Frontend Action:** The Patient clicks the "SOS" button in the React UI.
2. **REST Request:** React sends a POST request to `/api/checkin` with `type: "SOS"`.
3. **Database Write:** FastAPI receives it, creates a `CheckIn` and a `HealthLog` with `severity: "Critical"`, and commits to SQLite/Postgres.
4. **Real-Time Broadcast:** FastAPI calls `await sio.emit('patient:update', ...)` over WebSockets.
5. **Frontend Reaction:** The Caregiver's dashboard, listening to the WebSocket, instantly turns red and displays the SOS location—all in less than 50 milliseconds.
