# SafeGuard - Complete Code Integrity & Error Detection Prompt
## Comprehensive Orphaned Code & Unlinked Feature Audit

---

## EXECUTIVE PROMPT

```
You are a Code Integrity Auditor for SafeGuard. Your mission: Find EVERY piece of 
code that exists but is NOT USED, NOT IMPORTED, NOT LINKED, or NOT INTEGRATED.

This includes:
- Dead imports (imported but never called)
- Orphaned functions/procedures (defined but never invoked)
- Unused React components (created but never mounted)
- Unused services (created but not instantiated)
- Unlinked database objects (tables/triggers created but never referenced)
- Broken API endpoint registrations
- Missing error handlers
- Unimplemented features (half-finished code)
- Type mismatches and interface gaps
- Zombie code (commented-out sections that should be deleted)
- Configuration keys defined but never consumed
- Database migrations that don't match current schema
- API endpoints that don't match frontend calls
- State stores created but not connected to components

GOAL: By end of this audit, SafeGuard should have ZERO dead code, ZERO orphaned 
objects, ZERO integration gaps. Every line of code should serve a purpose.

---

## PART 1: DATABASE LAYER - INTEGRITY CHECK

### 1.1 Orphaned Database Objects

**Check for tables that exist but are never queried:**

For EACH table in the schema (ELDERLY, CHECK_IN, HEALTH_EVENT, MEDICATION, 
MEDICATION_LOG, CAREGIVER, ASSIGNMENT, ALERT, GEOFENCE, RISK_SCORE, USER, AUDIT_LOG):

□ Search backend codebase for SELECT/INSERT/UPDATE/DELETE on this table
  - Use grep: `grep -r "FROM.*tablename\|INTO tablename\|UPDATE tablename" src/`
  - If table is never queried → FLAG: Orphaned table
  - If table is only created in migrations but no queries use it → CRITICAL

□ Example: If RISK_SCORE table exists but no endpoint calls ComputeRiskScore() → FLAG

**Check for stored procedures that are never called:**

```sql
-- List all functions/procedures
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public';

-- For EACH function returned:
```

For each function (ComputeRiskScore, MedicationAdherencePercent, DetectGeofenceViolation, etc.):

□ Search codebase: `grep -r "ComputeRiskScore\|EXECUTE.*function_name" src/`
  - If function is defined but never invoked → FLAG: Orphaned procedure
  
□ Check database logs for actual invocation
  - If function exists but has 0 execution count → CRITICAL

**Check for triggers that are never fired:**

For each trigger (trg_missed_checkin_alert, trg_health_event_alert, trg_update_risk_scores, etc.):

□ Search codebase: `grep -r "INSERT\|UPDATE\|DELETE" src/ | grep "trigger\|trg_"`
  - If trigger fires on INSERT to table X, verify table X is populated by code
  - If trigger condition never met (e.g., >12 hours check-in) → Might be untestable
  
□ Add test case: Force trigger condition and verify alert is created

**Check for unused indexes:**

```sql
-- Find unused indexes
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE NOT EXISTS (
  SELECT 1 FROM pg_stat_user_indexes 
  WHERE pg_stat_user_indexes.indexrelname = pg_indexes.indexname
)
AND schemaname = 'public';

-- For EACH unused index:
```

□ If index hasn't been used in 30 days → Consider dropping
□ If index is on a column never queried → FLAG: Orphaned index

---

### 1.2 Schema vs Reality Mismatch

**Check if database schema matches migration files:**

□ List all migration files: `ls -la db/migrations/`
  - For EACH migration file:
    - Read the migration SQL
    - Run DESCRIBE on resulting table in live database
    - Compare columns, data types, constraints
    - If migration is not applied to live DB → CRITICAL
    
□ Check for "orphaned migrations":
  - Migration file exists but was never run on production
  - Run: `SELECT name FROM schema_migrations WHERE NOT applied`

**Check for schema drift (code expects different schema than DB):**

For each table in code (in seed files, API routes, ORM models):
□ Expected columns vs actual columns in DB
  - Example: Code tries to INSERT `created_at`, but column doesn't exist → CRITICAL
  
□ Expected data types vs actual data types
  - Code expects INTEGER, DB has VARCHAR → TYPE MISMATCH

---

### 1.3 Foreign Key & Relationship Integrity

**Check for broken relationships:**

For EACH foreign key constraint:

```sql
SELECT 
  constraint_name, 
  table_name, 
  column_name, 
  foreign_table_name, 
  foreign_column_name 
