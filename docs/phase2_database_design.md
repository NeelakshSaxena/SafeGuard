# SafeGuard: Database Design & Architecture

## 1. Entities & Data Dictionary

| Entity | Description | Attributes | Primary Key | Foreign Keys |
|--------|-------------|------------|-------------|--------------|
| `USERS` | Master user table | UserId, Email, PasswordHash, Role, CreatedAt | UserId | None |
| `ELDERLY` | Elderly profiles | ElderId, UserId, Name, DoB, Phone, Address | ElderId | UserId -> USERS |
| `CAREGIVER` | Caregiver profiles | CaregiverId, UserId, Name, Phone | CaregiverId | UserId -> USERS |
| `ASSIGNMENT`| Caregiver to Elderly link | AssignmentId, ElderId, CaregiverId | AssignmentId| ElderId, CaregiverId |
| `CHECK_IN` | Location check-ins | CheckInId, ElderId, Lat, Lng, Timestamp | CheckInId | ElderId -> ELDERLY |
| `HEALTH_EVENT`| Health logs | EventId, ElderId, EventType, Severity, Timestamp | EventId | ElderId -> ELDERLY |
| `MEDICATION` | Medication schedule | MedId, ElderId, MedName, Frequency, Active | MedId | ElderId -> ELDERLY |
| `MED_LOG` | Adherence logs | LogId, MedId, Taken, ScheduledTime | LogId | MedId -> MEDICATION |
| `GEOFENCE` | Safe zones | FenceId, ElderId, Lat, Lng, RadiusM | FenceId | ElderId -> ELDERLY |
| `ALERT` | Escalated events | AlertId, ElderId, AlertType, Severity, Status, Timestamp | AlertId | ElderId -> ELDERLY |
| `RISK_SCORE`| Analytics summary | ScoreId, ElderId, ScoreDate, OverallScore | ScoreId | ElderId -> ELDERLY |

## 2. Normalization Justification (3NF)
- **1NF**: No repeating groups. e.g., medications are separate rows in `MEDICATION`, not a comma-separated list in `ELDERLY`.
- **2NF**: No partial dependencies. Every table has a single-column primary key (auto-incremented), so non-key attributes depend on the entire key.
- **3NF**: No transitive dependencies. Caregiver name is in `CAREGIVER`, not in `ASSIGNMENT`. User auth data is in `USERS`.

## 3. Index Strategy
- `idx_checkin_elderid_time`: On `CHECK_IN(ElderId, Timestamp DESC)` -> Fast latest check-in retrieval.
- `idx_alert_elderid_status`: On `ALERT(ElderId, Status)` -> Fast pending alert queries.
- `idx_medlog_medid_time`: On `MED_LOG(MedId, ScheduledTime)` -> Fast adherence percentage calculations.
- `idx_assignment_caregiver`: On `ASSIGNMENT(CaregiverId)` -> Fast dashboard loading for caregivers.

## 4. Query Performance Strategy
- **Hot Query 1 (Dashboard Load)**: Retrieve all `ElderId` assigned to a caregiver, then fetch the latest `CHECK_IN` for each.
  *Optimization*: Ensure index on `CHECK_IN(ElderId, Timestamp DESC)`. Use `DISTINCT ON` or `ROW_NUMBER()` in PostgreSQL to grab the top 1 per ElderId.
- **Hot Query 2 (Risk Score Calculation)**: Retrieve 30 days of `CHECK_IN`, `HEALTH_EVENT`, `MED_LOG`.
  *Optimization*: Denormalize final scores into `RISK_SCORE` table run via cron job, rather than aggregating on the fly for every API call.
