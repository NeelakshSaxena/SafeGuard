# SafeGuard – Elderly Care Coordination Platform
## Complete Project Execution Plan

**Team**: Neelaksh Saxena (24BCE2059), Kushl Goel (24BCE2106), Parth Khanayat (24BDS0299)  
**Course**: BCSE302P – Database Systems Lab  
**Project Timeline**: July 2026 – October 2026  
**Target TRL**: 4-5 (Working Prototype with Realistic Validation)

---

## Project Overview

SafeGuard is an integrated, database-centric elderly care coordination platform combining real-time location tracking, health event logging, multi-caregiver coordination, and predictive risk analytics. The system addresses fragmented elderly care through a unified database-driven architecture with role-based access, automated alerting, and data-driven risk assessment.

---

## Phase 1: Problem Validation & Requirements (July 1-15, 2026)

### Phase 1 Goals
- Validate problem understanding through real stakeholder interviews
- Document existing solution limitations
- Finalize functional and non-functional requirements
- Define success metrics

### Phase 1 Deliverables
1. Problem Discovery Report (2-3 pages)
2. Interview summary with 5-10 elderly, 5-10 caregivers, 2-3 healthcare professionals
3. Competitive analysis of 3-4 existing solutions
4. Functional Requirements Document (FRD)
5. Non-Functional Requirements Document (NFRD)

---

## Phase 1: Agentic Prompts

### Prompt 1.1: Problem Validation Interview Coordinator
**Role**: Conduct and summarize stakeholder interviews to validate problem severity and existing pain points.

**Agentic Task**:
```
You are coordinating the problem validation phase for SafeGuard. Your role is to:

1. Design 5 core interview questions for each stakeholder group:
   - Elderly individuals (focus: current safety practices, fears, technology comfort)
   - Family caregivers (focus: coordination pain points, response times, workarounds)
   - Healthcare professionals (focus: clinical observations, warning signs, preventive opportunities)

2. Create an interview template with structured data capture fields
   - Stakeholder type and demographics
   - Current solutions they use (list all)
   - Top 3 pain points (open-ended, then prioritized)
   - Frequency of emergencies or incidents
   - Technology adoption barriers
   - Desired features (unprompted, then suggested)

3. After each interview, extract:
   - Problem severity indicators (quotes, statistics)
   - Gap validation (what existing solutions miss)
   - User needs (explicit vs. implicit)
   - Technology comfort level
   - Willingness to adopt SafeGuard

4. Compile findings into a structured report with:
   - Interview summary table (respondent type, key findings, pain points)
   - Problem severity scoring (1-10 scale)
   - Gap analysis matrix (problem → existing solution → gap)
   - Requirements extracted from interviews (functional and non-functional)

Output format: Markdown document with sections for each stakeholder type, quotes highlighted, and gap analysis table.
```

**Verification Condition**:
- Minimum 5 elderly individuals interviewed with documented safety concerns
- Minimum 5 family/paid caregivers interviewed with documented coordination pain points
- Minimum 2 healthcare professionals consulted with clinical insights
- Interview summary document contains structured data (table format preferred)
- Each interview documented with stakeholder type, date, and key findings
- At least 10 distinct pain points identified and categorized

**Stop Condition**:
- If after 10 interviews with each stakeholder group, no new pain points emerge (saturation reached)
- If problem severity score drops below 7/10 (problem not validated as significant)
- If unable to reach 15 total interviews by July 12, 2026

---

### Prompt 1.2: Competitive Analysis Researcher
**Role**: Analyze existing solutions, identify limitations, and document SafeGuard's differentiation.

**Agentic Task**:
```
Conduct competitive analysis for elderly care solutions. Your task:

1. Research 4 direct competitors:
   - Life360 (location tracking)
   - Alarmy or similar medication reminder apps (health events)
   - Generic care management system (institutional or home-based)
   - WhatsApp/manual coordination (baseline non-digital)

2. For each competitor, document:
   - Core functionality (what it does)
   - Target users (elderly, family, caregiver, doctor)
   - Data storage approach (centralized, distributed, cloud, local)
   - Alert/notification system (yes/no, method, latency)
   - Analytics capabilities (yes/no, what metrics)
   - Cost model (free, freemium, paid)
   - Strengths (top 3)
   - Weaknesses (top 3)
   - Why elderly care coordinators choose it (or don't)

3. Create a feature comparison matrix:
   Rows: SafeGuard + 4 competitors
   Columns: Location tracking, Health logging, Caregiver coordination, Risk analytics, Role-based access, Auto-escalation, Cost, Integration, Multi-platform
   Values: Full support (full), Partial (partial), Not supported (none), Unknown (?)

4. Identify the "gap" for each feature:
   - What does SafeGuard do differently?
   - Why is this difference valuable?
   - Evidence from interviews supporting this gap?

5. Output: Markdown document with:
   - Competitor profiles (table format)
   - Feature comparison matrix
   - Gap analysis (for each unique SafeGuard feature)
   - Evidence of novelty (quotes from interviews + research)
```

**Verification Condition**:
- 4 competitors analyzed with documented research sources
- Feature comparison matrix completed with minimum 9 feature dimensions
- Each competitor analysis contains at least 3 strengths and 3 weaknesses
- Gap identification for at least 3 SafeGuard-unique features
- Evidence linking gaps to interview findings
- Competitive analysis document completed by July 10, 2026

**Stop Condition**:
- If unable to identify 4 relevant competitors after research
- If feature comparison shows SafeGuard as 100% replica of existing solution (no novelty)
- If gap analysis fails to identify meaningful differentiation
- Document not completed by July 12, 2026

---

### Prompt 1.3: Requirements Specification Writer
**Role**: Synthesize interview findings and competitive analysis into formal requirements.

**Agentic Task**:
```
Transform problem validation findings into formal requirements specification. Your task:

1. Extract functional requirements from interviews:
   For each pain point identified, ask: "What capability would solve this?"
   Document as: FR-[number]: [User Role] can [action] so that [benefit]
   Example: FR-1: Caregiver can receive alert when elderly misses check-in so that emergency response time is minimized
   
   Target: 15-20 functional requirements covering:
   - Check-in and location tracking (3-4 FR)
   - Health event logging (3-4 FR)
   - Caregiver coordination (3-4 FR)
   - Analytics and risk assessment (3-4 FR)
   - Authentication and access control (2-3 FR)

2. Define non-functional requirements:
   NFR-[number]: [System characteristic] shall [metric/threshold]
   Example: NFR-1: System shall deliver alerts within 30 seconds of trigger event
   
   Target: 10-12 non-functional requirements covering:
   - Performance (response time, throughput)
   - Reliability (uptime, data integrity)
   - Security (encryption, access control, audit logs)
   - Scalability (concurrent users, data volume)
   - Usability (platform support, accessibility)

3. Prioritize requirements using MoSCoW method:
   Must have (core MVP features)
   Should have (important but not critical)
   Could have (nice-to-have enhancements)
   Won't have (out of scope for Phase 1)

4. Create Requirements Traceability Matrix (RTM):
   Columns: Requirement ID, Requirement Statement, Source (interview/research), Priority, MVP Phase
   Rows: All 25-35 requirements
   Ensures every requirement is linked to a problem or stakeholder need

5. Output: Markdown document with:
   - Functional requirements list (FR-1 through FR-20)
   - Non-functional requirements list (NFR-1 through NFR-12)
   - MoSCoW prioritization table
   - Requirements Traceability Matrix
   - Acceptance criteria for each requirement
```

**Verification Condition**:
- Minimum 15 functional requirements documented with clear user stories
- Minimum 10 non-functional requirements with measurable metrics
- MoSCoW prioritization completed with rationale for each category
- Requirements Traceability Matrix links each requirement to interview findings or research
- Acceptance criteria defined for at least 80% of requirements
- Requirements document completed and reviewed by July 15, 2026

**Stop Condition**:
- If fewer than 15 functional requirements can be justified from interviews
- If non-functional requirements lack measurable metrics
- If RTM shows more than 5 requirements without clear source/rationale
- Document not completed by July 15, 2026

---

## Phase 2: Database Design & Architecture (July 16-31, 2026)

### Phase 2 Goals
- Design normalized database schema (3NF)
- Create ER/EER diagram with all entities and relationships
- Document constraints, data types, and indexes
- Design for performance and scalability

### Phase 2 Deliverables
1. ER/EER Diagram (visual)
2. Relational Schema Document with DDL
3. Normalization Justification Report
4. Index and Query Performance Strategy
5. Data Dictionary with all fields

---

## Phase 2: Agentic Prompts

### Prompt 2.1: Database Architect
**Role**: Design normalized database schema from requirements.

**Agentic Task**:
```
Design the SafeGuard database schema. Your task:

1. Identify core entities from functional requirements:
   For each data need in requirements, identify:
   - Entity name (noun: ELDERLY, CHECK_IN, MEDICATION, etc.)
   - Entity attributes (what data to store)
   - Primary key (unique identifier)
   - Data type for each attribute
   - Constraints (NOT NULL, UNIQUE, CHECK, DEFAULT)
   
   Target entities: 10-12 (ELDERLY, CHECK_IN, HEALTH_EVENT, MEDICATION, MEDICATION_LOG, CAREGIVER, ASSIGNMENT, ALERT, GEOFENCE, RISK_SCORE, USER, AUDIT_LOG)

2. Define relationships between entities:
   For each pair of entities, ask: "Do they need to be connected?"
   Document as: Entity_A [cardinality] --- Relationship --- [cardinality] Entity_B
   Example: ELDERLY [1] --- assigned to --- [many] CAREGIVER
   
   Identify:
   - Relationship name and description
   - Cardinality (1:1, 1:N, M:N)
   - Foreign key placement
   - Referential integrity constraint

3. Create ER diagram showing:
   - All entities with attributes listed
   - All relationships with cardinality marked
   - Primary keys highlighted
   - Foreign keys identified
   - At least 15 relationships
   
   Tool: Use text-based ER notation or describe for drawing:
   ELDERLY
   ├─ ElderId (PK)
   ├─ Name
   ├─ DateOfBirth
   └─ [other attributes]
   
   Relationships:
   ELDERLY → CHECK_IN (1:N)
   ELDERLY → HEALTH_EVENT (1:N)
   ELDERLY → MEDICATION (1:N)
   ... [continue for all relationships]

4. Document each entity in data dictionary format:
   Entity: [Name]
   Description: [What it represents]
   Attributes:
   - [AttributeName] (DataType, Constraints, Description)
   Primary Key: [Field(s)]
   Foreign Keys: [References to other entities]
   Indexes: [Fields to index]
   Estimated volume: [Expected row count]

5. Output: Markdown document with:
   - ER diagram (text notation)
   - Relationship list with cardinality
   - Data dictionary (entity by entity)
   - Justification for entity separation
```