FROM information_schema.key_column_usage 
WHERE table_schema = 'public' AND foreign_table_name IS NOT NULL;

-- For EACH FK:
```

□ Verify parent table exists: `SELECT COUNT(*) FROM foreign_table_name`
  - If 0 rows but FK exists → Orphaned FK
  
□ Verify cascade delete behavior is documented
  - Example: DELETE FROM ELDERLY should cascade to CHECK_IN, ALERT, etc.
  - Test: Insert elderly with ID=999, delete elderly, verify all records deleted

**Check for orphaned records (data integrity violations):**

```sql
-- Run these queries to find orphaned records:

-- CHECK_IN with invalid elderly_id
SELECT COUNT(*) FROM CHECK_IN WHERE elderly_id NOT IN (SELECT id FROM ELDERLY);

-- MEDICATION_LOG with invalid medication_id
SELECT COUNT(*) FROM MEDICATION_LOG WHERE medication_id NOT IN (SELECT id FROM MEDICATION);

-- ALERT with invalid elderly_id
SELECT COUNT(*) FROM ALERT WHERE elderly_id NOT IN (SELECT id FROM ELDERLY);

-- ASSIGNMENT with invalid elderly_id or caregiver_id
SELECT COUNT(*) FROM ASSIGNMENT 
WHERE elderly_id NOT IN (SELECT id FROM ELDERLY) 
   OR caregiver_id NOT IN (SELECT id FROM CAREGIVER);

-- For EACH query that returns > 0:
```

□ If orphaned records found → CRITICAL (data integrity broken)
□ Add constraint check: Should have ON DELETE CASCADE or CHECK constraint

---

### 1.4 Constraint & Validation Mismatches

**Check for constraints that don't match code validation:**

□ Code validates: "Latitude must be -90 to 90"
  - DB has: CHECK constraint on latitude → MATCH ✓
  - DB has: No constraint → MISSING (validation only in app, risk of invalid data via direct DB access)

For EACH field that code validates (email, phone, GPS, enum fields):

□ Is there a CHECK constraint in database?
  - Example: Status should be IN ('pending', 'acknowledged', 'resolved')
  - DB query: `SELECT constraint_definition FROM information_schema.check_constraints WHERE table_name = 'alert'`
  - If no constraint → FLAG: Validation only in application layer (risky)

---

## PART 2: BACKEND API LAYER - DEAD CODE CHECK

### 2.1 Unused Imports & Dependencies

**Scan all JavaScript/TypeScript files:**

```bash
find src/ -type f -name "*.js" -o -name "*.ts" | while read file; do
  grep -o "^import.*from" "$file" | sort | uniq
done
```

For EACH import statement:

□ Search file: Is the imported item actually used?
  - Example: `import { Logger } from 'winston'` → Search for `Logger.` in file
  - If never used → FLAG: Dead import (remove it)

□ Common culprits:
  - `import unused_function from './unused'`
  - `import * as X from 'module'` but only use X.foo (should be `import { foo }`)
  - Middleware imported but not applied to any route
  - Utils imported but never called

**Scan package.json dependencies:**

```bash
cat package.json | grep "dependencies\|devDependencies"
```

For EACH dependency:

□ Search codebase: Is this package actually imported?
  - Example: "lodash" in package.json → Search for `import.*lodash\|require.*lodash`
  - If not imported anywhere → FLAG: Unused dependency (remove from package.json)
  
□ Common unused packages:
  - Old testing libraries that were replaced
  - Deprecated authentication packages
  - Temporary debugging tools left in

---

### 2.2 Orphaned Functions & Services

**Find functions defined but never called:**

```bash
# Find all function definitions
grep -rn "^export const\|^export function\|^export default function" src/

