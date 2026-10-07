import pytest
from fastapi.testclient import TestClient
from main import app, get_db

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to SafeGuard API."}

def test_login_rate_limiting():
    # Make multiple requests to trigger slowapi
    for _ in range(5):
        client.post("/api/auth/login", json={"email": "test@test.com", "password": "pw"})
    
    # 6th request should fail due to 5/minute limit
    response = client.post("/api/auth/login", json={"email": "test@test.com", "password": "pw"})
    assert response.status_code == 429