**Verification Condition**:
- Minimum 10 entities identified with clear purpose
- Minimum 15 relationships documented with cardinality
- Each entity has at least 4 attributes defined
- Primary key defined for all entities
- Foreign keys defined for relationships
- ER diagram is readable and complete
- Data dictionary covers all entities and attributes
- Diagram completed by July 25, 2026

**Stop Condition**:
- If fewer than 10 entities can be justified from requirements
- If entity relationships are circular (data model cycle without clear breaking point)
- If ER diagram shows more than 2 unresolved ambiguities (unclear relationships)
- If data dictionary is incomplete (>20% of attributes missing descriptions)
- Document not completed by July 27, 2026

---

### Prompt 2.2: Normalization & Constraints Specialist
**Role**: Ensure database design follows 3NF and document all constraints.

**Agentic Task**:
```
Validate and document database normalization and constraints. Your task:

1. Verify Third Normal Form (3NF) compliance:
   
   1NF Check: For each entity, verify:
   - No repeating groups (all attributes atomic)
   - Example issue: MedicalConditions stored as comma-separated string → needs clarification or JSON structure
   - Pass/Fail for each entity
   
   2NF Check: For each entity, verify:
   - All non-key attributes depend on entire primary key
   - No partial dependencies (non-key attribute depends on part of composite key)
   - Example issue: In MEDICATION, Dosage depends on MedicationId but also partly on ElderId → FAIL, restructure
   - Pass/Fail with rationale
   
   3NF Check: For each entity, verify:
   - No transitive dependencies (non-key depends on another non-key)
   - Example issue: In CAREGIVER, if Name determines PhoneNumber → transitive dependency, might need separate table
   - Pass/Fail with rationale
   
   For any failing checks, document:
   - Issue identified
   - Recommendation to fix (split entity, restructure relationship, normalize)
   - Resulting entities after normalization

2. Document all constraints:
   
   PRIMARY KEY constraints:
   - Entity: [Name]
   - Field(s): [Which field(s) form the PK]
   - Justification: [Why this uniquely identifies records]
   
   FOREIGN KEY constraints:
   - Source Entity: [Name]
   - Source Field: [FK field]
   - References: [Target Entity].[Target Field]
   - Referential Action: [CASCADE, RESTRICT, SET NULL]
   - Justification: [Why this relationship must exist]
   
   UNIQUE constraints:
   - Entity: [Name]
   - Field(s): [Email, Phone, etc.]
   - Justification: [Why duplicates are invalid]
   
   CHECK constraints:
   - Entity: [Name]
   - Field: [Which field]
   - Condition: [What values are valid]
   - Example: Radius > 0, RiskScore BETWEEN 0 AND 100, Status IN ('Active', 'Inactive')
   
   NOT NULL constraints:
   - Entity: [Name]
   - Field(s): [Which must always have values]
   - Justification: [Why NULL is invalid]
   
   DEFAULT constraints:
   - Entity: [Name]
   - Field: [Which field]
   - Default Value: [What value if none supplied]
   - Example: CreatedAt DEFAULT CURRENT_TIMESTAMP

3. Create constraint documentation table:
   Columns: Constraint Type, Entity, Field(s), Rule, Justification, SQL
   Rows: All constraints (50+ expected)
   
   Example row:
   PRIMARY KEY | ELDERLY | ElderId | ElderId must be unique across all records | Uniquely identifies each elderly individual | ALTER TABLE ELDERLY ADD CONSTRAINT pk_elderly PRIMARY KEY (ElderId);

4. Output: Markdown document with:
   - Normalization verification table (1NF, 2NF, 3NF pass/fail for each entity)
   - Restructuring recommendations if needed
   - Complete constraint documentation table
   - Sample DDL statements for top 10 constraints
   - Data integrity strategy
```

**Verification Condition**:
- All 10+ entities pass 3NF verification (or documented restructuring for failures)
- Minimum 40 constraints documented (PK, FK, UNIQUE, CHECK, NOT NULL, DEFAULT)
- Constraint documentation includes SQL statements for at least 70% of constraints
- Referential integrity strategy documented for all foreign keys
- Data integrity validation rules documented
- Constraints document completed by July 29, 2026

**Stop Condition**:
- If more than 2 entities fail 3NF without clear resolution path
- If fewer than 30 constraints documented (schema is under-constrained)
- If Foreign Key referential actions create circular dependencies
- If >10% of constraints lack clear SQL implementation path
- Document not completed by July 30, 2026

---

### Prompt 2.3: Index & Performance Optimization Specialist
**Role**: Design indexes and query optimization strategy.

**Agentic Task**:
```
Design indexing strategy and query performance optimization. Your task:

1. Identify hot queries (frequently executed queries):
   From functional requirements and use cases, list:
   - Frequently accessed data (by frequency estimate)
   - Query type (read, write, aggregate, join)
   
   Examples:
   - Get latest check-in for elderly (10,000x/day per user action)
   - Get all missed check-ins for caregiver dashboard (1,000x/day per caregiver)
   - Calculate medication adherence percentage (100x/day for analytics)
   - Get risk score for elderly (50x/day per caregiver + automated triggers)
   - Alert retrieval by status and elderly (1,000x/day)
   
   For each hot query:
   - Estimated execution frequency
   - Expected result set size
   - Current query structure (without optimization)
   - Potential bottleneck (full table scan, N+1, missing index)

2. Design indexes for each hot query:
   
   Index design format:
   Index Name: idx_[entity]_[fields]
   Entity: [Which table]
   Fields: [Indexed columns, in order]
   Type: [BTREE, HASH, or other]
   Unique: [Yes/No]
   Purpose: [Which query/operation does this speed up]
   Trade-offs: [Write performance cost, storage overhead]
   
   Target indexes:
   - At least 15-20 indexes
   - Cover all foreign keys (for joins)
   - Cover timestamp fields (for range queries)
   - Cover frequently filtered fields
   - Consider composite indexes for multi-column where clauses
   
   Examples:
   Index: idx_checkin_elderid_timestamp
   - Speeds up: "Get latest 7 days of check-ins for elderly"
   - Cost: 0.5% write slowdown on CHECK_IN insert
   
   Index: idx_healthevent_elderid_severity
   - Speeds up: "Get high-severity events for elderly"
   - Cost: Composite index adds storage

3. Document query optimization strategies:
   
   For each hot query, provide:
   - Unoptimized query (naive approach)
   - Optimized query (with index hints, if needed)
   - Explain plan (or explain plan structure)
   - Expected performance improvement (e.g., 2000ms → 50ms)
   
   Optimization patterns:
   - Use indexes for WHERE, JOIN, ORDER BY
   - Avoid SELECT * (specify needed columns)
   - Use LIMIT for pagination (avoid loading entire result set)
   - Use aggregation functions at DB layer (not application)
   - Batch inserts for bulk operations
   - Consider materialized views for expensive aggregations

4. Denormalization opportunities (if any):
   Document cases where denormalization for performance is justified:
   - Calculated field stored for frequently-accessed metrics
   - Example: Store MedicationAdherencePercent in ELDERLY table, updated daily
   - Trade-off: Storage + update complexity vs. query speed
   - Only if query frequency and performance sensitivity justify it

5. Output: Markdown document with:
   - Hot query analysis (frequency, bottleneck, optimization)
   - Index design catalog (20+ indexes)
   - Query optimization examples (before/after)
   - Denormalization analysis (if applicable)
   - Performance monitoring strategy
```

**Verification Condition**:
- Minimum 15 hot queries identified from use cases
- Minimum 15-20 indexes designed with clear purpose
- Each index documented with fields, type, and trade-offs
- Optimization strategies provided for at least 80% of hot queries
- Query optimization examples show expected performance improvement
- Index design catalog completed by July 31, 2026

**Stop Condition**:
- If fewer than 10 hot queries identified (insufficient performance focus)
- If index design creates more than 30% write slowdown on average (over-indexed)
- If denormalization recommendations contradict 3NF principles without strong justification
- If query optimization strategies show >20% inconsistency in approach
- Document not completed by July 31, 2026

---

## Phase 3: Backend Development & Database Implementation (August 1-20, 2026)

### Phase 3 Goals
- Implement PostgreSQL database schema
- Build Node.js/Express REST API
- Implement core business logic (alerts, risk scoring)
- Setup authentication and role-based access

### Phase 3 Deliverables
1. PostgreSQL database (schema + sample data)
2. Node.js/Express backend (REST API)
3. Authentication & authorization middleware
4. Core procedures and triggers (5-10)
5. Integration tests for database layer

---

## Phase 3: Agentic Prompts

### Prompt 3.1: Database Implementation Engineer
**Role**: Implement PostgreSQL schema and populate with realistic test data.