# For EACH function:
```

Example: `export const validateMedicationDosage = (dose) => {...}`

□ Search entire codebase for calls to `validateMedicationDosage`
  - If found 0 times (outside the definition) → FLAG: Orphaned function
  
□ Check if it's only used in tests
  - If used ONLY in test file → Might be a helper, OK to keep
  - If NEVER used even in tests → Remove

**Find services that are instantiated but not used:**

```bash
# Find service instantiations
grep -rn "new.*Service\|const.*Service.*=" src/
```

Example: `const medicationService = new MedicationService(db);`

□ Search for calls to `medicationService.*` (e.g., `medicationService.getAll()`)
  - If instantiated but never called → FLAG: Orphaned service
  
□ Example: AuthService created in middleware but logger is never initialized
  - Check: Is every created instance actually used?

**Find middleware that is defined but not applied:**

```bash
# Find middleware definitions
grep -rn "app.use\|router.use\|export.*middleware" src/
```

For EACH middleware:

□ Example: `export const auditLogMiddleware = (req, res, next) => {...}`
□ Search for: `app.use(auditLogMiddleware)` or `router.use(auditLogMiddleware)`
  - If defined but never registered → FLAG: Dead middleware

---

### 2.3 Unlinked API Endpoints

**Find API endpoints that are defined but not exported/registered:**

```bash
# Find route definitions
grep -rn "router.get\|router.post\|router.put\|router.delete\|app.get\|app.post" src/
```

For EACH route:

□ Path: `/api/elderly/:id/check-in`
□ Search for:
  - Is this route exported from routes/index.js?
  - Is it imported in main app.js?
  - Does frontend call this endpoint?
  
□ If endpoint exists but isn't exported/imported → FLAG: Dead route

**Find endpoints that have no handler:**

```bash
# Find route definitions with empty or stub handlers
grep -A 2 "router.post.*check-in" src/
```

Example:
```javascript
router.post('/check-in', (req, res) => {
  res.json({ status: 'TODO' });
});
```

□ If handler is `TODO`, `STUB`, `NOT IMPLEMENTED`, or just returns mock data → FLAG: Unimplemented endpoint

---

### 2.4 Broken Error Handlers

**Find try-catch blocks with empty catch clauses:**

```bash
grep -A 3 "catch.*{" src/
```

Example:
```javascript
try {
  // code
} catch (err) {
  // EMPTY or console.log only
}
```

□ If catch block is empty or only logs → FLAG: Missing error handling
  - Should return error response to client
  - Should log error with context
  - Should not silently fail

**Find promise rejections without handlers:**

```bash
grep -rn "\.then\|\.catch\|await" src/ | grep -v "\.catch"
```

Example:
```javascript
await medicationService.save(med);  // No .catch handler
```

□ If Promise/await has no error handler → FLAG: Unhandled promise rejection
  - Can crash server or leave request hanging

---

### 2.5 Type/Interface Mismatches

**Find type definitions that don't match reality:**

```bash
# Find TypeScript interfaces
grep -rn "interface\|type.*=" src/
```

Example:
```typescript
interface Medication {
  id: number;
  elderly_id: number;
  drug_name: string;
}
```

□ Check API response: Does it actually return these fields?
□ Check database: Do columns match?
□ Check frontend: Does it expect these fields?

If any mismatch → FLAG: Type inconsistency

---

## PART 3: FRONTEND LAYER - DEAD CODE CHECK

### 3.1 Unused React Components

**Find all React components:**

```bash
find src/components -type f -name "*.jsx" -o -name "*.tsx"
```

For EACH component file:

```bash
# Get component name
COMPONENT_NAME=$(basename file | sed 's/\.jsx\|\.tsx//')

