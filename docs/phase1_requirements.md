# SafeGuard: Requirements Specification

## 1. Functional Requirements (FR)

### Check-in and Location Tracking
- **FR-1**: Elderly can submit a daily "I'm Safe" check-in with GPS coordinates so that caregivers know they are okay.
- **FR-2**: Caregivers can view the latest check-in timestamp and location on a map.
- **FR-3**: System automatically creates an alert if no check-in is received within a 12-hour window.
- **FR-4**: System triggers an alert if a check-in is recorded outside of an expected geofence radius.

### Health Event Logging
- **FR-5**: Elderly can log basic health events (e.g., pain, falls, feeling unwell).
- **FR-6**: Caregivers can view a history of logged health events categorized by severity.
- **FR-7**: System auto-escalates 'High' or 'Critical' severity events immediately.

### Caregiver Coordination
- **FR-8**: Multiple caregivers can be assigned to one elderly profile.
- **FR-9**: Any assigned caregiver can acknowledge an alert, notifying all others it is being handled.
- **FR-10**: Caregivers can view a unified dashboard showing the status of all assigned elderly.

### Analytics and Risk Assessment
- **FR-11**: System calculates a daily Risk Score (0-100) based on check-in consistency, health events, and geofence anomalies.
- **FR-12**: Caregivers can view medication adherence percentages over 7-day and 30-day windows.
- **FR-13**: System visualizes compliance charts and risk score trends.

### Authentication & Access
- **FR-14**: Users can register and log in with JWT-based authentication.
- **FR-15**: Role-based access ensures elderly only see their own profile, while caregivers see their assigned profiles.

## 2. Non-Functional Requirements (NFR)

- **NFR-1 (Performance)**: API responses must resolve in < 1 second.
- **NFR-2 (Reliability)**: Database must enforce referential integrity to prevent orphan alerts or check-ins.
- **NFR-3 (Security)**: Passwords must be hashed; endpoints must require valid JWT.
- **NFR-4 (Usability)**: Elderly UI components (buttons) must be large and high-contrast.
- **NFR-5 (Architecture)**: Backend must use Python (per user constraints) and PostgreSQL.

## 3. MoSCoW Prioritization
- **Must Have**: Check-ins, Alerts, Role-based auth, Risk scoring calculation.
- **Should Have**: Geofencing, Analytics charts, Caregiver acknowledgment sync.
- **Could Have**: Third-party device integration (Apple Watch).
- **Won't Have**: Automated ML-based predictive modeling (in Phase 1).
