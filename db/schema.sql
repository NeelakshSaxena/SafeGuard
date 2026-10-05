-- SafeGuard Database Schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Elderly', 'Caregiver', 'Doctor', 'Admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS elderly (
    elder_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(20),
    medical_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_age CHECK (EXTRACT(YEAR FROM AGE(dob)) >= 60)
);

CREATE TABLE IF NOT EXISTS caregiver (
    caregiver_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assignment (
    assignment_id SERIAL PRIMARY KEY,
    elder_id INT REFERENCES elderly(elder_id) ON DELETE CASCADE,
    caregiver_id INT REFERENCES caregiver(caregiver_id) ON DELETE CASCADE,
    UNIQUE (elder_id, caregiver_id)
);

CREATE TABLE IF NOT EXISTS check_in (
    check_in_id SERIAL PRIMARY KEY,
    elder_id INT REFERENCES elderly(elder_id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS health_event (
    event_id SERIAL PRIMARY KEY,
    elder_id INT REFERENCES elderly(elder_id) ON DELETE CASCADE,
    event_type VARCHAR(255) NOT NULL,
    severity VARCHAR(50) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medication (
    med_id SERIAL PRIMARY KEY,
    elder_id INT REFERENCES elderly(elder_id) ON DELETE CASCADE,
    med_name VARCHAR(255) NOT NULL,
    frequency_hours INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS med_log (
    log_id SERIAL PRIMARY KEY,
    med_id INT REFERENCES medication(med_id) ON DELETE CASCADE,
    taken BOOLEAN DEFAULT FALSE,
    scheduled_time TIMESTAMP NOT NULL,
    taken_time TIMESTAMP
);

CREATE TABLE IF NOT EXISTS geofence (
    fence_id SERIAL PRIMARY KEY,
    elder_id INT REFERENCES elderly(elder_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    radius_meters INT NOT NULL
);

CREATE TABLE IF NOT EXISTS alert (
    alert_id SERIAL PRIMARY KEY,
    elder_id INT REFERENCES elderly(elder_id) ON DELETE CASCADE,
    alert_type VARCHAR(255) NOT NULL,
    severity VARCHAR(50) CHECK (severity IN ('Warning', 'Critical')),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Acknowledged', 'Resolved')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_by INT REFERENCES caregiver(caregiver_id)
);

CREATE TABLE IF NOT EXISTS risk_score (
    score_id SERIAL PRIMARY KEY,
    elder_id INT REFERENCES elderly(elder_id) ON DELETE CASCADE,
    score_date DATE NOT NULL,
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
    UNIQUE (elder_id, score_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_checkin_elderid_time ON check_in(elder_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alert_elderid_status ON alert(elder_id, status);
CREATE INDEX IF NOT EXISTS idx_medlog_medid_time ON med_log(med_id, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_assignment_caregiver ON assignment(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_healthevent_severity ON health_event(elder_id, severity);

-- Trigger Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_elderly_modtime
BEFORE UPDATE ON elderly
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_caregiver_modtime
BEFORE UPDATE ON caregiver
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function: Compute Adherence Percent
CREATE OR REPLACE FUNCTION get_adherence_percent(p_elder_id INT, p_days INT)
RETURNS INT AS $$
DECLARE
    total_scheduled INT;
    total_taken INT;
BEGIN
    SELECT COUNT(*) INTO total_scheduled
    FROM med_log ml
    JOIN medication m ON ml.med_id = m.med_id
    WHERE m.elder_id = p_elder_id
      AND ml.scheduled_time >= (CURRENT_TIMESTAMP - (p_days || ' days')::interval);

    SELECT COUNT(*) INTO total_taken
    FROM med_log ml
    JOIN medication m ON ml.med_id = m.med_id
    WHERE m.elder_id = p_elder_id
      AND ml.taken = true
      AND ml.scheduled_time >= (CURRENT_TIMESTAMP - (p_days || ' days')::interval);

    IF total_scheduled = 0 THEN
        RETURN 100;
    END IF;

    RETURN (total_taken * 100) / total_scheduled;
END;
$$ LANGUAGE plpgsql;