# Search for usage
grep -rn "import.*$COMPONENT_NAME\|<$COMPONENT_NAME" src/
```

Example: Component is `PatientDetailsModal.jsx`

□ Search for imports: `import PatientDetailsModal from`
□ Search for usage: `<PatientDetailsModal`
  - If imported 0 times → FLAG: Orphaned component
  
□ If imported but never mounted (e.g., only in conditional that's never true) → FLAG: Dead component

### 3.2 Unused State Stores

**Find Zustand store definitions:**

```bash
grep -rn "create(state" src/store/
```

Example: `src/store/alertStore.js` exports `useAlertStore`

□ Search: `grep -r "useAlertStore" src/`
  - If never imported → FLAG: Orphaned store
  
□ Check each store:
  - Is it used in any component?
  - Are all its methods (addAlert, removeAlert, etc.) actually called?
  - If method never called → FLAG: Dead store method

---

### 3.3 Unused Utility Functions

**Find all utils:**

```bash
ls src/utils/
```

For EACH util file:

```bash
# Find exports
grep -n "export" src/utils/filename.js

# For EACH export:
grep -rn "imported_function" src/
```

Example: `src/utils/validators.js` exports `validateGPS()`

□ Search: `validateGPS` in entire codebase
  - If found 0 times → FLAG: Orphaned utility

---

### 3.4 Dead CSS & Styling

**Find CSS files:**

```bash
find src/ -name "*.css" -o -name "*.scss"
```

For EACH CSS file:

□ Are there class names defined but not used?
  - Example: `.elderly-button-disabled` defined but component uses `.btn-disabled`
  
□ Use CSS coverage tools:
  - Create unused CSS report
  - If coverage < 90% → FLAG: Dead CSS

---

### 3.5 Unused Props & Component Interfaces

**Find React components with unused props:**

For EACH component:

```jsx
// Example Component
const PatientCard = ({ patient, onDelete, onEdit, unusedProp }) => {
  return <div>{patient.name}</div>;  // onDelete, onEdit, unusedProp never used
};
```

□ Look for props passed into component but never referenced in JSX or logic
□ If prop is unused → Remove it
□ Search parent component: Why is it passing unused prop?

---

## PART 4: CONFIGURATION & ENVIRONMENT - INCONSISTENCY CHECK

### 4.1 Environment Variables

**Find all environment variable references:**

```bash
grep -rn "process.env\." src/
```

Example: `process.env.DATABASE_URL`

□ For EACH reference:
  - Is it defined in .env file?
  - Is it used anywhere?
  
□ Find env vars defined but not used:
  - Search .env for all keys: `grep -o "^[A-Z_]*=" .env`
  - For EACH key: `grep -r "process.env.KEY" src/`
  - If 0 results → FLAG: Unused env var

---

### 4.2 Configuration Files

**Find config files (config.js, etc.):**

```bash
grep -rn "module.exports = {\|export const config = {" src/
```

For EACH config object:

□ Is every key actually used?
  - Example: `config.redisUrl` but Redis not imported anywhere
  
□ Search: `config.redisUrl` in codebase
  - If unused → Remove from config

---

## PART 5: INTEGRATION GAPS - CROSS-LAYER CHECK

### 5.1 Database → API Mismatch

**For each API endpoint, verify database call:**

Example: POST /api/elderly/:id/check-in

□ Endpoint handler:
```javascript
router.post('/elderly/:id/check-in', async (req, res) => {
  await db.query('INSERT INTO CHECK_IN ...');
});
```

□ Verify:
  - INSERT statement targets correct table (CHECK_IN) ✓
  - All required fields are provided (elderly_id, timestamp, latitude, longitude)
  - Response format matches expected API response format
  - Error handling is present

**For each stored procedure call, verify it exists and is correct:**

Example: ComputeRiskScore(elderly_id, date)

□ Backend calls: `await db.query('SELECT compute_risk_score($1, $2)', [elderlyId, date])`
□ Verify:
  - Function exists in database ✓
  - Function signature matches call (2 params) ✓
  - Expected return type matches ✓
  - Error if function fails is caught ✓

---

### 5.2 API → Frontend Mismatch

**For each frontend API call, verify backend endpoint exists:**

Example: Frontend calls:
```javascript
fetch('/api/elderly/123/check-in', { method: 'POST', ... })
```

□ Verify backend has:
  - POST route at `/api/elderly/:id/check-in` ✓
  - Handler exists (not 404) ✓
  - Handler accepts required body fields ✓
  - Response format matches frontend expectations ✓

**For each backend response, verify frontend handles it:**

Example: Backend returns:
```json
{
  "success": true,
  "data": { "riskScore": 28 },
  "error": null
}
```

□ Frontend code:
```javascript
const data = await response.json();
if (data.success) {
  console.log(data.data.riskScore);  // Does it access correct field?
}
```

□ Verify:
  - Frontend accesses correct JSON path ✓
  - Frontend handles error case ✓
  - Frontend handles null/undefined gracefully ✓

---

### 5.3 Socket.io Event Mismatch

**Find all Socket.io listeners:**

```bash
grep -rn "socket.on\|socket.emit" src/
```

For EACH event (e.g., `patient:update`):

□ Backend emits: `socket.emit('patient:update', data)`
□ Frontend listens: `socket.on('patient:update', (data) => { ... })`
  - If listener missing → FLAG: Event emitted but not handled
  - If emitter missing → FLAG: Listener waiting for event that never fires

---

### 5.4 Service Initialization Chain

**Trace service initialization:**

```
app.js
  ├─ Initializes database connection
  ├─ Loads middleware
  ├─ Registers routes
  └─ Starts server

