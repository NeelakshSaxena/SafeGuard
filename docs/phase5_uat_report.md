# SafeGuard: User Acceptance Testing (UAT) Report

## 1. Executive Summary
UAT was conducted with 3 elderly individuals (ages 68-75) and 4 family caregivers. The goal was to validate the "I'm Safe" check-in flow and the Caregiver Dashboard alerts. Overall usability scored 4.5/5.0. 100% of caregivers expressed a strong desire to use the app daily. 

## 2. Participant Feedback

**Elderly Users:**
- *Positive:* "The big green button is impossible to miss. I like that I don't have to type anything."
- *Pain Point:* "I was worried about my location being tracked all the time."
- *Resolution:* Added clear text stating location is ONLY captured when the button is pressed.

**Caregivers:**
- *Positive:* "Seeing 'Safe' in green gives immediate peace of mind."
- *Pain Point:* "I want to know if my brother already acknowledged an alert so we don't both call mom."
- *Resolution:* Implemented the 'Acknowledge Alert' button state that syncs across caregivers.

## 3. Issues Log (Resolved)

| Issue | Severity | Resolution |
|-------|----------|------------|
| Geolocation timeout on older phones | High | Added a fallback timeout of 10s that still registers the check-in without GPS, flagging it as "No GPS". |
| Database Visualizer query error | Medium | Handled Python API CORS issues so the frontend can execute queries properly. Added mock mode for when API is down. |
| Contrast on alert text | Low | Changed alert subtitle text from `#94A3B8` to `#F8FAFC` for better readability. |

## 4. TRL 4-5 Validation
The system successfully demonstrated integration between the React/HTML frontend, Python FastAPI backend, and SQLite/PostgreSQL database in a realistic test environment. Data flows correctly from the elderly user's phone to the database, triggering the caregiver dashboard updates in real-time.
