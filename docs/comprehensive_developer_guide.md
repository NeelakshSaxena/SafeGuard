# Comprehensive Developer Guide: SafeGuard

This document serves as the ultimate master manual for understanding, modifying, and troubleshooting the SafeGuard enterprise elderly care platform. It covers the complete lifecycle of data, the full technology stack, and step-by-step guides on making changes.

---

## 1. Executive Summary & Architecture Overview

SafeGuard is built on a **Decoupled Architecture**, meaning the Frontend and Backend run as two completely separate applications that talk to each other over a network (localhost during development).

### 🌐 How It All Connects
1. **Frontend (Browser):** The user interacts with the React interface.
2. **REST API (HTTP):** For standard data fetching (like "get my profile" or "submit a form"), React makes HTTP `GET` or `POST` requests using the `fetch` API to `http://localhost:5000/api/...`.
3. **WebSockets (Real-Time):** For instant events (like an SOS alert), both React and FastAPI maintain an open, continuous socket connection. If the backend emits an alert, the frontend receives it instantly without needing to refresh the page.
4. **Database (SQLAlchemy):** FastAPI translates the incoming requests into SQL, interacts with the local `safeguard.db` (SQLite) or production PostgreSQL database, and sends the JSON response back to React.

---

## 2. Frontend Deep Dive (React + Vite)

**Directory Location:** `frontend-react/`

### 💻 Core Tech Stack
* **Vite:** The build tool. It replaces Create React App (CRA) because it compiles files instantly, making local development (`npm run dev`) lightning fast.
* **React 18/19:** The core UI library. Uses functional components and React Hooks (`useState`, `useEffect`).
* **React Router v7:** Manages the URLs. When you click "Dashboard," it swaps out the UI components without reloading the browser.
* **Tailwind/Vanilla CSS:** Styling is handled globally via `index.css` using a premium glassmorphic dark theme.

### 🎭 Role Switching Mechanics
The app handles three distinct personas: **Caregiver**, **Doctor**, and **Patient**.
- Inside `src/context/RoleContext.jsx`, a global state remembers who is currently "logged in".
- Components like the `Sidebar` read this Context. If the context says `role === 'Patient'`, the sidebar only renders the "Elderly App" and "My Health" tabs, completely hiding Doctor-only tabs like "Consultations".

### 🛠️ How to Add a New Frontend Page
1. **Create the Component:** In `src/pages/`, create a new file (e.g., `Settings.jsx`).
2. **Build the UI:** Write a standard React functional component returning JSX.
3. **Register the Route:** Open `src/App.jsx` and add `<Route path="/settings" element={<Settings />} />` inside the `<Routes>` block.
4. **Update Navigation:** Open `src/components/Sidebar.jsx` and add a new navigation link pointing to `/settings`.

---

## 3. Backend Deep Dive (FastAPI + Python)

**Directory Location:** `backend/`

### 🐍 Core Tech Stack
* **FastAPI:** The fastest modern Python web framework. It automatically generates documentation (Swagger UI at `/docs`) based on Pydantic models.
* **SQLAlchemy:** The ORM (Object-Relational Mapper) that turns Python classes into SQL tables.
* **Python-SocketIO:** The ASGI server wrapper that enables real-time WebSocket communication alongside standard HTTP routes.

### ⚙️ How the Backend Works
1. **The Entry Point:** Everything starts in `backend/main.py`. The `app` (FastAPI) handles REST. The `sio` (SocketIO) handles WebSockets. `socket_app` wraps both together.
2. **Database Session (`get_db`):** Every API endpoint that needs the database accepts `db: Session = Depends(get_db)`. This safely opens a database connection, executes the query, and automatically closes the connection to prevent memory leaks.
3. **Models & Schemas:**
   - **SQLAlchemy Models** (e.g., `class User(Base):`) define the *Database Structure*.
   - **Pydantic Schemas** (e.g., `class LoginRequest(BaseModel):`) define the *JSON Shape* of incoming API requests to ensure strict validation.