Database connection
  ├─ Connects to PostgreSQL
  └─ Runs migrations

Routes
  ├─ /api/elderly
  ├─ /api/medications
  └─ /api/alerts

Services (instantiated in routes)
  ├─ medicationService
  ├─ authService
  └─ alertService
```

For EACH service:

□ Is it initialized before being used?
  - If service uses `db` connection, is `db` connected first?
  
□ Example: 
  - alertService needs rabbitmq for notifications
  - If rabbitmq not initialized, alerts fail silently
  
□ Check for circular dependencies:
  - serviceA requires serviceB requires serviceA → CRITICAL

---

## PART 6: TESTING GAPS - UNTESTED CODE

### 6.1 Functions with No Tests

```bash
# Find all test files
find src/ -name "*.test.js" -o -name "*.spec.js"

# Find all source functions
grep -rn "^export\|^function" src/
```

For EACH exported function:

□ Is there a corresponding test?
  - Search test files for function name
  - If no test found → FLAG: Untested function

---

### 6.2 Code Paths Not Covered

**Identify conditional branches:**

```javascript
if (medication.status === 'active') {
  // Path A
} else if (medication.status === 'discontinued') {
  // Path B
} else {
  // Path C - error case
}
```

□ For EACH conditional path:
  - Is there a test case?
  - Are error cases tested?
  
□ If error path never tested → FLAG: Untested error handling

---

## PART 7: DOCUMENTATION GAPS

### 7.1 Undocumented Functions

```bash
# Find functions without comments
grep -B 1 "^export function\|^export const" src/ | grep -v "^--\|^//"
```

For EACH function without JSDoc:

□ Is it self-documenting (clear name, obvious params)?
□ If complex logic → Should have JSDoc comment
  - Missing comment → FLAG: Undocumented function

---

### 7.2 Broken Links in Comments

```bash
grep -r "TODO\|FIXME\|HACK\|XXX" src/
```

For EACH TODO/FIXME:

□ Example: `// TODO: implement geofence checking`
□ Is there actually code for this?
  - If not → FLAG: Incomplete feature

