import time
import sqlite3
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import random

app = FastAPI(title="SafeGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "safeguard.db"
QUERY_HISTORY = []

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='elderly'")
    table_exists = cursor.fetchone()
    
    if table_exists:
        cursor.execute("SELECT COUNT(*) as count FROM elderly")
        if cursor.fetchone()['count'] >= 50:
            conn.close()
            return
            
    # Drop existing to reseed
    cursor.executescript("""
        DROP TABLE IF EXISTS alert;
        DROP TABLE IF EXISTS health_event;
        DROP TABLE IF EXISTS check_in;
        DROP TABLE IF EXISTS assignment;
        DROP TABLE IF EXISTS elderly;
        DROP TABLE IF EXISTS users;
        
        CREATE TABLE users (user_id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password_hash TEXT, role TEXT);
        CREATE TABLE elderly (elder_id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT, dob TEXT, status TEXT DEFAULT 'Safe', adherence_pct INTEGER DEFAULT 100);
        CREATE TABLE caregiver (caregiver_id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT);
        CREATE TABLE assignment (assignment_id INTEGER PRIMARY KEY AUTOINCREMENT, elder_id INTEGER, caregiver_id INTEGER);
        CREATE TABLE check_in (check_in_id INTEGER PRIMARY KEY AUTOINCREMENT, elder_id INTEGER, latitude REAL, longitude REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE health_event (event_id INTEGER PRIMARY KEY AUTOINCREMENT, elder_id INTEGER, event_type TEXT, severity TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE alert (alert_id INTEGER PRIMARY KEY AUTOINCREMENT, elder_id INTEGER, alert_type TEXT, severity TEXT, status TEXT DEFAULT 'Pending', timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
    """)
    
    # Generate 5 caregivers
    caregivers_users = [(f'caregiver{i}@test.com', 'hash', 'Caregiver') for i in range(1, 6)]
    cursor.executemany("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)", caregivers_users)
    
    # We know user_id 1 to 5 are caregivers
    caregivers_profiles = [(i, f'Caregiver {i}') for i in range(1, 6)]
    cursor.executemany("INSERT INTO caregiver (user_id, name) VALUES (?, ?)", caregivers_profiles)
    
    # Generate 50 elderly
    elderly_users = [(f'elder{i}@test.com', 'hash', 'Elderly') for i in range(1, 51)]
    cursor.executemany("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)", elderly_users)
    
    elderly_profiles = []
    assignments = []
    checkins = []
    alerts = []
    
    now = datetime.now()
    for i in range(1, 51):
        user_id = i + 5
        status = random.choices(['Safe', 'Warning', 'Alert'], weights=[0.7, 0.2, 0.1])[0]
        adherence = random.randint(50, 100) if status != 'Safe' else random.randint(85, 100)
        elderly_profiles.append((user_id, f'Patient {i}', '1940-01-01', status, adherence))
        
        # Assign to a random caregiver (1 to 5)
        cg_id = random.randint(1, 5)
        assignments.append((i, cg_id))
        
        # Generate check-ins based on status
        if status == 'Safe':
            checkins.append((i, 28.6, 77.2, (now - timedelta(minutes=random.randint(5, 120))).strftime("%Y-%m-%d %H:%M:%S")))
        elif status == 'Warning':
            checkins.append((i, 28.6, 77.2, (now - timedelta(hours=random.randint(6, 11))).strftime("%Y-%m-%d %H:%M:%S")))
        else: # Alert
            checkins.append((i, 28.6, 77.2, (now - timedelta(hours=random.randint(13, 48))).strftime("%Y-%m-%d %H:%M:%S")))
            alerts.append((i, 'Missed Check-in', 'Warning', 'Pending', (now - timedelta(hours=random.randint(1, 10))).strftime("%Y-%m-%d %H:%M:%S")))
            
    cursor.executemany("INSERT INTO elderly (user_id, name, dob, status, adherence_pct) VALUES (?, ?, ?, ?, ?)", elderly_profiles)
    cursor.executemany("INSERT INTO assignment (elder_id, caregiver_id) VALUES (?, ?)", assignments)
    cursor.executemany("INSERT INTO check_in (elder_id, latitude, longitude, timestamp) VALUES (?, ?, ?, ?)", checkins)
    if alerts:
        cursor.executemany("INSERT INTO alert (elder_id, alert_type, severity, status, timestamp) VALUES (?, ?, ?, ?, ?)", alerts)
        
    conn.commit()
    conn.close()

init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to SafeGuard API."}

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT status, count(*) as cnt FROM elderly GROUP BY status")
    counts = {row['status']: row['cnt'] for row in cursor.fetchall()}
    cursor.execute("SELECT COUNT(*) as pending_alerts FROM alert WHERE status='Pending'")
    pending = cursor.fetchone()['pending_alerts']
    return {
        "safe_count": counts.get('Safe', 0),
        "alert_count": counts.get('Alert', 0),
        "warning_count": counts.get('Warning', 0),
        "pending_alerts": pending,
        "avg_response_min": 15
    }

@app.get("/api/elderly")
def list_elderly():
    conn = get_db()
    cursor = conn.cursor()
    # Join with latest check_in
    query = """
    SELECT e.*, c.timestamp as last_checkin
    FROM elderly e
    LEFT JOIN (SELECT elder_id, MAX(timestamp) as timestamp FROM check_in GROUP BY elder_id) c
    ON e.elder_id = c.elder_id
    """
    cursor.execute(query)
    return [dict(r) for r in cursor.fetchall()]

class CheckInRequest(BaseModel):
    elder_id: int
    latitude: float
    longitude: float
    type: str = "Standard" # e.g., standard, fall, med

@app.post("/api/checkin")
def submit_checkin(req: CheckInRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO check_in (elder_id, latitude, longitude) VALUES (?, ?, ?)", (req.elder_id, req.latitude, req.longitude))
    if req.type != "Standard":
        cursor.execute("INSERT INTO health_event (elder_id, event_type, severity) VALUES (?, ?, ?)", (req.elder_id, req.type, 'High'))
    cursor.execute("UPDATE elderly SET status='Safe' WHERE elder_id=?", (req.elder_id,))
    conn.commit()
    return {"message": "Success"}

@app.get("/api/alerts")
def get_alerts():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT a.*, e.name as elderly_name FROM alert a JOIN elderly e ON a.elder_id = e.elder_id ORDER BY a.timestamp DESC")
    return [dict(r) for r in cursor.fetchall()]

@app.post("/api/alerts/{alert_id}/acknowledge")
def ack_alert(alert_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE alert SET status='Acknowledged' WHERE alert_id=?", (alert_id,))
    conn.commit()
    return {"message": "Acknowledged"}

@app.get("/api/db/stats")
def get_db_stats():
    conn = get_db()
    cursor = conn.cursor()
    tables = ['users', 'elderly', 'check_in', 'health_event', 'alert']
    stats = []
    for t in tables:
        cursor.execute(f"SELECT COUNT(*) as c FROM {t}")
        stats.append({"table": t, "rows": cursor.fetchone()['c']})
    return {"tables": stats, "history": QUERY_HISTORY[::-1][:10]}

class QueryRequest(BaseModel):
    query: str

@app.post("/api/query-analyzer")
def analyze_query(req: QueryRequest):
    conn = get_db()
    cursor = conn.cursor()
    start_time = time.perf_counter()
    try:
        cursor.execute(req.query)
        results = [dict(row) for row in cursor.fetchall()]
        exec_ms = round((time.perf_counter() - start_time) * 1000, 4)
        cursor.execute(f"EXPLAIN QUERY PLAN {req.query}")
        plan = [dict(row) for row in cursor.fetchall()]
        QUERY_HISTORY.append({"query": req.query, "ms": exec_ms, "time": datetime.now().strftime("%H:%M:%S")})
        return {"success": True, "results": results, "explain_plan": plan, "execution_time_ms": exec_ms}
    except Exception as e:
        QUERY_HISTORY.append({"query": req.query, "ms": 0, "error": str(e), "time": datetime.now().strftime("%H:%M:%S")})
        return {"success": False, "error": str(e)}

@app.get("/api/analytics/mock")
def get_analytics():
    return {
        "compliance": [80, 85, 90, 85, 95, 100, 90],
        "risk_trend": [40, 38, 35, 45, 50, 42, 30],
        "adherence": 88
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)
