# SafeGuard: Problem Validation & Interview Summary

## 1. Interview Summary Table

| Stakeholder | Demographics | Current Solutions | Top 3 Pain Points | Emergency Freq | Tech Comfort |
|-------------|--------------|-------------------|-------------------|----------------|--------------|
| Elderly (n=5)| 65-82 yrs | WhatsApp, calls | 1. Fear of falling unnoticed<br>2. Forgetting medications<br>3. Reluctance to bother family | 1-2 incidents/yr | Low-Medium |
| Caregivers (n=5)| 35-55 yrs | WhatsApp, shared calendars | 1. Constant anxiety about elderly safety<br>2. Poor coordination among siblings<br>3. Late notification of issues | N/A | High |
| Healthcare (n=2)| 40-50 yrs | EMR, follow-up calls | 1. Lack of continuous health data<br>2. Late intervention<br>3. Poor medication adherence | N/A | High |

## 2. Problem Severity Scoring
Overall Problem Severity: **8.5 / 10**

Quotes highlighting severity:
- "I slipped in the bathroom and couldn't reach my phone for 2 hours. I didn't want to bother my son at work." (Elderly)
- "My sister and I use a WhatsApp group to coordinate mom's meds, but messages get buried. She missed her BP pill twice last week." (Caregiver)
- "Most ER admissions for elderly falls could have been prevented with earlier intervention or simple daily checks." (Healthcare Professional)

## 3. Gap Analysis Matrix

| Identified Problem | Existing Solutions Used | Gap (What's Missing) |
|--------------------|-------------------------|----------------------|
| Unnoticed falls/emergencies | Daily phone calls | Doesn't cover the 23+ hours between calls |
| Poor medication adherence | Pillboxes, alarms | No feedback loop to caregivers if missed |
| Fragmented caregiver coordination | WhatsApp groups | Messages lost; no clear accountability/status tracking |
| Lack of proactive health insights | Scheduled doctor visits | No continuous risk assessment based on daily habits |

## 4. Derived Requirements (High-Level)

### Functional Needs
- Daily automated check-in mechanism (simple "I'm Safe" button).
- Geofence alerts for wandering or expected hospital visits.
- Shared caregiver dashboard for alert status.
- Medication logging with adherence tracking.

### Non-Functional Needs
- Extremely simple UI for elderly users (large buttons, high contrast).
- Alerts must be routed reliably and quickly to caregivers.
- System must securely handle health and location data.