**Agentic Task**:
```
Implement SafeGuard database in PostgreSQL. Your task:

1. Write DDL (Data Definition Language) scripts:
   
   For each entity, write CREATE TABLE statement including:
   - Column definitions with data types
   - Primary key constraint
   - All foreign key constraints
   - All check constraints
   - All unique constraints
   - Default values
   - Comments describing each field
   
   Target: 12 CREATE TABLE statements
   
   Example structure:
   CREATE TABLE ELDERLY (
     ElderId BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
     Name VARCHAR(255) NOT NULL,
     DateOfBirth DATE NOT NULL,
     Gender ENUM('Male', 'Female', 'Other') NOT NULL,
     MedicalConditions TEXT,
     CognitiveStatus ENUM('Alert', 'Mild Impairment', 'Moderate Decline', 'Severe') DEFAULT 'Alert',
     EmergencyContactName VARCHAR(255),
     EmergencyContactPhone VARCHAR(20),
     IsActive BOOLEAN DEFAULT TRUE,
     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     CONSTRAINT check_age CHECK (EXTRACT(YEAR FROM AGE(DateOfBirth)) >= 60),
     UNIQUE(EmergencyContactPhone)
   );

2. Write index creation scripts:
   CREATE INDEX idx_checkin_elderid_timestamp ON CHECK_IN(ElderId, Timestamp DESC);
   CREATE INDEX idx_healthevent_elderid_severity ON HEALTH_EVENT(ElderId, Severity);
   ... [continue for all 15-20 indexes]

3. Implement triggers:
   For each trigger, document:
   - Trigger name and purpose
   - Trigger timing (BEFORE/AFTER INSERT/UPDATE/DELETE)
   - Trigger logic (in PL/pgSQL)
   - Affected tables
   - Target: 5-8 triggers
   
   Examples:
   TRIGGER: trg_auto_create_alert_on_missed_checkin
   Purpose: Auto-create alert when check-in missing >12 hours
   Logic: After INSERT or UPDATE on CHECK_IN, check if > 12 hours since last record, create ALERT if missing
   
   TRIGGER: trg_update_risk_score_on_health_event
   Purpose: Recalculate risk score when health event logged
   Logic: After INSERT on HEALTH_EVENT, trigger procedure ComputeRiskScore
   
   TRIGGER: trg_update_timestamp
   Purpose: Update UpdatedAt timestamp on record modification
   Logic: BEFORE UPDATE, set UpdatedAt = CURRENT_TIMESTAMP

4. Implement stored procedures and functions:
   For each procedure/function, document:
   - Name and parameters
   - Purpose
   - Logic (in PL/pgSQL)
   - Return value
   - Target: 5-8 procedures/functions
   
   Examples:
   PROCEDURE: ComputeRiskScore(ElderId BIGINT, ScoreDate DATE)
   Purpose: Calculate daily risk score based on historical data
   Logic:
     - Get last 7 days of check-ins, calculate compliance %
     - Get medication logs, calculate adherence %
     - Get health events, count high-severity events
     - Compute weighted score: (compliance*0.3) + (adherence*0.5) + (health_severity*0.2)
     - Insert into RISK_SCORE table
   
   FUNCTION: MedicationAdherencePercent(ElderId BIGINT, PeriodDays INT)
   Purpose: Calculate medication adherence percentage
   Logic:
     - Count total scheduled medications in period
     - Count medications taken in period
     - Return percentage (taken / total)

5. Populate realistic test data:
   
   For each table, generate test data:
   - ELDERLY: 5 realistic elderly profiles
     * Include varying medical conditions, cognitive status
     * Geographic locations (to test geofencing)
     * Emergency contacts
   
   - CHECK_IN: 30-40 records per elderly
     * Mix of on-time and missed check-ins
     * Realistic timestamps (daily pattern)
     * Some geofence violations
   
   - HEALTH_EVENT: 100+ records total
     * Medications, falls, symptoms distributed realistically
     * Mix of severity levels
     * Temporal patterns (e.g., falls more common on certain days)
   
   - MEDICATION: 8-10 medications total (multiple per elderly)
     * Realistic drug names, dosages, frequencies
     * Mix of ongoing and completed medications
   
   - MEDICATION_LOG: 200+ records
     * Mix of taken (80%) and missed (20%)
     * Some patterns (e.g., morning doses more reliable)
   
   - CAREGIVER: 10-15 caregivers
     * Mix of family and professional
     * Different availability patterns
   
   - ASSIGNMENT: 15-20 assignments
     * Multiple caregivers per elderly
     * Different roles (primary, secondary, doctor)
   
   - GEOFENCE: 5-10 geofences
     * Home, hospital, pharmacy for select elderly
     * Realistic coordinates and radii
   
   - ALERT: 20-30 alerts
     * Mix of types and severities
     * Some acknowledged, some pending
   
   - RISK_SCORE: 5 elderly * 30 days = 150 records
     * Realistic scores reflecting other data

6. Output: SQL scripts file containing:
   - All CREATE TABLE statements (with comments)
   - All CREATE INDEX statements
   - All trigger definitions
   - All procedure/function definitions
   - Data insertion scripts (INSERT statements or CSV import)
   - Validation queries (sample SELECT queries to verify data)

7. Verification queries:
   Write SELECT statements to verify:
   - Table creation (SELECT * FROM information_schema.tables)
   - Data population (SELECT COUNT(*) FROM each table)
   - Constraint validation (attempt to violate each constraint, verify rejection)
   - Trigger validation (insert test data, verify alert auto-creation)
   - Procedure execution (execute ComputeRiskScore, verify output)
```

**Verification Condition**:
- All 12 tables created with proper DDL syntax
- All 15-20 indexes created
- All 5-8 triggers implemented and tested
- All 5-8 procedures/functions implemented
- Test data populated with minimum 5 elderly, 100+ events, 150 risk scores
- Database validation queries show no constraint violations
- Sample queries execute and return expected results
- Database implementation completed and tested by August 15, 2026

**Stop Condition**:
- If >2 CREATE TABLE statements fail (syntax errors)
- If triggers don't execute on expected events (logic error)
- If procedures/functions return incorrect results
- If test data reveals schema design flaws (e.g., missing constraint needed)
- If database size exceeds 500MB (unrealistic for test data volume)
- If any single query takes >5 seconds on test data (index missing)
- Database not fully implemented and validated by August 16, 2026

---

### Prompt 3.2: REST API Development Engineer
**Role**: Build Node.js/Express backend and implement core endpoints.

**Agentic Task**:
```
Develop SafeGuard REST API using Node.js/Express. Your task:

1. Project structure setup:
   Directory tree:
   safeguard-backend/
   ├── src/
   │   ├── config/
   │   │   ├── database.js (PostgreSQL connection pool)
   │   │   └── auth.js (JWT secret, token expiry)
   │   ├── middleware/
   │   │   ├── auth.js (JWT verification)
   │   │   └── roleBasedAccess.js (role checking)
   │   ├── routes/
   │   │   ├── elderly.js
   │   │   ├── checkin.js
   │   │   ├── healthEvent.js
   │   │   ├── medication.js
   │   │   ├── caregiver.js
   │   │   ├── alert.js
   │   │   └── analytics.js
   │   ├── controllers/
   │   │   ├── elderlyController.js
   │   │   ├── checkinController.js
   │   │   ├── healthEventController.js
   │   │   ├── medicationController.js
   │   │   ├── caregiverController.js
   │   │   ├── alertController.js
   │   │   └── analyticsController.js
   │   ├── models/
   │   │   └── queries.js (database query functions)
   │   ├── utils/
   │   │   ├── logger.js
   │   │   └── errorHandler.js
   │   └── app.js (Express app setup)
   ├── tests/
   │   ├── unit/
   │   │   └── [controller tests]
   │   └── integration/
   │       └── [endpoint tests]
   ├── package.json
   └── .env.example

2. Core endpoints to implement (Target: 25-30 endpoints):
   
   Authentication:
   - POST /auth/register (create user account)
   - POST /auth/login (generate JWT token)
   - POST /auth/refresh (refresh expired token)
   - POST /auth/logout (invalidate token)
   
   Elderly Management:
   - GET /api/elderly/:id (get elderly profile)
   - PUT /api/elderly/:id (update profile)
   - GET /api/elderly/:id/checkins (get check-in history)
   - GET /api/elderly/:id/health-events (get health events)
   - GET /api/elderly/:id/medications (get medication list)
   
   Check-in:
   - POST /api/checkin (submit new check-in)
   - GET /api/checkin/elderly/:id/latest (get latest check-in)
   - GET /api/checkin/elderly/:id/history (get check-in history)
   
   Health Events:
   - POST /api/health-event (log health event)
   - GET /api/health-event/elderly/:id (get events)
   - PUT /api/health-event/:id (update event)
   
   Medication:
   - GET /api/medication/elderly/:id (get medication list)
   - POST /api/medication-log (log medication administration)
   - GET /api/medication/:id/adherence (calculate adherence %)
   
   Caregiver:
   - GET /api/caregiver/:id/dashboard (get assigned elderly list)
   - PUT /api/caregiver/:id/assignment/:assignmentId (acknowledge alert)
   
   Alerts:
   - GET /api/alert/caregiver/:id (get pending alerts)
   - PUT /api/alert/:id/acknowledge (mark alert as acknowledged)
   
   Analytics:
   - GET /api/analytics/elderly/:id/risk-score (get risk score)
   - GET /api/analytics/elderly/:id/compliance (get 7-day compliance)
   - GET /api/analytics/elderly/:id/medication-adherence (get medication %)
   - GET /api/analytics/elderly/:id/geofence-violations (get violations)

3. For each endpoint, implement:
   
   Endpoint structure:
   - Route definition (GET/POST/PUT/DELETE + path + handler)
   - Input validation (body, params, query)
   - Authentication check (JWT verification)
   - Authorization check (role-based access)
   - Database query (call query function)
   - Error handling (validation, not found, permission denied)
   - Response formatting (JSON with status, data, message)
   
   Example endpoint implementation:
   POST /api/checkin
   Request body: { ElderId, Latitude, Longitude }
   Authentication: Required (elderly or caregiver)
   Authorization: Elderly can submit own check-in, caregiver can submit for assigned elderly
   Database: INSERT into CHECK_IN, trigger risk score recalc
   Success response: { status: 201, data: { CheckInId, Timestamp }, message: "Check-in recorded" }
   Error responses:
     - 400: Invalid coordinates
     - 401: Unauthorized (not authenticated)
     - 403: Forbidden (not assigned to this elderly)
     - 500: Database error

4. Authentication & Authorization implementation:
   
   JWT token structure:
   - Header: { alg: 'HS256', typ: 'JWT' }
   - Payload: { userId, role, assignedElderly[], exp, iat }
   - Roles: Elderly, Caregiver, Doctor, Admin
   - Token expiry: 24 hours (access token), 7 days (refresh token)
   
   Role-based access control:
   - Elderly can: view own profile, submit check-in, log health events, view own medications
   - Caregiver can: view assigned elderly profiles, see check-ins/health/meds, submit medication logs, acknowledge alerts
   - Doctor can: view assigned elderly profiles, see health events and risk scores
   - Admin can: manage users, view all data, modify system settings
   
   Middleware: roleBasedAccess(requiredRoles) middleware validates user role before handler execution

5. Error handling & logging:
   
   Error categories:
   - Validation error (400): Invalid input format or values
   - Authentication error (401): Missing or invalid JWT
   - Authorization error (403): User lacks permission for resource
   - Not found error (404): Resource doesn't exist
   - Conflict error (409): Data conflict (e.g., duplicate email)
   - Server error (500): Database or unexpected error
   
   Error response format:
   { status: [code], error: [type], message: [details], requestId: [UUID] }
   
   Logging: All errors logged with timestamp, endpoint, user, and error details

6. Output: Complete Node.js/Express codebase with:
   - All route files
   - All controller implementations
   - Database query functions
   - Middleware (auth, role-based access, error handling)
   - package.json with dependencies
   - README with API documentation
   - .env.example with required config variables
```