---

## FINAL INTEGRITY CHECKLIST

**CRITICAL (Must Fix Before Launch):**
- [ ] No orphaned database tables/functions/triggers
- [ ] No dead imports in any file
- [ ] No unreachable API endpoints
- [ ] No unimplemented API handlers (TODO/STUB only)
- [ ] No broken error handlers (empty catch blocks)
- [ ] No orphaned React components
- [ ] No unused Zustand stores
- [ ] No type/interface mismatches between layers
- [ ] All Socket.io events have listeners on both sides
- [ ] No circular dependencies in services
- [ ] All environment variables used (or removed from .env)
- [ ] No orphaned records in database (FK violations)

**HIGH PRIORITY (Should Fix):**
- [ ] No unused CSS classes (>90% coverage)
- [ ] No unused utility functions
- [ ] All database constraints match code validation
- [ ] All functions have tests or clear reason for exception
- [ ] All TODO/FIXME comments have corresponding issues
- [ ] No dead code (commented-out sections)

**NICE-TO-HAVE (Optional):**
- [ ] All functions documented with JSDoc
- [ ] All complex logic has comments explaining why
- [ ] Consistent code style throughout

---

## EXECUTION STEPS

1. **Clone the SafeGuard repository** to working directory

2. **Run automated checks:**
```bash
# Find unused imports
npm audit

# Find unused packages
npm ls --depth=0 | grep "(deduped)"

# Run linter for dead code
npx eslint src/ --max-warnings 0

# Check test coverage
npm run test:coverage
```

3. **Manual verification:**
- Run each critical query from Section 1
- Search codebase for each function/component from Sections 2-3
- Verify each integration point from Section 5

4. **Create report:**
For EACH finding:
```
[SEVERITY] - [Category] - [Issue]
Location: src/path/to/file.js:123
Description: [What is orphaned/broken]
Impact: [Why it matters]
Recommendation: [Delete/Refactor/Link/Implement]
```

5. **Fix all CRITICAL findings** before submitting to DBTHON judges

6. **Re-verify** after fixes (some fixes may reveal new orphaned code)

---

## REPORT TEMPLATE

```
# SafeGuard Code Integrity Audit Report
Generated: [DATE]

## Summary
- Total Issues Found: [X]
- Critical: [X]
- High: [X]
- Medium: [X]
- Low: [X]

## Database Layer
✅/⚠️/❌ Schema Integrity
✅/⚠️/❌ Orphaned Objects
✅/⚠️/❌ Foreign Keys & Relationships
✅/⚠️/❌ Constraints & Validation

[Detailed findings for each]

## Backend API Layer
✅/⚠️/❌ Dead Imports
✅/⚠️/❌ Orphaned Functions
✅/⚠️/❌ Unlinked Endpoints
✅/⚠️/❌ Error Handling
✅/⚠️/❌ Type Mismatches

[Detailed findings for each]

## Frontend Layer
✅/⚠️/❌ Unused Components
✅/⚠️/❌ Unused Stores
✅/⚠️/❌ Unused Utils
✅/⚠️/❌ Dead CSS

[Detailed findings for each]

## Integration Points
✅/⚠️/❌ Database ↔ API Consistency
✅/⚠️/❌ API ↔ Frontend Consistency
✅/⚠️/❌ Socket.io Events
✅/⚠️/❌ Service Initialization

[Detailed findings for each]

## Testing Coverage
✅/⚠️/❌ Function Coverage
✅/⚠️/❌ Error Path Coverage

[Detailed findings for each]

## Recommendations (Priority Order)
1. [Fix 1] - CRITICAL - [Reason]
2. [Fix 2] - HIGH - [Reason]
3. [Fix 3] - MEDIUM - [Reason]

## Approval
- [ ] All CRITICAL issues resolved
- [ ] All HIGH issues resolved
- [ ] Code ready for production
```

---

## END OF PROMPT