### 🛠️ How to Add a New API Endpoint
1. **Define the Schema:** If you expect JSON input, create a Pydantic model:
   ```python
   class NewFeatureReq(BaseModel):
       data_field: str
   ```
2. **Create the Route:**
   ```python
   @app.post("/api/new-feature")
   def create_new_feature(req: NewFeatureReq, db: Session = Depends(get_db)):
       # Write to database or process logic here
       return {"success": True, "received": req.data_field}
   ```
3. **Test It:** Restart the server and visit `http://127.0.0.1:5000/docs` to test it instantly without writing any frontend code.

---

## 4. End-to-End Data Flow Examples

### 📡 Standard REST Flow: Fetching Notifications
1. **React:** `useEffect` runs on mount and calls `fetch('http://localhost:5000/api/notifications')`.
2. **FastAPI:** The `@app.get("/api/notifications")` route is triggered.
3. **SQLAlchemy:** Executes `SELECT * FROM notifications ORDER BY timestamp DESC`.
4. **FastAPI:** Packages the SQL rows into a JSON array and sends a `200 OK` response.
5. **React:** Parses the JSON, updates `useState()`, and the UI renders the notification list.

### 🚨 WebSockets Flow: Emergency SOS
1. **React:** Patient clicks "SOS". The frontend emits a socket event: `socket.emit("emergency_sos", { elder_id: 1 })`.
2. **SocketIO:** The backend receives the event via `@sio.on("emergency_sos")`.
3. **Database Write:** The backend instantly logs this as a critical `HealthLog`.
4. **Broadcast:** The backend blasts a message to *all connected clients*: `await sio.emit("critical_alert", data)`.
5. **React (Caregiver View):** The caregiver's browser, listening for `socket.on("critical_alert")`, triggers a red flashing UI state and plays an alarm sound.

---

## 5. Potential Errors & Troubleshooting Guide

Here is a list of the most common issues you might encounter during development and how to fix them.

### ❌ 1. CORS Error (Cross-Origin Resource Sharing)
* **Error:** Browser console says `Blocked by CORS policy`.
* **Why:** The frontend (`localhost:5173`) tried to call the backend (`localhost:5000`). Browsers block this for security unless the backend explicitly allows it.
* **Fix:** Ensure the `CORSMiddleware` in `main.py` is configured with `allow_origins=["*"]` (currently active in the codebase).

### ❌ 2. npm ERESOLVE (Peer Dependency Conflict)
* **Error:** `npm install` fails with `Could not resolve dependency...` involving React 19 and testing libraries.
* **Why:** React 19 is very new, and some third-party libraries still declare React 18 as their strict maximum version.
* **Fix:** Always run `npm install --legacy-peer-deps` inside `frontend-react/`.

### ❌ 3. Address Already in Use (Port Conflict)
* **Error:** Uvicorn fails to start with `[Errno 98] Address already in use`.
* **Why:** Another process (or an old frozen backend instance) is already using Port 5000.
* **Fix:** Kill the terminal, or find the PID using Port 5000 and terminate it manually, then restart Uvicorn.

### ❌ 4. Python/Scripts Execution Policy Error (Windows)
* **Error:** `.\venv\Scripts\Activate.ps1 cannot be loaded because running scripts is disabled on this system.`
* **Why:** Windows PowerShell restricts script execution by default.
* **Fix:** Run this command in PowerShell once: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`, then try activating the venv again.

### ❌ 5. SQLite "Database is Locked" Error
* **Error:** `sqlite3.OperationalError: database is locked`.
* **Why:** SQLite is a file-based database and struggles with multiple concurrent write operations. If two requests try to write at the exact same millisecond, one gets locked out.
* **Fix:** This is a limitation of SQLite. For local dev, restarting the backend usually clears the lock. For production, the app should be pointed to a PostgreSQL database via the `DATABASE_URL` `.env` variable, which handles concurrency perfectly.

### ❌ 6. Backend Changes Not Showing Up
* **Error:** You edited `main.py` but the API response didn't change.
* **Why:** The server wasn't started in reload mode.
* **Fix:** Ensure you start the backend with the `--reload` flag: `uvicorn main:socket_app --reload --port 5000`.