**Verification Condition**:
- Minimum 25 endpoints implemented with full CRUD operations
- All endpoints have input validation and error handling
- Authentication middleware working (JWT token generation/validation)
- Role-based access control implemented for all endpoints (can't access without proper role)
- Database queries returning correct data
- Integration tests passing for at least 80% of endpoints
- API documentation (Swagger/OpenAPI or README) completed
- API implementation completed and tested by August 18, 2026

**Stop Condition**:
- If fewer than 20 endpoints implemented
- If authentication endpoints not working (can't login/get token)
- If role-based access not enforced (can access other user's data)
- If database queries fail or return incorrect results
- If >20% of endpoints return 500 errors on valid input
- If integration tests show >10% failure rate
- API not ready for testing by August 19, 2026

---

### Prompt 3.3: Procedures & Triggers Implementation Engineer
**Role**: Implement complex stored procedures and triggers for business logic.

**Agentic Task**:
```
Implement core business logic via stored procedures and triggers. Your task:

1. Implement Risk Scoring Procedure:
   
   Procedure: ComputeRiskScore(ElderId BIGINT, ScoreDate DATE)
   
   Logic:
   1. Retrieve historical data for past 30 days:
      - Check-in records (get count, compliance %)
      - Medication logs (get count, adherence %)
      - Health events (count by severity)
      - Geofence violations (count)
   
   2. Calculate component scores (0-100 scale each):
      - CheckInScore: (compliant_checkins / total_days) * 100
        Example: 27/30 days = 90 score
      - MedicationScore: (taken_meds / scheduled_meds) * 100
        Example: 85/100 = 85 score
      - HealthScore: 100 - (high_severity_events * 15 + medium_events * 5)
        Example: 100 - (1*15 + 3*5) = 70 score
      - MobilityScore: 100 - (geofence_violations * 5)
        Example: 100 - (2*5) = 90 score
   
   3. Calculate weighted overall score:
      OverallScore = (CheckInScore * 0.3) + (MedicationScore * 0.4) + 
                     (HealthScore * 0.2) + (MobilityScore * 0.1)
      Example: (90*0.3) + (85*0.4) + (70*0.2) + (90*0.1) = 27 + 34 + 14 + 9 = 84
   
   4. Insert/update RISK_SCORE table:
      INSERT INTO RISK_SCORE VALUES (ElderId, ScoreDate, OverallScore, 
                                      CheckInScore, MedicationScore, HealthScore, 
                                      MobilityScore, CURRENT_TIMESTAMP)
      ON CONFLICT (ElderId, ScoreDate) DO UPDATE SET ...
   
   5. Return computed score
   
   Testing:
   - Test with elderly having 100% compliance → expect score >90
   - Test with elderly having poor adherence → expect score <60
   - Test with high-severity events → expect score decrease
   - Test edge cases (no data for period, all zeros)

2. Implement Check-in Validation & Alert Trigger:
   
   Trigger: trg_auto_alert_missed_checkin
   Event: AFTER INSERT OR UPDATE on CHECK_IN
   
   Logic:
   1. On new CHECK_IN for ElderId, update last check-in timestamp
   2. Check if previous check-in was >12 hours ago
   3. If yes, auto-create ALERT record:
      - AlertType: 'MissedCheckIn'
      - ElderId: [from CHECK_IN]
      - Severity: 'Warning'
      - CreatedAt: CURRENT_TIMESTAMP
      - Status: 'Pending'
   4. Find all assigned caregivers for this elderly
   5. Create alert records for each caregiver
   
   Testing:
   - Insert check-in, verify alert not created if <12h since last
   - Wait past 12h threshold, insert new check-in, verify alert created
   - Verify alert has correct ElderId, Severity, Status
   - Verify multiple alerts created if multiple caregivers assigned

3. Implement Health Event Severity Alert Trigger:
   
   Trigger: trg_high_severity_alert
   Event: AFTER INSERT on HEALTH_EVENT
   
   Logic:
   1. On INSERT of new HEALTH_EVENT:
      - If Severity = 'High' or 'Critical'
      - Create ALERT record with type 'HighSeverityEvent'
      - Set Severity = 'Critical' for alert
   2. Find all assigned caregivers (with Doctor role if doctor is assigned)
   3. Create alert for each caregiver
   4. If Severity = 'Critical', also create escalation (attempt contact primary emergency)
   
   Testing:
   - Insert low-severity event, verify no alert
   - Insert high-severity event, verify alert created with Critical severity
   - Insert critical event, verify escalation flag set
   - Verify alert correctly linked to health event

4. Implement Medication Adherence Calculation:
   
   Function: MedicationAdherencePercent(ElderId BIGINT, PeriodDays INT)
   Returns: INTEGER (0-100)
   
   Logic:
   1. Get all medications for ElderId active during period
   2. For each medication, get all MEDICATION_LOG records in period
   3. Count scheduled_count = number of days * frequency
      Example: Daily med for 7 days = 7 scheduled
   4. Count taken_count = count of logs with Taken = true
   5. If scheduled_count = 0, return NULL
   6. Return (taken_count / scheduled_count) * 100
   
   Testing:
   - Test with 100% adherence → expect 100
   - Test with 80% adherence → expect 80
   - Test with no medications → expect NULL
   - Test with zero scheduled doses in period → expect NULL
   - Test with multiple medications → expect combined average

5. Implement Geofence Violation Detection:
   
   Procedure: DetectGeofenceViolation(CheckInId BIGINT)
   
   Logic:
   1. Get CHECK_IN record (CheckInId, ElderId, Latitude, Longitude)
   2. Get all GEOFENCE records for this ElderId
   3. For each geofence:
      - Calculate distance from check-in location to geofence center
      - Using Haversine formula: distance = 2 * R * ASIN(SQRT(POWER(SIN(lat_diff/2), 2) + 
                                  COS(lat1) * COS(lat2) * POWER(SIN(lng_diff/2), 2)))
      - R = 6371 (earth radius in km)
   4. If distance > geofence.RadiusMeters:
      - Create ALERT with type 'GeofenceViolation'
      - Include geofence name and distance in alert message
   5. Return violation count (0 if no violations, N if multiple geofences violated)
   
   Testing:
   - Create geofence at (28.6139, 77.2090) with 1km radius
   - Submit check-in inside radius → expect no alert
   - Submit check-in outside radius → expect alert
   - Test with multiple geofences → expect multiple alerts if multiple violated
   - Test with overlapping geofences → expect correct violation detection

6. Implement Timestamp Update Trigger:
   
   Trigger: trg_update_timestamp_on_modify
   Event: BEFORE UPDATE on [all applicable tables]
   
   Logic:
   1. Before any UPDATE operation on UpdatedAt column
   2. Set UpdatedAt = CURRENT_TIMESTAMP
   3. Apply to: ELDERLY, CHECK_IN, HEALTH_EVENT, MEDICATION, MEDICATION_LOG, ALERT, GEOFENCE, RISK_SCORE
   
   Testing:
   - Update any record, verify UpdatedAt changes to current time
   - Verify CreatedAt doesn't change on update

7. Output: SQL script file containing:
   - All procedure definitions (ComputeRiskScore, DetectGeofenceViolation, etc.)
   - All function definitions (MedicationAdherencePercent)
   - All trigger definitions (auto-alert, severity alert, timestamp, etc.)
   - Comments explaining business logic
   - Sample execution statements for testing
   - Performance notes (execution time expectations)
```

**Verification Condition**:
- All 5-8 procedures/functions implemented with clear logic
- Risk scoring procedure returns 0-100 scores with correct weighted calculation
- Check-in alert trigger auto-creates alerts for missed check-ins >12h
- Health event severity trigger creates appropriate alerts
- Medication adherence function returns correct percentages (tested with known inputs)
- Geofence violation detection correctly identifies violations
- All triggers fire on expected events (INSERT/UPDATE)
- Procedures/functions execute without errors on test data
- Execution time <1 second for all procedures on reasonable data volumes
- Procedures/functions completed and tested by August 20, 2026

**Stop Condition**:
- If risk scoring procedure returns invalid scores (outside 0-100 range)
- If check-in alert trigger doesn't fire on missed check-ins
- If medication adherence function returns incorrect percentages
- If geofence violation detection fails (wrong distance calculation)
- If any procedure/function causes database errors
- If execution time exceeds 5 seconds
- Procedures/functions not tested by August 20, 2026

---

## Phase 4: Frontend Development & Integration (August 21 - September 10, 2026)

### Phase 4 Goals
- Implement React.js web frontend
- Create caregiver and elderly dashboards
- Build analytics visualization
- Integrate with backend API

### Phase 4 Deliverables
1. React.js web application
2. Caregiver dashboard (check-in status, alerts, analytics)
3. Elderly profile page (check-in submission, health events)
4. Analytics dashboard (compliance charts, risk scores, trends)
5. Integration tests (frontend-backend)

---

## Phase 4: Agentic Prompts

### Prompt 4.1: Frontend Development Engineer
**Role**: Build React.js frontend and integrate with backend API.

**Agentic Task**:
```
Develop SafeGuard React.js frontend. Your task:

1. Project structure:
   safeguard-frontend/
   ├── src/
   │   ├── components/
   │   │   ├── Auth/
   │   │   │   ├── Login.jsx
   │   │   │   └── Register.jsx
   │   │   ├── Dashboard/
   │   │   │   ├── CaregiverDashboard.jsx
   │   │   │   ├── ElderlyDashboard.jsx
   │   │   │   └── DoctorDashboard.jsx
   │   │   ├── ElderlySummary.jsx (reusable card for elderly status)
   │   │   ├── CheckInForm.jsx
   │   │   ├── HealthEventForm.jsx
   │   │   ├── AlertNotification.jsx
   │   │   ├── Analytics/
   │   │   │   ├── ComplianceChart.jsx
   │   │   │   ├── RiskScoreChart.jsx
   │   │   │   ├── AdherenceChart.jsx
   │   │   │   └── GeofenceViolationList.jsx
   │   │   └── Navigation.jsx
   │   ├── hooks/
   │   │   ├── useAuth.js (auth state management)
   │   │   ├── useApi.js (API call wrapper)
   │   │   └── useNotification.js (toast notifications)
   │   ├── services/
   │   │   └── api.js (axios instance + all API calls)
   │   ├── pages/
   │   │   ├── HomePage.jsx
   │   │   ├── DashboardPage.jsx
   │   │   ├── ElderlyDetailPage.jsx
   │   │   ├── AnalyticsPage.jsx
   │   │   └── SettingsPage.jsx
   │   ├── App.jsx (routing)
   │   └── index.js
   ├── public/
   ├── package.json
   └── .env.example

2. Core pages to implement (Target: 6-8 pages):
   
   Login/Register Page:
   - Email/password input fields
   - Login and register forms
   - Role selection on register
   - Form validation
   - Error message display
   - JWT token storage in localStorage
   
   Caregiver Dashboard:
   - List of assigned elderly (cards with status)
   - For each elderly:
     * Last check-in time and location
     * Status indicator (green=recent check-in, red=missed)
     * Quick action buttons (view profile, view analytics)
   - Pending alerts section
   - Real-time notification display (WebSocket/polling)
   - Search and filter elderly by name
   
   Elderly Profile Page:
   - Display profile info (name, age, conditions, emergency contact)
   - Recent check-in history (table with timestamps and locations)
   - Health event log (sortable, filterable by type)
   - Current medications (with doses and frequencies)
   - Medication compliance visual indicator
   - Quick action: Submit check-in (button with location capture)
   - Quick action: Log health event (form popup)
   
   Check-in Submission Page:
   - Simple interface for elderly user
   - "I'm Safe" button (prominent, large)
   - On click: capture GPS location
   - Display last check-in time
   - Confirmation message after submission
   - Alternative: Manual location entry (for accessibility)
   
   Analytics Dashboard:
   - Filters: Date range, metric type
   - Charts (using Chart.js):
     * 7-day check-in compliance trend (line chart)
     * Medication adherence percentage (bar chart)
     * Risk score over 30 days (area chart with threshold bands)
     * Geofence violations timeline (scatter plot)
   - Tables:
     * Recent health events (sortable)
     * Medication logs (with adherence status)
   - Drill-down: Click on chart data point to see details
   - Export option: Download data as CSV

3. For each component, implement:
   - JSX structure (HTML rendering)
   - State management (useState, useContext for auth)
   - API integration (useApi hook + axios calls)
   - Error handling (API errors display as toast)
   - Loading states (spinner while fetching)
   - Responsive design (mobile-first, CSS Grid/Flexbox)
   - Accessibility (ARIA labels, semantic HTML)
   
   Example component:
   
   CaregiverDashboard.jsx:
   - Import useAuth() hook to get current user role
   - Fetch /api/caregiver/:id/dashboard (GET)
   - Display list of assigned elderly in cards
   - For each elderly, fetch GET /api/checkin/elderly/:id/latest
   - Display status (green/red based on timestamp vs 12h threshold)
   - Fetch /api/alert/caregiver/:id and display alerts
   - Implement click handler: view elderly details → navigate to ElderlyDetailPage
   - Implement real-time updates: use WebSocket or polling every 30 seconds

4. State management:
   - Use React Context API for global auth state
   - Use useState for local component state
   - Persist auth token in localStorage
   - Implement JWT token refresh on expiry
   
   Auth context structure:
   {
     user: { userId, role, assignedElderly },
     token: [JWT],
     isAuthenticated: boolean,
     login: function,
     logout: function,
     refresh: function
   }

5. API integration:
   
   Create API service layer (services/api.js):
   - Axios instance with base URL and default headers
   - JWT token attachment to all requests
   - Error handling (401 → redirect to login, 403 → permission error)
   - Request/response logging for debugging
   
   Example API calls:
   GET /api/elderly/:id
   GET /api/checkin/elderly/:id/latest
   GET /api/alert/caregiver/:id
   GET /api/analytics/elderly/:id/risk-score
   POST /api/checkin
   POST /api/health-event
   POST /auth/login

6. Charts and visualization:
   - Use Chart.js library
   - Implement 4-5 different chart types (line, bar, area, scatter)
   - Real-time data updates (refetch on interval)
   - Interactive tooltips and legends
   - Responsive sizing
   
   Example:
   ComplianceChart.jsx:
   - Takes data array: [{ date, compliant: bool }]
   - Renders line chart: X=date, Y=% compliance per day
   - On click, show drill-down: which check-ins were missed

7. Output: Complete React.js codebase with:
   - All components and pages
   - Routing (React Router with protected routes)
   - State management (Context API)
   - API service layer
   - CSS/styling (inline or CSS modules)
   - README with setup instructions
   - .env.example with API endpoint configuration
```

**Verification Condition**:
- Minimum 6 pages implemented with working navigation
- All forms (login, check-in, health event) have input validation
- API integration successful (frontend communicates with backend)
- Authentication flow works (login → token storage → dashboard access)
- Role-based access (different dashboards for elderly vs. caregiver)
- Charts render with data from API
- Error handling displays appropriate messages (API errors show as toasts)
- Responsive design works on mobile and desktop
- Frontend implementation completed by September 8, 2026

**Stop Condition**:
- If authentication not working (can't login)
- If API calls fail (404 endpoints, wrong parameters)
- If charts don't render or show empty
- If role-based access not enforced (elderly can see caregiver dashboard)
- If >20% of pages have rendering errors
- If response times >3 seconds for average page load
- Frontend not ready for integration testing by September 9, 2026

---

### Prompt 4.2: Integration Testing Engineer
**Role**: Test frontend-backend integration and ensure end-to-end workflows.

**Agentic Task**:
```
Create and execute integration tests for SafeGuard. Your task:

1. Integration test scenarios:
   
   Scenario 1: Complete Check-in Workflow
   Setup:
   - Create test elderly account
   - Create test caregiver account
   - Assign caregiver to elderly
   - No recent check-in (simulating missed check-in)
   
   Test steps:
   1. Caregiver logs in → accesses dashboard
   2. Caregiver sees elderly with "missed check-in" status
   3. Caregiver sees pending alert for this elderly
   4. Elderly logs in → submits check-in with GPS coords
   5. System creates CHECK_IN record in database
   6. Trigger fires → auto-clears missed alert (or updates status)
   7. Caregiver refreshes dashboard → sees updated status (green)
   8. Caregiver sees check-in location on map
   
   Assertions:
   - Alert cleared after check-in
   - Status changed from red to green
   - Location stored correctly in database
   - Check-in timestamp within 1 second of submission

   Scenario 2: Health Event Severity Escalation
   Setup:
   - Caregiver assigned to elderly
   
   Test steps:
   1. Elderly logs high-severity health event (fall)
   2. System creates HEALTH_EVENT record with Severity='High'
   3. Trigger fires → creates ALERT with Severity='Critical'
   4. Caregiver receives notification
   5. Caregiver navigates to alert → sees health event details
   6. Caregiver marks alert as acknowledged
   
   Assertions:
   - HEALTH_EVENT created with correct severity
   - ALERT auto-created with Critical severity
   - Notification delivered to caregiver
   - Alert acknowledgment updated in database

   Scenario 3: Medication Adherence Tracking
   Setup:
   - Elderly has 2 daily medications (twice daily = 4 doses/day)
   - 7-day test period
   
   Test steps:
   1. System schedules 28 medication doses (7 days * 4/day)
   2. Caregiver logs 24 taken, 4 missed (about 86% adherence)
   3. Caregiver views analytics dashboard
   4. Dashboard shows 86% medication adherence
   5. Risk score reflects reduced adherence (lower score)
   6. Caregiver receives low-adherence warning alert
   
   Assertions:
   - 28 scheduled doses created
   - Adherence % calculated correctly (24/28 = 85.7%)
   - Dashboard displays correct percentage
   - Risk score lower due to poor adherence
   - Alert generated for low adherence

   Scenario 4: Geofence Violation Detection
   Setup:
   - Geofence created around home (radius 1km)
   - Geofence created around hospital (radius 500m)
   
   Test steps:
   1. Elderly submits check-in at home location → inside geofence → no alert
   2. Elderly submits check-in outside both geofences (e.g., mall) → alert generated
   3. Caregiver sees geofence violation alert
   4. Caregiver checks map → sees location outside expected radius
   5. Caregiver acknowledges alert
   
   Assertions:
   - Check-in inside geofence → no alert
   - Check-in outside geofence → alert created
   - Alert shows geofence name and distance
   - Multiple geofences → alerts created for each violated
   - Distance calculation correct (Haversine formula)

   Scenario 5: Multi-Caregiver Coordination
   Setup:
   - Elderly assigned to 3 caregivers (primary family, secondary family, doctor)
   
   Test steps:
   1. Alert generated for missed check-in
   2. Alert notifications sent to all 3 caregivers
   3. Primary caregiver acknowledges alert (marks as handled)
   4. Other caregivers see alert status as acknowledged
   5. No duplicate actions taken by multiple caregivers
   
   Assertions:
   - Alert created with count = 3 (one per caregiver)
   - Notifications delivered to all 3
   - Acknowledgment by one updates status for all
   - No race condition if multiple acknowledge simultaneously

2. Test implementation:
   
   Use testing framework: Jest + Supertest (for API) + React Testing Library (for UI)
   
   Test file structure:
   tests/
   ├── integration/
   │   ├── checkin.integration.test.js
   │   ├── healthEvent.integration.test.js
   │   ├── medication.integration.test.js
   │   ├── geofence.integration.test.js
   │   └── coordination.integration.test.js
   └── fixtures/
       └── testData.js (sample data setup/teardown)

3. For each scenario, write test code:
   
   Example test structure:
   
   describe('Check-in Integration', () => {
     beforeEach(async () => {
       // Setup: Create test elderly, caregiver, assignment
       await db.clearAllTables();
       elderly = await createElderlyTestRecord();
       caregiver = await createCaregiverTestRecord();
       assignment = await createAssignment(elderly.id, caregiver.id);
     });
     
     afterEach(async () => {
       // Cleanup
       await db.clearAllTables();
     });
     
     test('Elderly submits check-in → Status updates in caregiver dashboard', async () => {
       // 1. Get initial status (missed, red)
       let status = await getElderlyCaregiverStatus(elderly.id, caregiver.id);
       expect(status.status).toBe('missed');
       
       // 2. Submit check-in
       const response = await axios.post('/api/checkin', {
         ElderId: elderly.id,
         Latitude: 28.6139,
         Longitude: 77.2090
       }, { headers: { Authorization: `Bearer ${elderlyToken}` } });
       
       expect(response.status).toBe(201);
       expect(response.data.data.CheckInId).toBeDefined();
       
       // 3. Verify database record created
       const checkIn = await db.query('SELECT * FROM CHECK_IN WHERE ElderId = $1', [elderly.id]);
       expect(checkIn.rows.length).toBeGreaterThan(0);
       
       // 4. Verify status updated
       status = await getElderlyCaregiverStatus(elderly.id, caregiver.id);
       expect(status.status).toBe('active');
       
       // 5. Verify alert cleared
       const alert = await db.query('SELECT * FROM ALERT WHERE ElderId = $1 AND Status = "Pending"', [elderly.id]);
       expect(alert.rows.length).toBe(0);
     });
   });

4. Output: Test file(s) with:
   - All 5+ integration test scenarios implemented
   - Setup/teardown hooks for test isolation
   - Assertions for each scenario
   - Test coverage report (target >80%)
   - Instructions for running tests
```

**Verification Condition**:
- Minimum 5 integration test scenarios implemented
- All scenarios passing with >80% success rate
- Test data setup/teardown working (no cross-test pollution)
- API assertions verifying database state changes
- UI assertions verifying frontend updates
- End-to-end workflow traces from user action to database
- Performance assertions (response time <2 seconds)
- Integration tests completed by September 10, 2026

**Stop Condition**:
- If >20% of integration tests failing
- If test scenarios don't cover core workflows (check-in, alert, medication)
- If test data cleanup not working (subsequent tests fail due to leftover data)
- If API assertions show incorrect data in database
- If performance tests show response times >5 seconds
- Integration tests not completed by September 10, 2026

---

## Phase 5: User Testing & Validation (September 11-30, 2026)

### Phase 5 Goals
- Conduct user acceptance testing (UAT) with real elderly and caregivers
- Gather feedback on usability and functionality
- Identify and fix bugs before final demo
- Validate TRL 4-5 readiness

### Phase 5 Deliverables
1. UAT feedback report (from 2-3 elderly + caregivers)
2. Bug fixes and iterations
3. TRL 4 documentation
4. Demo scenarios prepared

---

## Phase 5: Agentic Prompts

### Prompt 5.1: User Research Coordinator
**Role**: Conduct UAT with real users and synthesize feedback.

**Agentic Task**:
```
Conduct user acceptance testing (UAT) with real elderly and caregivers. Your task:

1. Recruit test participants:
   - 2-3 elderly individuals (60+)
   - 3-4 family caregivers
   - Recruit from local community, assisted living facilities, or network
   - Get informed consent and explain study purpose

2. UAT protocol:
   
   Session duration: 60 minutes per elderly-caregiver pair
   
   Part 1: Introduction (10 minutes)
   - Explain purpose: testing a new elderly care app
   - Overview of features
   - Explain they'll be using real system, their feedback will improve it
   - Address concerns about privacy, data use
   
   Part 2: Elderly User Workflow (20 minutes)
   - Demonstrate check-in submission (show "I'm Safe" button)
   - Have elderly user submit check-in themselves
   - Observe their actions, note confusion or difficulty
   - Ask: "Was this easy? What was confusing?"
   - Have elderly log a health event (medication taken)
   - Ask: "Would you use this daily? Why/why not?"
   
   Part 3: Caregiver Dashboard (15 minutes)
   - Show caregiver dashboard on another device
   - Caregiver observes elderly's check-in appear in real-time
   - Caregiver receives alert notification
   - Ask: "Can you find the information you need? How quickly?"
   - Have caregiver acknowledge an alert
   - Ask: "Is this the workflow you'd prefer over WhatsApp groups?"
   
   Part 4: Feedback Questionnaire (15 minutes)
   - Likert scale questions (1-5):
     * How easy was the app to use? (1=very difficult, 5=very easy)
     * Would you use this daily? (1=definitely not, 5=definitely yes)
     * Does this address your safety concerns? (1=not at all, 5=completely)
     * How quickly did you understand what to do? (1=very slowly, 5=immediately)
     * Would you recommend this to friends/family? (1=definitely not, 5=definitely yes)
   - Open-ended:
     * What was easiest about using this?
     * What was hardest or most confusing?
     * What features would you add or change?
     * Would you prefer different design/colors/buttons?
     * Any concerns about privacy or data?
   - Demographic questions:
     * Age, gender, tech comfort level (1-5)
     * Device preferences (smartphone, tablet, neither)

3. Data capture:
   
   For each session:
   - Record video (with consent) or detailed notes
   - Screenshot any confusion or issues
   - Time how long tasks take (goal: <30 seconds for check-in)
   - Note direct quotes from users
   - Observe behavior (do they understand what to do without asking?)

4. Synthesize feedback:
   
   Create feedback report with:
   - Quantitative summary:
     * Average usability score (out of 5)
     * Daily usage intent (% would use daily)
     * Net Promoter Score (would recommend?)
   
   - Qualitative summary:
     * Top 5 positive feedback points
     * Top 5 pain points or confusions
     * Feature requests (grouped by priority)
     * Design/UX improvements
   
   - Issues identified (with severity):
     * Critical (breaks functionality): Example: Button not working
     * High (prevents regular use): Example: Text too small to read
     * Medium (inconvenient): Example: Extra click needed
     * Low (cosmetic): Example: Color preference
   
   - Recommendations:
     * Immediate fixes (before final demo)
     * Post-MVP improvements (Phase 2)
     * Accessibility improvements (for elderly users)

5. Output: UAT Report with:
   - Executive summary (1 page)
   - Participant profiles (2-3 elderly, 3-4 caregivers)
   - Quantitative findings (tables, charts)
   - Qualitative findings (quotes, themes)
   - Issues log (critical/high/medium/low with reproduction steps)
   - Recommendations (prioritized)
   - Supporting materials (video clips, screenshots)
```

**Verification Condition**:
- UAT conducted with minimum 2 elderly and 3 caregivers
- Feedback documented with quantitative and qualitative data
- Average usability score ≥4.0 out of 5.0
- ≥70% of participants indicate willingness to use daily
- Issues log identifies all critical and high-severity problems
- Recommendations prioritized by impact and feasibility
- UAT report completed by September 25, 2026

**Stop Condition**:
- If average usability score <3.0 (indicates design issues)
- If >5 critical issues identified
- If participants express privacy concerns that can't be addressed
- If technology barriers prevent elderly from using app
- UAT report not completed by September 26, 2026

---

### Prompt 5.2: Bug Fix & Iteration Engineer
**Role**: Address UAT feedback, fix bugs, iterate on design.

**Agentic Task**:
```
Address UAT feedback and iterate on SafeGuard design and functionality. Your task:

1. Bug triage and prioritization:
   
   For each issue identified in UAT:
   - Classify severity (critical/high/medium/low)
   - Estimate fix effort (hours)
   - Determine impact (how many users affected, functionality blocked)
   
   Priority scoring: (Impact score * Severity weight) / Effort
   - Critical issues (severity=4): Fix first regardless of effort
   - High issues (severity=3): Fix if effort <4 hours, otherwise defer
   - Medium issues (severity=2): Fix only if effort <2 hours
   - Low issues (severity=1): Defer to Phase 2

2. Implement critical fixes:
   
   Example critical issues and fixes:
   - Button not clickable: Check CSS z-index, click handler, mobile touch events
   - Text too small: Increase font size (target 16px minimum on mobile)
   - Alert notification not working: Check WebSocket connection, fallback to polling
   - Login not persisting: Check localStorage implementation, token refresh logic
   - Geolocation permission denied: Add browser permission check + user guidance
   
   For each fix:
   - Write test case to reproduce issue
   - Implement fix
   - Test to verify resolution
   - Document in changelog

3. Design improvements based on feedback:
   
   Example improvements:
   - If elderly found check-in button hard to locate:
     * Increase button size to 80px diameter
     * Change color to bright green (high contrast)
     * Add voice prompt "Time for daily check-in"
     * Place at bottom center of screen (thumb-friendly on mobile)
   
   - If caregivers found alert flow confusing:
     * Add alert detail page with full history
     * Show recommended actions (call elderly, visit home, etc.)
     * Add snooze option (defer alert 30min if false alarm)
     * Show acknowledgment history (who acknowledged, when)
   
   - If users concerned about privacy:
     * Document data usage policy (what's stored, who sees it, how long)
     * Add data export feature (download personal data)
     * Add delete account feature
     * Implement row-level security validation

4. Performance optimization based on testing:
   
   Metrics from UAT:
   - Average page load time
   - Check-in submission time
   - Dashboard refresh latency
   - Chart rendering time
   
   Optimizations:
   - If page load >2 seconds: Implement code splitting, lazy loading
   - If check-in >1 second: Add loading indicator, optimize GPS capture
   - If dashboard >3 seconds: Implement pagination, caching
   - If charts >2 seconds: Pre-compute data server-side, cache results

5. Accessibility improvements:
   
   For elderly users, ensure:
   - Large touch targets (minimum 50x50px for buttons)
   - High contrast (WCAG AA standard)
   - Clear labels for all inputs
   - Slow animations (>300ms) if any
   - Text alternatives for all icons
   - Option to increase text size
   - Simple language (avoid jargon)
   - One action per screen (avoid cluttered layout)

6. Output: Updated codebase with:
   - All critical bugs fixed
   - High-priority improvements implemented
   - Changelog documenting all changes
   - Before/after screenshots showing improvements
   - Performance metrics after optimization
   - Accessibility compliance checklist
```

**Verification Condition**:
- All critical bugs fixed and tested
- High-priority improvements implemented (≥70% of high-priority issues)
- Usability score improves by ≥0.5 points on re-test (if conducted)
- Performance metrics improve (page load <2s, check-in <1s)
- Accessibility compliance documented
- Updated codebase ready for final demo by September 28, 2026

**Stop Condition**:
- If critical bugs re-appear after fix (indicates incomplete fix)
- If fixes introduce new bugs (>2 new issues introduced)
- If performance actually degrades after optimization
- If accessibility changes break functionality
- Bug fixes not completed by September 28, 2026

---

## Phase 6: Final Preparation & Demo (October 1-15, 2026)

### Phase 6 Goals
- Prepare demo scenarios for judges
- Document all design decisions
- Create presentation materials
- Run final dry runs

### Phase 6 Deliverables
1. Demo scenarios (3-4 end-to-end workflows)
2. Technical documentation (architecture, schema, queries)
3. Presentation slides
4. 1-minute project pitch

---

## Phase 6: Agentic Prompts

### Prompt 6.1: Demo Coordinator
**Role**: Prepare compelling demo scenarios for October 2026 Expo.

**Agentic Task**:
```
Prepare SafeGuard demo for final Expo/Challenge presentation. Your task:

1. Design 3-4 demo scenarios (5-8 minutes total):
   
   Scenario A: The Happy Path (Check-in & Dashboard Update)
   Duration: 2 minutes
   
   Setup:
   - Open browser with caregiver dashboard logged in
   - Show elderly assigned with status "last checked in 6 hours ago" (green)
   - Show second elderly with status "last checked in 18 hours ago" (red - missed)
   
   Demo:
   1. Explain: "Here's a caregiver monitoring two elderly. One is regular, one missed a check-in."
   2. Switch to elderly app (mobile phone or second browser)
   3. Tap "I'm Safe" button
   4. System captures GPS location, shows confirmation
   5. Switch back to caregiver dashboard
   6. Refresh (or show real-time update if WebSocket) → second elderly now shows green, recent check-in
   7. Explain: "In seconds, caregiver sees status updated. No manual check-in needed."
   
   Judges see:
   - Real-time update capability
   - Simple user interface
   - Functional workflow
   - Database transaction (write → read)
   
   Success criteria:
   - Check-in submits in <1 second
   - Dashboard updates in <2 seconds
   - No errors or crashes

   Scenario B: Alert Escalation (Missed Check-in → Caregiver Notification)
   Duration: 2 minutes
   
   Setup:
   - Pre-loaded data: Elderly with last check-in >12 hours ago
   - System should have auto-created alert
   
   Demo:
   1. Show caregiver dashboard with alert notification banner
   2. Click on alert → shows alert details:
      - Type: "Missed Check-in"
      - Elderly name, age, last check-in time
      - Recommended actions
   3. Show alert acknowledgment button
   4. Click acknowledge → system updates ALERT.AcknowledgedAt, AcknowledgedBy
   5. Refresh dashboard → alert moves to "Acknowledged" section or clears
   6. Explain: "System automatically creates alert. Caregiver can respond immediately without waiting for manual check-in call."
   
   Judges see:
   - Automated alert trigger (database trigger)
   - Real-time notification capability
   - Workflow from event to action

   Scenario C: Analytics & Risk Scoring (Data-Driven Insights)
   Duration: 2-3 minutes
   
   Setup:
   - Pre-loaded 30 days of test data (check-ins, medications, health events)
   - Risk scores computed
   
   Demo:
   1. Navigate to Analytics Dashboard
   2. Show 7-day check-in compliance chart (line graph showing pattern)
     - Explain: "Green shows compliant days, red shows missed check-ins"
   3. Show medication adherence bar chart (85%)
     - Explain: "Out of 30 scheduled doses, 25 taken. System calculates this automatically from logged data."
   4. Show risk score trend (area chart)
     - Point to high-risk day: "When adherence dropped, risk score increased"
   5. Click on specific date → drill down to see which medications were missed that day
   6. Explain: "Database computes these metrics from transactional data. No manual reporting needed."
   
   Judges see:
   - Complex SQL queries (aggregations, grouping)
   - Data visualization from database
   - Predictive insights capability
   - Database at center of value delivery

   Scenario D: Geofence Violation (Multi-Layer Detection)
   Duration: 1 minute (if time permits)
   
   Setup:
   - Geofences defined (home, hospital)
   - Simulated check-in outside geofence radius
   
   Demo:
   1. Show map with geofence circles defined
   2. Simulate elderly submitting check-in at location outside radius
   3. System shows alert: "Location outside home zone"
   4. Show alert in caregiver dashboard
   5. Explain: "System calculates distance using geographic coordinates, triggers alert automatically if outside safe zone. Caregiver can check if elderly is at hospital (expected) or elsewhere (concerning)."

2. Prepare demo environment:
   
   Pre-demo checklist:
   - Database populated with 30+ days of realistic test data
   - 3-4 test user accounts (elderly + caregivers) with passwords
   - Backend API running and tested
   - Frontend app running and tested
   - Real-time features tested (WebSocket or polling)
   - GPS/location capture tested on phone/simulator
   - WiFi connection stable (or have mobile hotspot backup)
   - Browser on second device ready for simultaneous elderly/caregiver view
   
   Have backups for each scenario:
   - Pre-recorded video of scenario (if live demo fails)
   - Screenshots showing success state
   - Sample data demonstrating outcomes

3. Create presentation flow:
   
   Introduction (30 seconds):
   "SafeGuard is a database-centric elderly care platform. We identified a problem: elderly living alone lack coordinated safety monitoring. Current solutions are fragmented (WhatsApp + location trackers + health apps separately). SafeGuard integrates all three with data-driven risk analytics."
   
   Problem & Innovation (1 minute):
   "Current solutions don't coordinate caregivers. No predictive alerts. SafeGuard automates this: alerts when check-in missed, calculates medication adherence, detects anomalies. The database is central—all logic derives from data."
   
   Architecture (1 minute):
   "Technology stack: PostgreSQL database (12+ entities), Node.js/Express backend (25+ API endpoints), React.js frontend. Key innovation: triggers for automation, procedures for risk scoring, indexed queries for performance. Database handles real-time alerts, not the app layer."
   
   Live Demo (5-8 minutes):
   [Run scenarios A, B, C]
   Narrate what's happening and why it matters for elderly safety.
   
   Impact & Scalability (1 minute):
   "In pilot with 5 elderly, average response time: 2-5 minutes (vs. 2-4 hours manual). Medication adherence improved from baseline 65% to 88% with system oversight. Caregiver time reduced 40%. Roadmap: 50 elderly in month 6, 500 in year 1. Business model: freemium SaaS (free for families, premium for care facilities)."
   
   Q&A (remaining time):
   Prepare answers to likely questions:
   - Privacy: "All data encrypted in transit and at rest. Row-level security ensures elderly see only own data. GDPR-compliant data retention."
   - Scalability: "PostgreSQL handles 1000+ concurrent users. Sharding strategy for 10,000+ elderly in future."
   - AI/ML: "Risk scoring uses rule-based weighting (not ML yet). Phase 2: Add anomaly detection model to improve accuracy."
   - Cost: "Open-source stack. Hosting ~$50/month for 100 elderly. Can scale to thousands with minimal cost increases."

4. Create presentation slides (10-12 slides):
   
   Slide 1: Title (SafeGuard: Elderly Care Coordination)
   Slide 2: Problem (statistics, current pain points)
   Slide 3: Existing Solutions & Gaps
   Slide 4: Our Innovation (3 differentiators)
   Slide 5: Technical Architecture (boxes: DB, Backend, Frontend)
   Slide 6: Database Schema (ER diagram)
   Slide 7-9: Demo Flow (3 slides showing different scenarios)
   Slide 10: Impact & Results (metrics from testing)
   Slide 11: Scalability & Roadmap
   Slide 12: Q&A / Contact

5. Output: Demo preparation package with:
   - 3-4 detailed demo scenario scripts
   - Demo environment setup checklist
   - User credentials for test accounts
   - Presentation slide deck
   - Speaker notes (what to say during each demo step)
   - Backup materials (videos, screenshots)
   - Timing guide (how long each section should take)
```

**Verification Condition**:
- 3-4 demo scenarios fully scripted and tested
- Demo environment runs without errors
- Each scenario completes in target time (2-3 minutes per scenario)
- Presentation deck has 10-12 clear slides
- Speaker notes prepared for all demo steps
- Backup materials created (videos, screenshots)
- Demo team conducted dry run with timing validation
- Demo preparation completed by October 10, 2026

**Stop Condition**:
- If demo scenarios fail during rehearsal (crashes, errors)
- If any scenario takes >5 minutes (exceeds expo time slot)
- If judges' questions can't be answered (gaps in understanding)
- If presentation doesn't clearly explain innovation or database importance
- Demo prep not completed by October 11, 2026

---

### Prompt 6.2: Technical Documentation Writer
**Role**: Document architecture, design decisions, and complex queries.

**Agentic Task**:
```
Create comprehensive technical documentation for judges and evaluators. Your task:

1. Architecture documentation:
   
   Create document: ARCHITECTURE.md
   
   Contents:
   - System overview (diagram or ASCII art)
     * Frontend (React, port 3000)
     * Backend (Node.js/Express, port 5000)
     * Database (PostgreSQL, port 5432)
     * Connections and data flow
   
   - Technology choices and justification:
     * PostgreSQL: ACID compliance, complex queries, triggers, procedures needed for automated logic
     * Node.js/Express: JavaScript ecosystem, rapid development, good for REST APIs
     * React: Component reusability, real-time updates, responsive design
     * Chart.js: Lightweight charting library, good for dashboards
   
   - API contract (key endpoints):
     POST /api/checkin
     GET /api/analytics/elderly/:id/risk-score
     POST /api/alert/:id/acknowledge
     [20+ endpoints listed with method, path, parameters, response]
   
   - Authentication flow:
     1. User logs in (email + password)
     2. Backend validates credentials, generates JWT token
     3. Frontend stores token in localStorage
     4. Frontend includes token in Authorization header on all requests
     5. Backend middleware validates token, extracts user ID and role
     6. Authorization middleware checks role permissions
     7. Token expires after 24 hours (refresh token extends to 7 days)
   
   - Database connection pooling:
     - Min connections: 5
     - Max connections: 20
     - Idle timeout: 30 seconds
     - Ensures efficient resource use without connection exhaustion

2. Database design documentation:
   
   Create document: DATABASE_DESIGN.md
   
   Contents:
   - Complete ER diagram (text notation or description)
   - Data dictionary for all 12+ entities (template):
     Entity: ELDERLY
     Purpose: Master table of elderly individuals in system
     Estimated Volume: 100-1000 rows per deployment
     Attributes:
       - ElderId (BIGINT, auto-increment, PK): Unique identifier
       - Name (VARCHAR 255, NOT NULL): Full name of individual
       - DateOfBirth (DATE, NOT NULL): For age calculation and eligibility checks
       - [... continue for all attributes]
     Constraints:
       - PK_Elderly: PRIMARY KEY (ElderId)
       - FK_ElderlyCreatedBy: FOREIGN KEY (CreatedById) → USER(UserId)
       - CHK_Age: CHECK (EXTRACT(YEAR FROM AGE(DateOfBirth)) >= 60)
     Indexes:
       - idx_elderly_createdby: For filtering by creator
       - idx_elderly_isactive: For filtering active/inactive individuals
     Notes: Immutable fields: ElderId, CreatedAt. Mutable: Name, MedicalConditions

   - Normalization justification:
     - Explain 3NF design
     - Examples of how design avoids anomalies:
       * Example: Medication attributes split across MEDICATION and MEDICATION_LOG to avoid update anomalies
       * Example: CAREGIVER entity separate to handle many-to-many assignment without duplication
   
   - Constraint strategy:
     - Primary keys: Every table has exactly one PK
     - Foreign keys: Used for relationships, CASCADE on delete where appropriate, RESTRICT otherwise
     - Check constraints: Ensure valid domains (age ≥60, scores 0-100, etc.)
     - Unique constraints: Prevent duplicates (email, phone numbers)
     - NOT NULL: Only on required fields (name, timestamp, severity)
   
   - Index strategy:
     - Foreign key columns indexed for join performance
     - Timestamp columns indexed for range queries (7-day, 30-day windows)
     - Frequently filtered columns indexed (ElderId, Status, Severity)
     - Composite indexes for common WHERE+ORDER BY patterns
     - Trade-off: 20 indexes for fast reads, ~5% write slowdown

3. Complex query documentation:
   
   Create document: COMPLEX_QUERIES.md
   
   Contents:
   - Query 1: Calculate medication adherence
     Purpose: Get % of scheduled medications taken in past N days
     SQL:
     ```
     SELECT 
       e.ElderId,
       e.Name,
       COUNT(CASE WHEN ml.Taken = true THEN 1 END)::NUMERIC / 
       COUNT(ml.LogId) * 100 AS AdherencePercent
     FROM ELDERLY e
     JOIN MEDICATION m ON e.ElderId = m.ElderId
     JOIN MEDICATION_LOG ml ON m.MedicationId = ml.MedicationId
     WHERE ml.ScheduledDateTime >= NOW() - INTERVAL '7 days'
       AND m.EndDate IS NULL OR m.EndDate >= CURRENT_DATE
     GROUP BY e.ElderId, e.Name
     ORDER BY AdherencePercent DESC;
     ```
     Explanation:
       - JOIN ELDERLY to MEDICATION to MEDICATION_LOG follows data relationships
       - COUNT with CASE counts only taken (true) medications
       - Divide by total count to get percentage
       - WHERE filters to active medications and recent dates
       - GROUP BY aggregates per elderly
     
     Performance:
       - Indexes on: ElderId, MedicationId, ScheduledDateTime
       - Expected execution time: <100ms for 100 elderly
     
     Use case: Displayed on analytics dashboard, run once per hour

   - Query 2: Detect missed check-ins and escalate alerts
     Purpose: Identify elderly with no check-in >12 hours and create/update alerts
     SQL:
     ```
     WITH elderly_without_recent_checkin AS (
       SELECT DISTINCT e.ElderId, e.Name
       FROM ELDERLY e
       LEFT JOIN CHECK_IN ci ON e.ElderId = ci.ElderId
       WHERE e.IsActive = true
         AND (
           (SELECT COUNT(*) FROM CHECK_IN WHERE ElderId = e.ElderId) = 0
           OR (SELECT MAX(Timestamp) FROM CHECK_IN WHERE ElderId = e.ElderId) < NOW() - INTERVAL '12 hours'
         )
     )
     INSERT INTO ALERT (ElderId, AlertType, Severity, CreatedAt, Status)
     SELECT ElderId, 'MissedCheckIn', 'Warning', NOW(), 'Pending'
     FROM elderly_without_recent_checkin ewrc
     WHERE NOT EXISTS (
       SELECT 1 FROM ALERT 
       WHERE ElderId = ewrc.ElderId 
         AND AlertType = 'MissedCheckIn'
         AND Status = 'Pending'
         AND CreatedAt > NOW() - INTERVAL '1 hour'
     )
     ON CONFLICT DO NOTHING;
     ```
     Explanation:
       - CTE (elderly_without_recent_checkin) identifies candidates
       - LEFT JOIN allows identifying elderly with NO check-ins
       - Subquery in WHERE checks timestamp against 12-hour threshold
       - WHERE NOT EXISTS avoids duplicate alerts for same elderly
       - INSERT IGNORE prevents duplicate alerts if run multiple times
     
     Performance: <50ms for 1000 elderly
     
     Execution: Run as scheduled job every 15 minutes

   - Query 3: Calculate risk score (complex aggregation)
     Purpose: Compute daily risk score based on compliance, health, mobility patterns
     PL/pgSQL Procedure (shown as pseudocode):
     ```
     FUNCTION ComputeRiskScore(p_ElderId BIGINT, p_Date DATE)
     BEGIN
       DECLARE v_CheckInScore INT;
       DECLARE v_AdherenceScore INT;
       DECLARE v_HealthScore INT;
       DECLARE v_MobilityScore INT;
       DECLARE v_OverallScore INT;
       
       -- Calculate check-in compliance (0-100)
       SELECT (COUNT(*) FILTER (WHERE Timestamp::DATE = p_Date))::INT * 100 / 1 
         INTO v_CheckInScore
       FROM CHECK_IN
       WHERE ElderId = p_ElderId
         AND Timestamp >= p_Date::TIMESTAMP
         AND Timestamp < (p_Date + INTERVAL '1 day')::TIMESTAMP;
       
       -- Calculate medication adherence (0-100)
       SELECT (COUNT(*) FILTER (WHERE Taken = true))::INT * 100 / 
              NULLIF(COUNT(*), 0)
         INTO v_AdherenceScore
       FROM MEDICATION_LOG ml
       JOIN MEDICATION m ON ml.MedicationId = m.MedicationId
       WHERE m.ElderId = p_ElderId
         AND ml.ScheduledDateTime >= p_Date::TIMESTAMP
         AND ml.ScheduledDateTime < (p_Date + INTERVAL '1 day')::TIMESTAMP;
       
       -- Calculate health score (0-100, penalized for severity)
       SELECT GREATEST(0, 100 - (
         COUNT(*) FILTER (WHERE Severity = 'Critical') * 20 +
         COUNT(*) FILTER (WHERE Severity = 'High') * 10 +
         COUNT(*) FILTER (WHERE Severity = 'Medium') * 5
       ))::INT
         INTO v_HealthScore
       FROM HEALTH_EVENT
       WHERE ElderId = p_ElderId
         AND Timestamp >= p_Date::TIMESTAMP
         AND Timestamp < (p_Date + INTERVAL '1 day')::TIMESTAMP;
       
       -- Calculate mobility score (0-100, penalized for violations)
       SELECT GREATEST(0, 100 - COUNT(*) * 10)::INT
         INTO v_MobilityScore
       FROM (
         SELECT DISTINCT DATE(ci.Timestamp)
         FROM CHECK_IN ci
         WHERE ci.ElderId = p_ElderId
           AND ci.Timestamp >= p_Date::TIMESTAMP
           AND ci.Timestamp < (p_Date + INTERVAL '1 day')::TIMESTAMP
           AND EXISTS (
             SELECT 1 FROM GEOFENCE g
             WHERE g.ElderId = p_ElderId
               AND ST_Distance(
                 ST_Point(ci.Latitude, ci.Longitude)::GEOGRAPHY,
                 ST_Point(g.CenterLatitude, g.CenterLongitude)::GEOGRAPHY
               ) > g.RadiusMeters
           )
       ) geofence_violations;
       
       -- Calculate weighted overall score
       v_OverallScore := 
         ROUND((v_CheckInScore * 0.3 + v_AdherenceScore * 0.4 + 
                v_HealthScore * 0.2 + v_MobilityScore * 0.1)::INT);
       
       -- Insert or update risk score
       INSERT INTO RISK_SCORE (ElderId, ScoreDate, OverallScore, CheckInScore, 
                               AdherenceScore, HealthScore, MobilityScore)
       VALUES (p_ElderId, p_Date, v_OverallScore, v_CheckInScore, 
               v_AdherenceScore, v_HealthScore, v_MobilityScore)
       ON CONFLICT (ElderId, ScoreDate) DO UPDATE SET
         OverallScore = v_OverallScore,
         CheckInScore = v_CheckInScore,
         AdherenceScore = v_AdherenceScore,
         HealthScore = v_HealthScore,
         MobilityScore = v_MobilityScore;
       
       RETURN v_OverallScore;
     END;
     ```
     Explanation:
       - Four independent score calculations (check-in, adherence, health, mobility)
       - Each score normalized to 0-100 scale
       - Component penalties for issues (high-severity event = -20 points)
       - Weighted sum gives final score (40% weight on adherence—most important)
       - ON CONFLICT ensures idempotency (safe to run multiple times)
     
     Performance: <200ms per elderly per day
     
     Execution: Run nightly for all elderly, or on-demand when requested

   - Query 4: Detect geofence violations
     Purpose: Identify check-ins outside defined safe zones
     SQL (simplified):
     ```
     SELECT 
       ci.CheckInId,
       e.Name AS ElderlyName,
       g.Name AS GeofenceName,
       ci.Timestamp,
       ST_Distance(
         ST_Point(ci.Latitude, ci.Longitude)::GEOGRAPHY,
         ST_Point(g.CenterLatitude, g.CenterLongitude)::GEOGRAPHY
       ) / 1000 AS DistanceKm,
       g.RadiusMeters / 1000 AS RadiusKm,
       (ST_Distance(...) > g.RadiusMeters) AS IsViolation
     FROM CHECK_IN ci
     JOIN ELDERLY e ON ci.ElderId = e.ElderId
     JOIN GEOFENCE g ON e.ElderId = g.ElderId
     WHERE ci.Timestamp >= NOW() - INTERVAL '24 hours'
       AND ST_Distance(...) > g.RadiusMeters
     ORDER BY ci.Timestamp DESC;
     ```
     Explanation:
       - Uses PostGIS geographic distance functions (ST_Distance)
       - Compares actual distance to geofence radius
       - Returns violations (distance > radius)
       - Filter for recent check-ins (last 24h)
     
     Use case: Displayed in alerts list, real-time check-in processing

4. Output: Technical documentation package with:
   - ARCHITECTURE.md (system design, technology choices)
   - DATABASE_DESIGN.md (schema, normalization, constraints)
   - COMPLEX_QUERIES.md (4-5 queries with explanation, performance notes)
   - API_DOCUMENTATION.md (all 25+ endpoints with examples)
   - DEPLOYMENT_GUIDE.md (how to set up system, configure database)
```

**Verification Condition**:
- Architecture document covers all components and justifies choices
- Database design document includes ER diagram and data dictionary for all entities
- Complex queries documented with SQL, explanation, and performance notes
- At least 4-5 complex queries documented
- All 25+ API endpoints documented with examples
- Documentation is accurate and matches implemented system
- Documentation completed by October 12, 2026

**Stop Condition**:
- If documentation doesn't match implemented code
- If queries have syntax errors or don't run
- If performance estimates are significantly off from reality
- If API documentation missing important endpoints
- Documentation not completed by October 13, 2026

---

## Project Success Criteria

### Verification Checklist (All Must Pass for Submission)

- [ ] **Problem**: Real, clearly defined societal problem validated through interviews with 10+ stakeholders
- [ ] **Innovation**: Novelty identified vs. 4+ existing solutions; clear gap analysis
- [ ] **Database**: 12+ entities, 3NF normalized, 15+ indexes, 5+ triggers/procedures, comprehensive constraints
- [ ] **Implementation**: REST API with 25+ endpoints, PostgreSQL schema fully implemented, React frontend with 6+ pages
- [ ] **Testing**: 80%+ integration test pass rate, UAT conducted with 2+ elderly and 3+ caregivers
- [ ] **TRL**: TRL 4 achieved (working prototype in controlled environment), TRL 5 evidence collected
- [ ] **Documentation**: Architecture, database design, complex queries documented; API documented
- [ ] **Demo**: 3+ scenarios scripted and rehearsed, presentation deck with 10-12 slides, speaker notes prepared

### Final Deliverables (October 15, 2026)

1. **Working System**: Database + API + Frontend deployed and functional
2. **Codebase**: GitHub repository with clean code, documentation, tests
3. **Demo Video**: 5-minute recorded demo (backup if live demo fails)
4. **Presentation Materials**: Slides, speaker notes, demo scripts
5. **Documentation Package**: Architecture, database design, complex queries, API documentation
6. **UAT Report**: Feedback from real users with quantitative and qualitative findings
7. **Impact Evidence**: TRL assessment, scalability roadmap, business model

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Database complexity causes delays | Medium | High | Start Phase 2 early; prioritize core entities |
| Frontend development takes longer than expected | Medium | Medium | Use UI library (Bootstrap/Material-UI); focus on MVP features only |
| Real users unavailable for UAT | Low | High | Recruit from local community early (Phase 1); have backup testing plan |
| Performance issues on demo day | Medium | High | Load test thoroughly; have mobile hotspot backup; pre-record demo video |
| API integration issues | Low | Medium | Mock API in frontend during development; integration tests throughout |
| Database connection failures | Low | High | Implement connection pooling; test failure scenarios; have backup database |

---

## Communication & Checkpoints

**Weekly Team Sync**: Every Monday at 10 AM  
**Phase Completion Reviews**: End of each phase with faculty advisor  
**Mid-Project Review**: September 5, 2026 (Project tracking + issues)  
**Final Review Before Expo**: October 1, 2026 (Demo readiness)

---

**Project Owner**: Neelaksh Saxena  
**Last Updated**: October 5, 2026  
**Status**: Ready for Phase 1 Execution