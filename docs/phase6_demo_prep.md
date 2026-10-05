# SafeGuard: Final Demo & Presentation Preparation

## 1. Demo Scenarios

### Scenario A: The Daily Check-In
**Duration**: 2 mins
**Flow**:
1. Open the Caregiver Dashboard on screen left, Elderly View on screen right.
2. Point out that "Bob Jones" has missed a check-in and is highlighted in red.
3. Switch to the Elderly View, click the large "I'm Safe" button.
4. Explain how the frontend uses `navigator.geolocation` to capture location without typing.
5. In the Caregiver Dashboard, simulate the real-time update showing Bob is now Safe.

### Scenario B: Database Visualization & Analytics
**Duration**: 3 mins
**Flow**:
1. Click on the "DB Visualizer" tab.
2. Explain the ER schema mapping (Users -> Elderly -> Check-Ins / Health Events).
3. Demonstrate the Query Analyzer: type `SELECT * FROM check_in;` and click Execute.
4. Show the live query execution time (Performance metric in ms) and the SQLite Execution Plan output.
5. Emphasize that all business logic (like alerts for missed check-ins) is driven by these underlying data structures.

## 2. Technical Pitch (1 Minute)
"SafeGuard is an integrated, database-driven elderly care platform. Existing tools like WhatsApp or basic med alarms are fragmented and rely on constant human vigilance. SafeGuard unifies location, health, and caregiver coordination into one seamless dashboard. Built on a robust relational schema with Python/FastAPI and a lightweight JS frontend, it automates peace of mind. Our DB Visualizer tab proves that complex data relationships can be queried efficiently, offering real-time insights with minimal latency."

## 3. Deployment Notes
- **Backend**: Run `uvicorn main:app --reload --port 5000` from the `backend` folder (inside the Python venv).
- **Frontend**: Open `frontend/index.html` in any modern browser. No build steps required.
- **Database**: SQLite database (`safeguard.db`) auto-generates on first backend startup, eliminating the need for a heavy global PostgreSQL install for the demo. Postgres DDL is provided in `db/schema.sql` for production.
