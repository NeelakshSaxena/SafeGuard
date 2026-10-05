const API_BASE = 'http://127.0.0.1:5000/api';
let globalElderlyData = [];

// --- Initialization & UI Logic ---
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
    
    // Check role in localStorage or default to caregiver
    const savedRole = localStorage.getItem('safeguard_role') || 'caregiver';
    document.getElementById('roleSwitcher').value = savedRole;
    changeRole(true); // initialized
});

function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function changeRole(isInit = false) {
    const role = document.getElementById('roleSwitcher').value;
    localStorage.setItem('safeguard_role', role);
    
    // Update Header
    const label = document.getElementById('currentUserLabel');
    if(role === 'caregiver') label.innerText = 'Caregiver View';
    if(role === 'elderly') label.innerText = 'Patient View';
    if(role === 'doctor') label.innerText = 'Dr. Patel (Clinical)';
    
    // Hide all nav groups
    document.querySelectorAll('.nav-group').forEach(el => el.style.display = 'none');
    
    // Show role-specific nav groups
    if(role === 'caregiver') {
        document.querySelectorAll('.caregiver-only').forEach(el => el.style.display = 'block');
        if(!isInit) switchTab('dashboard');
    } else if(role === 'elderly') {
        document.querySelectorAll('.elderly-only').forEach(el => el.style.display = 'block');
        if(!isInit) switchTab('elderly-app');
    } else if(role === 'doctor') {
        document.querySelectorAll('.doctor-only').forEach(el => el.style.display = 'block');
        if(!isInit) switchTab('clinical');
    }
    
    // Initial fetch if we just loaded
    if(isInit) {
        if(role === 'caregiver') switchTab('dashboard');
        else if(role === 'elderly') switchTab('elderly-app');
        else if(role === 'doctor') switchTab('clinical');
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    
    const activeNav = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if(activeNav) activeNav.classList.add('active');
    
    document.getElementById(tabId).classList.add('active');
    
    // Breadcrumbs
    const tabName = activeNav ? activeNav.innerText.trim() : tabId;
    document.getElementById('breadcrumb').innerText = `SafeGuard > ${document.getElementById('roleSwitcher').value.toUpperCase()} > ${tabName}`;
    
    // Data Fetching
    if (tabId === 'dashboard') fetchDashboardStats();
    if (tabId === 'alerts') fetchAlerts();
    if (tabId === 'analytics') fetchAnalytics();
    if (tabId === 'dbviz') fetchDbStats();
    if (tabId === 'clinical') fetchClinicalData();
}

// --- Modals and Sidebars ---
function openSidebar(elderId) {
    const patient = globalElderlyData.find(e => e.elder_id === elderId);
    if(!patient) return;
    
    const color = patient.status === 'Safe' ? 'var(--success)' : patient.status === 'Warning' ? 'var(--warning)' : 'var(--danger)';
    
    const content = `
        <h2 style="margin-bottom: 0.5rem; color: ${color};">${patient.name}</h2>
        <p class="text-muted" style="margin-bottom: 1.5rem;">Age: 76 | DOB: ${patient.dob}</p>
        
        <div style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--border); margin-bottom: 1.5rem;">
            <h4 class="mb-1 text-muted" style="text-transform:uppercase; font-size: 0.75rem;">Real-time Status</h4>
            <div class="d-flex justify-between mb-1">
                <span>Status:</span>
                <strong style="color: ${color}">${patient.status}</strong>
            </div>
            <div class="d-flex justify-between mb-1">
                <span>Last Check-in:</span>
                <span>${patient.last_checkin || 'None'}</span>
            </div>
            <div class="d-flex justify-between">
                <span>Med Adherence:</span>
                <strong>${patient.adherence_pct}%</strong>
            </div>
            <div style="width: 100%; height: 6px; background: var(--bg); border-radius: 3px; margin-top: 0.5rem;">
                <div style="height: 100%; width: ${patient.adherence_pct}%; background: ${color}; border-radius: 3px;"></div>
            </div>
        </div>
        
        <h4 class="mb-1 text-muted" style="text-transform:uppercase; font-size: 0.75rem;">Assigned Caregivers</h4>
        <p style="font-size: 0.875rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-user-check text-primary"></i> Mom (Primary) - Active</p>
        <p style="font-size: 0.875rem; margin-bottom: 1.5rem;"><i class="fa-solid fa-user-md text-primary"></i> Dr. Patel - Clinical</p>
        
        <button class="btn btn-outline" style="width: 100%; justify-content: center; margin-bottom: 0.5rem;">Send Message</button>
        <button class="btn btn-danger" style="width: 100%; justify-content: center;">Trigger Emergency Alert</button>
    `;
    
    document.getElementById('patientDetailsContent').innerHTML = content;
    document.getElementById('patientSidebar').classList.add('open');
}

function closeSidebar() {
    document.getElementById('patientSidebar').classList.remove('open');
}

function openAlertModal(alertStr) {
    const a = JSON.parse(decodeURIComponent(alertStr));
    document.getElementById('modalAlertTitle').innerHTML = `Alert: ${a.elderly_name}`;
    
    const content = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
                <p class="text-muted" style="font-size: 0.875rem; text-transform: uppercase;">Alert Info</p>
                <p><strong>Type:</strong> ${a.alert_type}</p>
                <p><strong>Severity:</strong> <span class="text-danger">${a.severity}</span></p>
                <p><strong>Created:</strong> ${a.timestamp}</p>
                <p><strong>Status:</strong> ${a.status}</p>
            </div>
            <div>
                <p class="text-muted" style="font-size: 0.875rem; text-transform: uppercase;">Caregiver Action</p>
                <p><i class="fa-solid fa-phone"></i> Call Primary: 555-0101</p>
                <p><i class="fa-solid fa-location-dot"></i> Check Last Location</p>
                <p class="text-warning mt-1"><i class="fa-solid fa-triangle-exclamation"></i> Action required within 15 mins</p>
            </div>
        </div>
    `;
    document.getElementById('modalAlertBody').innerHTML = content;
    document.getElementById('modalAckBtn').onclick = () => { ackAlert(a.alert_id); closeModal('alertModal'); };
    document.getElementById('alertModal').classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// --- Data Fetching & DOM Population ---

async function fetchDashboardStats() {
    try {
        const res = await fetch(`${API_BASE}/dashboard/stats`);
        const stats = await res.json();
        
        document.getElementById('dashStats').innerHTML = `
            <div class="stat-box" style="border-left: 4px solid var(--success)">
                <div>
                    <div class="stat-val">${stats.safe_count}</div>
                    <div class="stat-label">Safe & Active <span class="trend-up">↑ +2</span></div>
                </div>
            </div>
            <div class="stat-box" style="border-left: 4px solid var(--warning)">
                <div>
                    <div class="stat-val">${stats.warning_count}</div>
                    <div class="stat-label">Approaching Limit <span class="trend-down">↓ -1</span></div>
                </div>
            </div>
            <div class="stat-box" style="border-left: 4px solid var(--danger)">
                <div>
                    <div class="stat-val">${stats.alert_count}</div>
                    <div class="stat-label">Critical Alerts <span class="trend-down">⚠️ Action Req</span></div>
                </div>
            </div>
        `;
        document.getElementById('alertBadge').innerText = stats.pending_alerts;
        fetchElderlyCards();
    } catch (err) { console.error("API Offline", err); }
}

async function fetchElderlyCards() {
    try {
        const res = await fetch(`${API_BASE}/elderly`);
        globalElderlyData = await res.json();
        const grid = document.getElementById('elderlyCardsGrid');
        grid.innerHTML = '';
        
        globalElderlyData.forEach(e => {
            const timeDiff = e.last_checkin ? `<span class="text-muted"><i class="fa-regular fa-clock"></i> ${e.last_checkin.split(' ')[1]}</span>` : '<span class="text-danger">No check-ins</span>';
            const color = e.status === 'Safe' ? 'var(--success)' : e.status === 'Warning' ? 'var(--warning)' : 'var(--danger)';
            const icon = e.status === 'Safe' ? 'fa-check-circle' : e.status === 'Warning' ? 'fa-circle-exclamation' : 'fa-triangle-exclamation';
            const risk = 100 - e.adherence_pct;
            
            grid.innerHTML += `
                <div class="card card-interactive" style="border-left: 4px solid ${color}" onclick="openSidebar(${e.elder_id})">
                    <div class="d-flex justify-between align-center mb-1">
                        <h3 style="margin:0; font-size: 1.1rem;">${e.name}</h3>
                        <span style="color: ${color}; font-size: 0.75rem; font-weight: 600; padding: 2px 6px; background: rgba(255,255,255,0.05); border-radius: 10px;"><i class="fa-solid ${icon}"></i> ${e.status}</span>
                    </div>
                    
                    <div class="text-muted" style="font-size: 0.8rem; margin-bottom: 0.5rem;">Age: 76 | Risk Score: <span style="color: ${risk > 40 ? 'var(--danger)' : 'var(--success)'}">${risk}</span></div>
                    
                    <p style="font-size: 0.85rem; margin-bottom: 1rem; display: flex; justify-content: space-between;">
                        ${timeDiff}
                        <span style="color: var(--primary);"><i class="fa-solid fa-location-dot"></i> Home</span>
                    </p>
                    
                    <div style="background: rgba(255,255,255,0.03); padding: 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
                        <span>Adherence</span>
                        <div style="display: flex; align-items: center; gap: 0.5rem; width: 60%;">
                            <div style="flex:1; height: 4px; background: var(--bg); border-radius: 2px;">
                                <div style="height: 100%; width: ${e.adherence_pct}%; background: ${e.adherence_pct > 80 ? 'var(--success)' : 'var(--warning)'}; border-radius: 2px;"></div>
                            </div>
                            <span style="color: ${e.adherence_pct > 80 ? 'var(--success)' : 'var(--warning)'}">${e.adherence_pct}%</span>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (e) { console.error(e); }
}

async function fetchAlerts() {
    try {
        const res = await fetch(`${API_BASE}/alerts`);
        const alerts = await res.json();
        const tbody = document.getElementById('alertsTableBody');
        tbody.innerHTML = '';
        
        alerts.forEach(a => {
            const color = a.severity === 'Critical' ? 'var(--danger)' : 'var(--warning)';
            const statusColor = a.status === 'Pending' ? 'var(--danger)' : 'var(--success)';
            
            const encoded = encodeURIComponent(JSON.stringify(a));
            const actionBtn = a.status === 'Pending' 
                ? `<button class="btn btn-outline btn-sm" onclick="openAlertModal('${encoded}')">Details</button> <button class="btn btn-success btn-sm" onclick="ackAlert(${a.alert_id})">Ack</button>` 
                : `<span class="text-muted"><i class="fa-solid fa-check"></i> Resolved</span>`;
            
            tbody.innerHTML += `
                <tr>
                    <td style="color: ${color}; font-weight: bold;"><i class="fa-solid fa-circle" style="font-size:0.5rem; margin-right:0.5rem;"></i>${a.severity}</td>
                    <td>${a.alert_type}</td>
                    <td style="font-weight: 500;">${a.elderly_name}</td>
                    <td class="text-muted">${a.timestamp.split(' ')[1]}</td>
                    <td style="color: ${statusColor}; font-weight: 500;">${a.status}</td>
                    <td>${actionBtn}</td>
                </tr>
            `;
        });
    } catch (e) { console.error(e); }
}

async function ackAlert(id) {
    try {
        await fetch(`${API_BASE}/alerts/${id}/acknowledge`, {method: 'POST'});
        fetchAlerts();
        fetchDashboardStats();
    } catch (e) { console.error(e); }
}

// --- Analytics Charts ---
let charts = {};

async function fetchAnalytics() {
    try {
        const res = await fetch(`${API_BASE}/analytics/mock`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        if (typeof Chart === 'undefined') {
            throw new Error("Chart.js library is not loaded! The CDN might be blocked.");
        }
        
        const c1 = document.getElementById('complianceChart').getContext('2d');
        if (charts.compliance) charts.compliance.destroy();
        charts.compliance = new Chart(c1, {
            type: 'bar',
            data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Compliance %', data: data.compliance, backgroundColor: data.compliance.map(v => v >= 90 ? '#10B981' : '#F59E0B'), borderRadius: 4 }] },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });

        const c2 = document.getElementById('riskChart').getContext('2d');
        if (charts.risk) charts.risk.destroy();
        charts.risk = new Chart(c2, {
            type: 'line',
            data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Avg Risk Score', data: data.risk_trend, borderColor: '#4F46E5', backgroundColor: 'rgba(79, 70, 229, 0.1)', fill: true, tension: 0.4 }] },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });

        const c3 = document.getElementById('adherenceDoughnut').getContext('2d');
        if (charts.adherence) charts.adherence.destroy();
        charts.adherence = new Chart(c3, {
            type: 'doughnut',
            data: { labels: ['>90% (Safe)', '75-90% (Warning)', '<75% (Critical)'], datasets: [{ data: [25, 15, 10], backgroundColor: ['#10B981', '#F59E0B', '#EF4444'], borderWidth: 0 }] },
            options: { responsive: true, cutout: '70%', plugins: { legend: { position: 'right', labels: { color: '#94A3B8' } } } }
        });
        
        const c4 = document.getElementById('alertHeatmap').getContext('2d');
        if (charts.heatmap) charts.heatmap.destroy();
        charts.heatmap = new Chart(c4, {
            type: 'line',
            data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Alert Frequency', data: [2, 5, 1, 8, 3, 2, 0], borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: true, stepped: true }] },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
        
    } catch (e) { 
        console.error("Analytics Fetch Error: ", e); 
        const errorBox = document.createElement('div');
        errorBox.style = "background: #EF4444; color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;";
        errorBox.innerHTML = `<strong>Error Rendering Charts:</strong><br><pre>${e.message}</pre>`;
        const container = document.getElementById('complianceChart').parentElement;
        container.appendChild(errorBox);
    }
}

// --- Doctor Clinical View ---
async function fetchClinicalData() {
    try {
        const res = await fetch(`${API_BASE}/elderly`);
        const elderly = await res.json();
        const tbody = document.getElementById('clinicalTableBody');
        tbody.innerHTML = '';
        
        elderly.forEach(e => {
            const color = e.status === 'Safe' ? 'var(--success)' : e.status === 'Warning' ? 'var(--warning)' : 'var(--danger)';
            const risk = 100 - e.adherence_pct;
            
            tbody.innerHTML += `
                <tr>
                    <td style="font-weight: bold; color: var(--text-main);">${e.name}</td>
                    <td class="text-muted">76</td>
                    <td>Diabetes, HTN</td>
                    <td style="color: ${e.adherence_pct > 80 ? 'var(--success)' : 'var(--warning)'};">${e.adherence_pct}%</td>
                    <td style="color: ${risk > 40 ? 'var(--danger)' : 'var(--success)'};">${risk}</td>
                    <td style="color: ${color};"><i class="fa-solid fa-circle" style="font-size: 0.5rem; margin-right: 0.5rem;"></i>${e.status}</td>
                </tr>
            `;
        });
    } catch (e) { console.error(e); }
}

// --- DB Visualizer Animation & Query ---
function simulateQueryFlow() {
    const nodes = ['node-users', 'node-elderly', 'node-checkin', 'node-alert', 'node-health'];
    let delay = 0;
    
    nodes.forEach(node => {
        document.getElementById(node).classList.remove('highlight-node');
    });
    
    nodes.forEach((node, index) => {
        setTimeout(() => {
            document.getElementById(node).classList.add('highlight-node');
            setTimeout(() => {
                document.getElementById(node).classList.remove('highlight-node');
            }, 800);
        }, delay);
        delay += 600;
    });
}

async function fetchDbStats() {
    try {
        const res = await fetch(`${API_BASE}/db/stats`);
        const data = await res.json();
        
        const historyBox = document.getElementById('queryHistoryBox');
        historyBox.innerHTML = '';
        data.history.forEach(h => {
            const timeColor = h.ms > 100 ? 'var(--warning)' : 'var(--success)';
            historyBox.innerHTML += `
                <div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.8rem;">
                    <div class="d-flex justify-between mb-1 text-muted">
                        <span>${h.time}</span>
                        <span style="color: ${timeColor}">${h.ms}ms ⚡</span>
                    </div>
                    <div style="color: var(--text-main); word-break: break-all;">${h.query}</div>
                </div>
            `;
        });
    } catch (e) { console.error(e); }
}

async function runQuery() {
    const query = document.getElementById('sqlQuery').value;
    if (!query) return;
    
    const resultsBox = document.getElementById('queryResults');
    const timeBox = document.getElementById('execTime');
    resultsBox.innerText = "Executing Query Plan...";
    simulateQueryFlow(); // Animate visualizer
    
    try {
        const res = await fetch(`${API_BASE}/query-analyzer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data = await res.json();
        
        if (data.success) {
            timeBox.innerText = `${data.execution_time_ms}ms ⚡`;
            let html = `[QUERY EXECUTION PLAN]\n${JSON.stringify(data.explain_plan, null, 2)}\n\n[RESULTS RETRIEVED: ${data.results.length} rows]\n${JSON.stringify(data.results, null, 2)}`;
            resultsBox.innerHTML = html;
            fetchDbStats(); // Refresh history
        } else {
            timeBox.innerText = "Error";
            resultsBox.innerText = data.error;
        }
    } catch (e) {
        resultsBox.innerText = "API Offline - " + e.message;
    }
}

// --- Elderly App Simulation ---
function simulateElderlyCheckin() {
    document.getElementById('elderlyLocationText').innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Verifying GPS Location...`;
    
    setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                document.getElementById('elderlyLocationText').innerHTML = `<span class="text-success"><i class="fa-solid fa-location-check"></i> Check-in Confirmed. Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}</span>`;
                await submitCheckinPayload(1, lat, lng, "Standard");
            },
            async (err) => {
                document.getElementById('elderlyLocationText').innerHTML = `<span class="text-warning"><i class="fa-solid fa-triangle-exclamation"></i> GPS Denied. Check-in saved with Network IP location.</span>`;
                await submitCheckinPayload(1, 0, 0, "Standard");
            }
        );
    }, 800);
}

function logHealth(type) {
    submitCheckinPayload(1, 0, 0, type);
    alert(`[DB SYNC] ${type} event securely logged to HEALTH_EVENT table.`);
}

async function submitCheckinPayload(elderId, lat, lng, type) {
    try {
        await fetch(`${API_BASE}/checkin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ elder_id: elderId, latitude: lat, longitude: lng, type: type })
        });
    } catch (e) { console.error(e); }
}
