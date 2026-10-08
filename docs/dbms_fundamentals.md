# DBMS Fundamentals in SafeGuard

Since SafeGuard was built as part of the **BCSE302P – Database Systems Lab**, the underlying architecture heavily leverages core Database Management System (DBMS) concepts. 

Below is an explanation of all the major DBMS fundamentals and exactly how they are applied in this codebase.

---

## 1. Relational Model & Entity-Relationship (ER) Design
The system uses a **Relational Database** (PostgreSQL/SQLite) where data is stored in tables (relations), rows (tuples), and columns (attributes).

**Entities in SafeGuard:**
- `User`, `Elderly`, `PatientProfile`, `Device`, `Consultation`, etc.

**Relationships:**
- **One-to-One / One-to-Many:** The `Elderly` table has a Foreign Key `user_id` pointing to `User.user_id`. One `User` can manage one or more `Elderly` profiles.
- **One-to-Many:** An `Elderly` can have many `CheckIn` records, many `Alert` events, and many `Device`s.

---

## 2. Constraints & Data Integrity
To ensure the database doesn't store junk or invalid data, constraints are applied at the schema level (visible in `main.py` via SQLAlchemy definitions).

- **Entity Integrity (Primary Keys):** Every table has a primary key (e.g., `user_id = Column(Integer, primary_key=True)`). This guarantees that every record is uniquely identifiable.
- **Referential Integrity (Foreign Keys):** 
  - Example: `elder_id = Column(Integer, ForeignKey("elderly.elder_id"))` in the `CheckIn` table. 
  - This ensures a check-in cannot be recorded for a non-existent elderly person. If an elderly person is deleted, the database can enforce rules (like cascading deletes) so we don't have "orphan" check-in records.
- **Domain Constraints:** Defining data types (`Integer`, `String`, `Float`, `Boolean`, `DateTime`) forces the database to reject invalid formats (e.g., trying to insert text into a battery percentage column).
- **Unique Constraints:** `email = Column(String, unique=True)`. This ensures no two users can register with the same email.

---

## 3. Indexing for Query Optimization
When a database grows to millions of rows, searching sequentially (Sequence Scan) is extremely slow. **Indexes** are data structures (typically B-Trees) that allow the DBMS to find data in $O(\log n)$ time.

**Application in SafeGuard:**
- Notice the `index=True` flags in `main.py`:
  - `user_id = Column(Integer, primary_key=True, index=True)`
  - `email = Column(String, unique=True, index=True)`
- By indexing the email column, when a user logs in and the backend searches `SELECT * FROM users WHERE email='...'`, it uses the B-Tree index for lightning-fast retrieval instead of scanning every single row.

---

## 4. ACID Properties (Transactions)
The DBMS guarantees reliability through ACID properties, managed seamlessly by SQLAlchemy's `Session`:

- **Atomicity (All or nothing):** When a check-in is submitted (lines 251-262), the system adds a `CheckIn` record. If it's a fall, it *also* adds a `HealthLog`. 
  - `db.add()`, `db.add()`, `db.commit()` ensures both inserts happen together. If the server crashes before `commit()`, neither is saved.
- **Consistency:** Transactions only bring the database from one valid state to another, enforcing all foreign key and unique constraints along the way.
- **Isolation:** Concurrent API requests (e.g., two caregivers acknowledging an alert simultaneously) are handled safely without interfering with each other.
- **Durability:** Once `db.commit()` executes successfully, the data is permanently written to the disk (to `safeguard.db` or PostgreSQL), surviving potential power losses.

---

## 5. Object-Relational Mapping (ORM)
Instead of writing raw SQL strings (`INSERT INTO users...`), SafeGuard uses **SQLAlchemy**.

- **What it is:** An ORM translates Python classes (Objects) into SQL Tables (Relational).
- **Why use it?** 
  - **Security:** It automatically sanitizes inputs, completely preventing **SQL Injection** attacks.
  - **Database Agnosticism:** The same Python code generates SQLite syntax for local testing and PostgreSQL syntax for production deployment. No queries need to be rewritten.

---

## 6. Normalization
The database schema follows normalization rules to minimize redundancy:
- **1NF (First Normal Form):** All columns contain atomic (indivisible) values. (e.g., `latitude` and `longitude` are separate columns, not a single comma-separated string).
- **2NF & 3NF:** Data depends solely on the primary key. For example, the `Elderly`'s name is stored in the `Elderly` table, not duplicated inside every `CheckIn` record. `CheckIn` only stores the `elder_id`.

---

## 7. Triggers and Auditing
In enterprise and healthcare environments (like HIPAA compliance), tracking data changes is mandatory.
- SafeGuard includes an `AuditLog` table.
- While the current Python implementation acts as a middleware log, in a pure DBMS setup (like the provided `db/schema.sql` file), this is often handled by **Database Triggers**. A trigger automatically executes a function (like inserting an audit record) *before* or *after* an `INSERT`, `UPDATE`, or `DELETE` on a monitored table.
