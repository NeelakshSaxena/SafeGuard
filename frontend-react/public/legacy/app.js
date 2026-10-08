const API_BASE = 'http://127.0.0.1:5000/api';
let globalElderlyData = [];
let currentRole = '';
let currentUserId = '';

// --- Initialization & UI Logic ---
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
    
    // Check role in localStorage
    const savedRole = localStorage.getItem('safeguard_role');
    const savedUserId = localStorage.getItem('safeguard_userid');
    if (savedRole && savedUserId) {
        document.getElementById('loginScreen').style.display = 'none';
        currentRole = savedRole;
        currentUserId = savedUserId;
        changeRole(true); // initialized
    } else {
        document.getElementById('loginScreen').style.display = 'flex';
    }
});

function handleLogin(e) {
    e.preventDefault();
    const loginId = document.getElementById('loginId').value.toLowerCase().trim();
    
    if (loginId.startsWith('patient')) {
        currentRole = 'elderly';
    } else if (loginId.startsWith('caregiver')) {
        currentRole = 'caregiver';
    } else if (loginId.startsWith('doctor')) {
        currentRole = 'doctor';
    } else {
        showToast('Invalid ID format. Use patient1, caregiver1, or doctor1.', 'danger');
        return;
    }
    
    
    localStorage.setItem('safeguard_role', currentRole);
    localStorage.setItem('safeguard_userid', loginId);
    currentUserId = loginId;
    document.getElementById('loginScreen').style.display = 'none';
    changeRole(true);
}

function handleLogout() {
    localStorage.removeItem('safeguard_role');
    localStorage.removeItem('safeguard_userid');
    currentRole = '';
    currentUserId = '';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('loginId').value = '';
    document.getElementById('loginPass').value = '';
}

function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function changeRole(isInit = false) {
    const role = currentRole;
    
    // Update Header
    const label = document.getElementById('currentUserLabel');
    if(role === 'caregiver') label.innerText = 'Caregiver View';
    if(role === 'elderly') label.innerText = 'Patient View';
    if(role === 'doctor') label.innerText = `Doctor View (${currentUserId})`;
    
    // Hide all nav groups
    document.querySelectorAll('.nav-group').forEach(el => el.style.display = 'none');
    
    // Show role-specific nav groups
    if(role === 'caregiver') {
        document.querySelectorAll('.caregiver-only').forEach(el => el.style.display = 'block');
        switchTab('dashboard');
    } else if(role === 'elderly') {
        document.querySelectorAll('.elderly-only').forEach(el => el.style.display = 'block');
        switchTab('elderly-app');
    } else if(role === 'doctor') {
        document.querySelectorAll('.doctor-only').forEach(el => el.style.display = 'block');
        switchTab('clinical');
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    
    const activeNav = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if(activeNav) activeNav.classList.add('active');
    
    const tabEl = document.getElementById(tabId);
    if(tabEl) tabEl.classList.add('active');
    
    // Breadcrumbs
    const tabName = activeNav ? activeNav.innerText.trim() : tabId;
    const displayRole = currentRole ? currentRole.toUpperCase() : 'UNKNOWN';
    document.getElementById('breadcrumb').innerText = `SafeGuard > ${displayRole} > ${tabName}`;
    
    // Data Fetching
    if (tabId === 'dashboard') fetchDashboardStats();
    if (tabId === 'alerts') fetchAlerts();
    if (tabId === 'analytics') fetchAnalytics();
    if (tabId === 'dbviz') fetchDbStats();
    if (tabId === 'clinical') fetchClinicalData();
    if (tabId === 'ai-insights') fetchAiInsights();
    if (tabId === 'live-location') loadLiveLocation();
    if (tabId === 'facilities') loadFacilities();
    // Telehealth - role-aware
    if (tabId === 'telehealth') {
        const doctorView = document.getElementById('telehealthDoctorView');
        const patientView = document.getElementById('telehealthPatientView');
        if (currentRole === 'doctor') {
            if (doctorView) doctorView.style.display = 'block';
            if (patientView) patientView.style.display = 'none';
            loadDoctorConsultations();
        } else {
            if (doctorView) doctorView.style.display = 'none';
            if (patientView) patientView.style.display = 'block';
            loadConsultations();
        }
    }
    // Patient view tabs
    if (tabId === 'prescriptions') loadRefills();
    if (tabId === 'wearables') loadDevices();
    if (tabId === 'my-profile') loadProfile();
    if (tabId === 'elderly-app') { loadHealthLogs(); updateNotifBadge(); }
}

// --- Modals and Sidebars ---
function openSidebar(elderId) {
    const patient = globalElderlyData.find(e => e.elder_id === elderId);
    if(!patient) return;
    
    const color = patient.status === 'Safe' ? 'var(--success)' : patient.status === 'Warning' ? 'var(--warning)' : 'var(--danger)';
    
    const content = `
        <h2 style="margin-bottom: 0.5rem; color: ${color};">${patient.name}</h2>
        <p class="text-muted" style="margin-bottom: 1.5rem;">Age: 76 | DOB: ${patient.dob || 'Jan 15, 1948'}</p>
        
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
        
        <button class="btn btn-outline" style="width: 100%; justify-content: center; margin-bottom: 0.5rem;" onclick="openMessageModal('${patient.login_id}')">Send Message</button>
        <button class="btn btn-danger" style="width: 100%; justify-content: center;" onclick="alert('Emergency alert triggered for ${patient.name}!')">Trigger Emergency Alert</button>
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

let currentAlertFilter = 'Pending';
let globalAlertsData = [];

async function fetchAlerts() {
    try {
        let url = `${API_BASE}/alerts`;
        if (currentRole === 'doctor') {
            url += `?doctor_id=${currentUserId}`;
        }
        const res = await fetch(url);
        globalAlertsData = await res.json();
        renderAlertsTable();
    } catch (e) { console.error(e); }
}

function setAlertFilter(filter) {
    currentAlertFilter = filter;
    const chips = document.querySelectorAll('#alertsFilterBar .chip');
    chips.forEach(c => c.classList.remove('active'));
    
    // Find the chip with matching text and make it active
    Array.from(chips).forEach(c => {
        if (c.innerText === filter) {
            c.classList.add('active');
        }
    });
    renderAlertsTable();
}

function renderAlertsTable() {
    const tbody = document.getElementById('alertsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    let filteredAlerts = globalAlertsData;
    if (currentAlertFilter !== 'All') {
        filteredAlerts = globalAlertsData.filter(a => a.status === currentAlertFilter);
    }
    
    if (filteredAlerts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align:center;padding:2rem;">No ${currentAlertFilter.toLowerCase()} alerts.</td></tr>`;
        return;
    }
    
    filteredAlerts.forEach(a => {
        const color = a.severity === 'Critical' ? 'var(--danger)' : 'var(--warning)';
        const statusColor = a.status === 'Pending' ? 'var(--danger)' : 'var(--success)';
        
        const encoded = encodeURIComponent(JSON.stringify(a));
        const actionBtn = a.status === 'Pending' 
            ? `<button class="btn btn-outline btn-sm" onclick="openAlertModal('${encoded}')">Details</button> <button class="btn btn-success btn-sm" onclick="ackAlert(${a.alert_id})">Ack</button>` 
            : `<span class="text-muted"><i class="fa-solid fa-check"></i> Resolved</span>`;
        
        // Handle split gracefully in case timestamp doesn't have a space
        const timeStr = a.timestamp.includes(' ') ? a.timestamp.split(' ')[1] : a.timestamp;
        
        tbody.innerHTML += `
            <tr>
                <td style="color: ${color}; font-weight: bold;"><i class="fa-solid fa-circle" style="font-size:0.5rem; margin-right:0.5rem;"></i>${a.severity}</td>
                <td>${a.alert_type}</td>
                <td style="font-weight: 500;">${a.elderly_name}</td>
                <td class="text-muted">${timeStr}</td>
                <td style="color: ${statusColor}; font-weight: 500;">${a.status}</td>
                <td>${actionBtn}</td>
            </tr>
        `;
    });
}

async function ackAlert(id) {
    try {
        await fetch(`${API_BASE}/alerts/${id}/acknowledge`, {method: 'POST'});
        showToast('Alert acknowledged', 'success');
        fetchAlerts();
        fetchDashboardStats();
    } catch (e) { console.error(e); }
}

async function ackAllAlerts() {
    try {
        const pendingAlerts = globalAlertsData.filter(a => a.status === 'Pending');
        if (pendingAlerts.length === 0) {
            showToast('No pending alerts to acknowledge', 'success');
            return;
        }
        
        for (const alert of pendingAlerts) {
            await fetch(`${API_BASE}/alerts/${alert.alert_id}/acknowledge`, {method: 'POST'});
        }
        showToast('All alerts acknowledged', 'success');
        fetchAlerts();
        fetchDashboardStats();
    } catch (e) { console.error(e); }
}

// --- Analytics Charts ---
let charts = {};

async function fetchAnalytics() {
    try {
        let url = `${API_BASE}/analytics/mock`;
        if (currentRole === 'doctor') {
            url += `?doctor_id=${currentUserId}`;
        }
        const res = await fetch(url);
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
            data: { labels: ['>90% (Safe)', '75-90% (Warning)', '<75% (Critical)'], datasets: [{ data: data.adherence, backgroundColor: ['#10B981', '#F59E0B', '#EF4444'], borderWidth: 0 }] },
            options: { responsive: true, cutout: '70%', plugins: { legend: { position: 'right', labels: { color: '#94A3B8' } } } }
        });
        
        const c4 = document.getElementById('alertHeatmap').getContext('2d');
        if (charts.heatmap) charts.heatmap.destroy();
        charts.heatmap = new Chart(c4, {
            type: 'line',
            data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Alert Frequency', data: data.alerts_heatmap, borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: true, stepped: true }] },
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

async function fetchAiInsights() {
    try {
        let url = `${API_BASE}/ai-insights`;
        if (currentRole === 'doctor') {
            url += `?doctor_id=${currentUserId}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        
        const aiContainer = document.querySelector('#ai-insights .grid-2');
        if (!aiContainer) return;
        
        aiContainer.innerHTML = '';
        if (data.predictions.length === 0) {
            aiContainer.innerHTML = '<div class="card"><p class="text-muted">No high-risk predictions found for your patients.</p></div>';
        } else {
            data.predictions.forEach(p => {
                const border = p.severity === 'danger' ? 'var(--danger)' : 'var(--warning)';
                const textColor = p.severity === 'danger' ? 'text-danger' : 'text-warning';
                const bg = p.severity === 'danger' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)';
                
                aiContainer.innerHTML += `
                    <div class="card" style="border-top: 4px solid ${border};">
                        <h3 class="mb-1">${p.type}</h3>
                        <p class="${textColor}" style="font-size: 2rem; font-weight: bold; margin: 0;">${p.percentage} <span style="font-size: 1rem; font-weight: normal;" class="text-muted">${p.patient}</span></p>
                        <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 1rem;">Based on: ${p.reason}</p>
                        <div style="background: ${bg}; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                            <h4 class="${textColor}" style="margin: 0 0 0.5rem 0;">Recommendation</h4>
                            <p style="margin: 0; font-size: 0.9rem;">${p.recommendation}</p>
                        </div>
                        <button class="btn btn-sm btn-outline w-100" style="width: 100%; justify-content: center;">Review Details</button>
                    </div>
                `;
            });
        }
        
        const anomalyTable = document.querySelector('#ai-insights table');
        if (anomalyTable) {
            anomalyTable.innerHTML = '';
            if (data.anomalies.length === 0) {
                anomalyTable.innerHTML = '<tr><td class="text-muted" style="padding:1rem 0;">No active anomalies detected.</td></tr>';
            } else {
                data.anomalies.forEach(a => {
                    const icon = a.type.includes('Cardiac') ? 'fa-heart-crack' : 'fa-bed';
                    const textColor = a.severity === 'danger' ? 'text-danger' : 'text-warning';
                    const btnClass = a.severity === 'danger' ? 'btn-danger' : 'btn-outline';
                    
                    anomalyTable.innerHTML += `
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 1rem 0;"><span class="${textColor}"><i class="fa-solid ${icon}"></i> ${a.type}</span></td>
                            <td class="text-muted">${a.description}</td>
                            <td><button class="btn btn-sm ${btnClass}">${a.action}</button></td>
                        </tr>
                    `;
                });
            }
        }
        
    } catch (e) {
        console.error("AI Insights Error:", e);
    }
}

// --- Live Location ---
async function loadLiveLocation() {
    const patientSelect = document.getElementById('locationPatientSelect');
    if (!patientSelect) return;
    
    if (currentRole === 'doctor') {
        patientSelect.style.display = 'block';
        try {
            const res = await fetch(`${API_BASE}/elderly?doctor_id=${currentUserId}`);
            const patients = await res.json();
            
            // Populate select dropdown
            patientSelect.innerHTML = '<option value="">Select Patient...</option>';
            patients.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.elder_id;
                opt.innerText = p.name;
                patientSelect.appendChild(opt);
            });
            
            // Clear default view
            renderLiveLocation('');
        } catch(e) { console.error("Error loading location patients", e); }
    } else {
        patientSelect.style.display = 'none';
        renderLiveLocation('self'); // Mock self data for patient/caregiver
    }
}

function renderLiveLocation(patientId) {
    const mapContent = document.getElementById('locationMapContent');
    const currentStatus = document.getElementById('locationCurrentStatus');
    const lastUpdated = document.getElementById('locationLastUpdated');
    const eventsList = document.getElementById('locationEventsList');
    
    if (!patientId) {
        mapContent.innerHTML = '<p class="text-muted">Select a patient to view location.</p>';
        currentStatus.innerHTML = '<i class="fa-solid fa-circle-question"></i> Unknown';
        currentStatus.className = 'text-muted';
        lastUpdated.innerText = 'Last updated: -';
        eventsList.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">No recent events.</p>';
        return;
    }
    
    // In a real app we'd fetch location data by patientId. 
    // Here we generate dynamic mock data based on the ID.
    const isHome = patientId % 2 === 0 || patientId === 'self';
    
    mapContent.innerHTML = `
        <div style="width: 200px; height: 200px; border-radius: 50%; border: 2px dashed ${isHome ? 'var(--success)' : 'var(--warning)'}; background: ${isHome ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)'}; display: flex; align-items: center; justify-content: center; margin: 0 auto; position: relative;">
            <i class="fa-solid ${isHome ? 'fa-house' : 'fa-building-columns'}" style="position: absolute; top: 20px; color: ${isHome ? 'var(--success)' : 'var(--warning)'}; font-size: 1.5rem;"></i>
            <div style="width: 15px; height: 15px; background: var(--primary); border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px var(--primary); position: absolute; top: 50%; left: ${isHome ? '50%' : '60%'}; transform: translate(-50%, -50%);"></div>
        </div>
        <p class="mt-2" style="margin-top: 1rem; font-weight: bold;">📍 Safe Zone: ${isHome ? 'Home' : 'Community Center'}</p>
    `;
    
    currentStatus.innerHTML = isHome 
        ? '<i class="fa-solid fa-check-circle"></i> At Home'
        : '<i class="fa-solid fa-person-walking"></i> In Transit / Away';
    currentStatus.className = isHome ? 'text-success' : 'text-warning';
    
    lastUpdated.innerText = `Last updated: Just now | Accuracy: ${isHome ? '15m' : '35m'}`;
    
    eventsList.innerHTML = isHome ? `
        <div style="position: relative; margin-bottom: 1rem;">
            <div style="position: absolute; left: -1.4rem; top: 0.25rem; width: 10px; height: 10px; background: var(--success); border-radius: 50%;"></div>
            <p style="margin: 0; font-size: 0.9rem;">11:00 AM - Returned home</p>
        </div>
        <div style="position: relative; margin-bottom: 1rem;">
            <div style="position: absolute; left: -1.4rem; top: 0.25rem; width: 10px; height: 10px; background: var(--text-muted); border-radius: 50%;"></div>
            <p style="margin: 0; font-size: 0.9rem;">10:45 AM - Exited pharmacy</p>
        </div>
    ` : `
        <div style="position: relative; margin-bottom: 1rem;">
            <div style="position: absolute; left: -1.4rem; top: 0.25rem; width: 10px; height: 10px; background: var(--warning); border-radius: 50%;"></div>
            <p style="margin: 0; font-size: 0.9rem;">12:30 PM - Arrived at Community Center</p>
        </div>
        <div style="position: relative; margin-bottom: 1rem;">
            <div style="position: absolute; left: -1.4rem; top: 0.25rem; width: 10px; height: 10px; background: var(--text-muted); border-radius: 50%;"></div>
            <p style="margin: 0; font-size: 0.9rem;">12:00 PM - Left home</p>
        </div>
    `;
}

// --- Doctor Clinical View ---
let currentClinicalFilter = 'all';

async function fetchClinicalData() {
    try {
        const res = await fetch(`${API_BASE}/elderly?doctor_id=${currentUserId}`);
        const elderly = await res.json();
        globalElderlyData = elderly;

        // Update stats cards
        const countEl = document.getElementById('doctorPatientCount');
        if (countEl) countEl.innerText = elderly.length;
        const highRiskCount = elderly.filter(e => (100 - e.adherence_pct) > 40 || e.status === 'Danger').length;
        const hrEl = document.getElementById('doctorHighRiskCount');
        if (hrEl) hrEl.innerText = highRiskCount;

        renderClinicalTable(currentClinicalFilter);
        loadDoctorInbox();
    } catch (e) { 
        console.error('fetchClinicalData error:', e); 
        const tbody = document.getElementById('clinicalTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="text-danger" style="text-align:center;padding:2rem;">Failed to load patients. Is the backend running on port 5000?</td></tr>';
    }
}

async function loadDoctorInbox() {
    const inbox = document.getElementById('doctorInbox');
    if (!inbox) return;
    try {
        const res = await fetch(`${API_BASE}/messages`);
        const msgs = await res.json();
        // Filter messages relevant to this doctor (sent TO or FROM this doctor)
        const doctorMsgs = msgs.filter(m => m.recipient === currentUserId || m.sender === currentUserId);
        
        // Update message count stat
        const msgCountEl = document.getElementById('doctorMsgCount');
        if (msgCountEl) msgCountEl.innerText = doctorMsgs.length;

        if (doctorMsgs.length === 0) {
            inbox.innerHTML = '<p class="text-muted" style="text-align:center;padding:1rem;">No messages from patients yet.</p>';
            return;
        }
        inbox.innerHTML = '';
        doctorMsgs.forEach(m => {
            const isFromMe = m.sender === currentUserId;
            const borderColor = isFromMe ? 'var(--primary)' : 'var(--success)';
            const direction = isFromMe ? '→ Sent to' : '← From';
            const otherParty = isFromMe ? m.recipient : m.sender;
            inbox.innerHTML += `
                <div style="border-left:3px solid ${borderColor};padding:0.75rem;margin-bottom:0.5rem;background:rgba(255,255,255,0.02);border-radius:0 0.25rem 0.25rem 0;">
                    <div class="d-flex justify-between align-center" style="margin-bottom:0.25rem;">
                        <strong style="font-size:0.9rem;">${direction} ${getFriendlyName(otherParty)}</strong>
                        <span class="text-muted" style="font-size:0.75rem;">${m.timestamp}</span>
                    </div>
                    <p style="margin:0;font-size:0.85rem;color:var(--text-muted);">${m.body}</p>
                    ${!isFromMe ? '<button class="btn btn-sm btn-outline" style="margin-top:0.5rem;" onclick="openMessageModal(\'' + otherParty + '\')"><i class="fa-solid fa-reply"></i> Reply</button>' : ''}
                </div>
            `;
        });
    } catch(e) { 
        console.error('loadDoctorInbox error:', e);
        inbox.innerHTML = '<p class="text-muted">Failed to load messages.</p>'; 
    }
}

async function loadDoctorConsultations() {
    const container = document.getElementById('doctorConsultationsList');
    if (!container) return;
    try {
        const res = await fetch(`${API_BASE}/consultations`);
        const consults = await res.json();
        if (consults.length === 0) {
            container.innerHTML = '<p class="text-muted" style="text-align:center;padding:1rem;">No consultations scheduled yet.</p>';
            return;
        }
        container.innerHTML = '';
        consults.forEach(c => {
            const isCompleted = c.status === 'Completed';
            const borderColor = isCompleted ? 'var(--success)' : 'var(--warning)';
            const statusIcon = isCompleted ? '<i class="fa-solid fa-check text-success"></i>' : '<i class="fa-regular fa-clock text-warning"></i>';
            const statusLabel = isCompleted ? '<span class="text-success" style="font-size:0.85rem;">Completed</span>' : '<span class="chip">Upcoming</span>';
            container.innerHTML += `
                <div style="background:rgba(255,255,255,0.02);border:1px solid var(--border);padding:1rem;border-radius:0.5rem;margin-bottom:0.75rem;border-left:3px solid ${borderColor};">
                    <div class="d-flex justify-between align-center mb-1">
                        <strong>${statusIcon} ${c.scheduled_at} - ${getFriendlyName(c.doctor_name)}</strong>
                        ${statusLabel}
                    </div>
                    <p class="text-muted" style="font-size:0.85rem;">${c.specialty}${c.notes ? ' – ' + c.notes : ''}</p>
                </div>
            `;
        });
    } catch(e) { 
        console.error(e);
        container.innerHTML = '<p class="text-muted">Failed to load consultations.</p>';
    }
}

function renderClinicalTable(filterType = 'all') {
    currentClinicalFilter = filterType;
    
    const chips = document.querySelectorAll('#clinical .filter-bar .chip');
    if (chips.length > 0) {
        chips.forEach(c => c.classList.remove('active'));
        if(filterType === 'all') chips[0].classList.add('active');
        else if(filterType === 'high-risk') chips[1].classList.add('active');
        else if(filterType === 'review') chips[2].classList.add('active');
    }

    const tbody = document.getElementById('clinicalTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    let filteredData = globalElderlyData;
    if (filterType === 'high-risk') {
        filteredData = globalElderlyData.filter(e => (100 - e.adherence_pct) > 40 || e.status === 'Danger');
    } else if (filterType === 'review') {
        filteredData = globalElderlyData.filter(e => e.status !== 'Safe');
    }

    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-muted" style="text-align:center;padding:2rem;">No patients match this filter.</td></tr>';
        return;
    }
    
    filteredData.forEach(e => {
        const color = e.status === 'Safe' ? 'var(--success)' : e.status === 'Warning' ? 'var(--warning)' : 'var(--danger)';
        const risk = 100 - e.adherence_pct;
        
        tbody.innerHTML += `
            <tr>
                <td style="font-weight: bold; color: var(--text-main); cursor: pointer;" onclick="openSidebar(${e.elder_id})"><i class="fa-solid fa-user-circle"></i> ${e.name}</td>
                <td class="text-muted">76</td>
                <td>Diabetes, HTN</td>
                <td style="color: ${e.adherence_pct > 80 ? 'var(--success)' : 'var(--warning)'};">${e.adherence_pct}%</td>
                <td style="color: ${risk > 40 ? 'var(--danger)' : 'var(--success)'};">${risk}</td>
                <td style="color: ${color};"><i class="fa-solid fa-circle" style="font-size: 0.5rem; margin-right: 0.5rem;"></i>${e.status}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="openMessageModal('${e.login_id}')"><i class="fa-solid fa-message"></i> Msg</button>
                </td>
            </tr>
        `;
    });
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

async function logHealth(type) {
    const severity = (type === 'Fall') ? 'Critical' : (type === 'Felt Dizzy') ? 'Warning' : 'Info';
    try {
        const res = await fetch(`${API_BASE}/health-logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_type: type, severity: severity, notes: `${type} logged by patient` })
        });
        const data = await res.json();
        if (data.success) {
            showToast(`${type} logged to database (ID: ${data.log_id})`, severity === 'Critical' ? 'danger' : 'success');
            loadHealthLogs();
            updateNotifBadge();
        }
    } catch (e) {
        showToast('Failed to log event – server offline', 'danger');
    }
    submitCheckinPayload(1, 0, 0, type);
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

// SOS Logic
let sosTimeout;
let sosProgressInterval;
function startSOS() {
    const bar = document.getElementById('sosProgress');
    bar.style.transition = 'width 3s linear';
    bar.style.width = '100%';
    
    sosTimeout = setTimeout(async () => {
        // Create emergency modal
        let sosModal = document.getElementById('sosModal');
        if (!sosModal) {
            sosModal = document.createElement('div');
            sosModal.id = 'sosModal';
            sosModal.className = 'modal';
            sosModal.innerHTML = `
                <div class="modal-content" style="max-width:450px;border:2px solid var(--danger);text-align:center;">
                    <div class="d-flex justify-end mb-1">
                        <button class="btn btn-outline btn-sm" onclick="closeModal('sosModal')">✕</button>
                    </div>
                    <div style="font-size:4rem;margin-bottom:1rem;">🆘</div>
                    <h2 class="text-danger" style="margin-bottom:1rem;">EMERGENCY SOS TRIGGERED</h2>
                    <div style="text-align:left;background:rgba(239,68,68,0.1);padding:1rem;border-radius:0.5rem;margin-bottom:1rem;">
                        <p style="margin-bottom:0.5rem;"><i class="fa-solid fa-phone text-success"></i> Calling Primary Caregiver...</p>
                        <p style="margin-bottom:0.5rem;"><i class="fa-solid fa-location-dot text-primary"></i> Sharing live location...</p>
                        <p><i class="fa-solid fa-bell text-warning"></i> Alerting all assigned staff...</p>
                    </div>
                    <p class="text-muted" style="font-size:0.85rem;margin-bottom:1rem;">Emergency services have been notified. Stay calm.</p>
                    <button class="btn btn-outline" style="width:100%;justify-content:center;" onclick="closeModal('sosModal')">Dismiss</button>
                </div>
            `;
            document.body.appendChild(sosModal);
        }
        sosModal.classList.add('active');
        await submitCheckinPayload(1, 0, 0, 'SOS');
        try {
            await fetch(`${API_BASE}/health-logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_type: 'SOS Emergency', severity: 'Critical', notes: 'Patient triggered SOS button' })
            });
        } catch(e) { console.error(e); }
        cancelSOS();
    }, 3000);
}

function cancelSOS() {
    clearTimeout(sosTimeout);
    const bar = document.getElementById('sosProgress');
    bar.style.transition = 'width 0.1s linear';
    bar.style.width = '0%';
}

// --- Listen to React Parent for WebSockets ---
window.addEventListener("message", (event) => {
    if (event.data && event.data.type === 'PATIENT_UPDATE') {
        const payload = event.data.payload;
        console.log("Legacy UI received patient update via React:", payload);
        // We can re-fetch data or show a small alert
        fetchElderlyCards();
        fetchDashboardStats();
        // Show a brief toast message in the legacy UI
        const toast = document.createElement('div');
        toast.style = "position: fixed; bottom: 20px; right: 20px; background: var(--success); color: white; padding: 1rem; border-radius: 0.5rem; z-index: 9999; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: opacity 0.5s;";
        toast.innerHTML = `<i class="fa-solid fa-location-dot"></i> Check-in updated for Elder ID: ${payload.elder_id}`;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 4000);
    }
});

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : type === 'danger' ? 'var(--danger)' : 'var(--primary)';
    toast.style = `position: fixed; bottom: 20px; right: 20px; background: ${bgColor}; color: white; padding: 1rem; border-radius: 0.5rem; z-index: 9999; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: opacity 0.5s; display: flex; align-items: center; gap: 0.5rem; max-width: 400px;`;
    
    let icon = 'fa-circle-info';
    if(type === 'success') icon = 'fa-circle-check';
    if(type === 'warning' || type === 'danger') icon = 'fa-triangle-exclamation';
    
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ==========================================
// REAL PATIENT ACTION HANDLERS
// ==========================================

// --- Messaging ---
function getFriendlyName(id) {
    const map = {
        'doctor1': 'Dr. Patel',
        'doctor2': 'Dr. Sharma',
        'patient1': 'Alice Smith',
        'patient2': 'Bob Jones',
        'patient3': 'Carol White',
        'patient4': 'David Miller'
    };
    return map[id] || id;
}

async function openMessageModal(doctorName) {
    const modal = document.getElementById('messageModal');
    if (!modal) {
        // Create modal dynamically
        const m = document.createElement('div');
        m.id = 'messageModal';
        m.className = 'modal';
        m.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="d-flex justify-between align-center mb-2">
                    <h3 id="msgModalTitle">Message Doctor</h3>
                    <button class="btn btn-outline btn-sm" onclick="closeModal('messageModal')">✕</button>
                </div>
                <textarea id="msgBody" rows="4" placeholder="Type your message..." style="width: 100%; background: var(--bg); color: var(--text-main); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.75rem; font-family: 'Outfit',sans-serif; resize: vertical; margin-bottom: 1rem;"></textarea>
                <button id="msgSendBtn" class="btn btn-primary" style="width: 100%; justify-content: center;" onclick="sendMessage()">
                    <i class="fa-solid fa-paper-plane"></i> Send Message
                </button>
                <div id="msgHistory" style="margin-top: 1rem; max-height: 200px; overflow-y: auto;"></div>
            </div>
        `;
        document.body.appendChild(m);
    }
    document.getElementById('msgModalTitle').innerText = `Message ${getFriendlyName(doctorName)}`;
    document.getElementById('msgBody').value = '';
    document.getElementById('msgSendBtn').setAttribute('data-recipient', doctorName);
    document.getElementById('messageModal').classList.add('active');
    // Load message history
    try {
        const res = await fetch(`${API_BASE}/messages`);
        const msgs = await res.json();
        const filtered = msgs.filter(m => m.recipient === doctorName || m.sender === doctorName);
        const histDiv = document.getElementById('msgHistory');
        if (filtered.length > 0) {
            histDiv.innerHTML = '<p class="text-muted" style="font-size:0.8rem; margin-bottom:0.5rem;">Previous messages:</p>' +
                filtered.map(m => `<div style="background:rgba(255,255,255,0.03);padding:0.5rem;border-radius:0.25rem;margin-bottom:0.5rem;font-size:0.85rem;"><strong>${getFriendlyName(m.sender)}</strong>: ${m.body} <span class="text-muted" style="font-size:0.75rem;">${m.timestamp}</span></div>`).join('');
        } else {
            histDiv.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">No previous messages.</p>';
        }
    } catch(e) { console.error(e); }
}

async function sendMessage() {
    const btn = document.getElementById('msgSendBtn');
    const body = document.getElementById('msgBody').value.trim();
    const recipient = btn.getAttribute('data-recipient');
    if (!body) { showToast('Please type a message', 'warning'); return; }
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    try {
        const res = await fetch(`${API_BASE}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient, body, sender: currentUserId })
        });
        const data = await res.json();
        if (data.success) {
            showToast(`Message delivered to ${getFriendlyName(recipient)}`, 'success');
            document.getElementById('msgBody').value = '';
            // Refresh history
            openMessageModal(recipient);
            updateNotifBadge();
            // Refresh doctor inbox if in doctor mode
            if (currentRole === 'doctor') loadDoctorInbox();
        }
    } catch(e) {
        showToast('Failed to send – server offline', 'danger');
    }
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    btn.disabled = false;
}

// --- Book Consultation ---
async function bookConsultation(doctorName, specialty) {
    const modal = document.getElementById('bookModal');
    if (!modal) {
        const m = document.createElement('div');
        m.id = 'bookModal';
        m.className = 'modal';
        m.innerHTML = `
            <div class="modal-content" style="max-width: 450px;">
                <div class="d-flex justify-between align-center mb-2">
                    <h3 id="bookModalTitle">Book Consultation</h3>
                    <button class="btn btn-outline btn-sm" onclick="closeModal('bookModal')">✕</button>
                </div>
                <label class="text-muted" style="font-size:0.85rem;">Select Date & Time:</label>
                <input type="datetime-local" id="bookDateTime" style="width:100%;background:var(--bg);color:var(--text-main);border:1px solid var(--border);border-radius:0.5rem;padding:0.75rem;margin:0.5rem 0 1rem;font-family:'Outfit',sans-serif;">
                <button id="bookConfirmBtn" class="btn btn-success" style="width:100%;justify-content:center;">
                    <i class="fa-solid fa-calendar-check"></i> Confirm Booking
                </button>
            </div>
        `;
        document.body.appendChild(m);
    }
    document.getElementById('bookModalTitle').innerText = `Book ${getFriendlyName(doctorName)}`;
    document.getElementById('bookDateTime').value = '';
    const confirmBtn = document.getElementById('bookConfirmBtn');
    confirmBtn.onclick = async () => {
        const dt = document.getElementById('bookDateTime').value;
        if (!dt) { showToast('Please select a date & time', 'warning'); return; }
        const formatted = new Date(dt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
        confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Booking...';
        confirmBtn.disabled = true;
        try {
            const res = await fetch(`${API_BASE}/consultations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ doctor_name: doctorName, specialty, scheduled_at: formatted })
            });
            const data = await res.json();
            if (data.success) {
                showToast(`Consultation booked with ${getFriendlyName(doctorName)} on ${formatted}`, 'success');
                closeModal('bookModal');
                loadConsultations();
                updateNotifBadge();
            }
        } catch(e) {
            showToast('Booking failed – server offline', 'danger');
        }
        confirmBtn.innerHTML = '<i class="fa-solid fa-calendar-check"></i> Confirm Booking';
        confirmBtn.disabled = false;
    };
    document.getElementById('bookModal').classList.add('active');
}

// --- Load Consultations from DB ---
async function loadConsultations() {
    try {
        const res = await fetch(`${API_BASE}/consultations`);
        const consults = await res.json();
        const container = document.getElementById('consultationsList');
        if (!container) return;
        container.innerHTML = '';
        consults.forEach(c => {
            const isCompleted = c.status === 'Completed';
            const borderColor = isCompleted ? 'var(--success)' : 'var(--warning)';
            const statusIcon = isCompleted ? '<i class="fa-solid fa-check text-success"></i>' : '<i class="fa-regular fa-clock text-warning"></i>';
            const statusLabel = isCompleted ? '<span class="text-success" style="font-size:0.85rem;">Completed</span>' : '<span class="chip">Upcoming</span>';
            const actions = isCompleted
                ? `<div class="mt-2" style="margin-top:0.5rem;display:flex;gap:0.5rem;">
                     <button class="btn btn-sm btn-outline" onclick="showConsultNotes('${c.notes.replace(/'/g, "\\'")}')">View Notes</button>
                   </div>`
                : `<div class="mt-2" style="margin-top:0.5rem;display:flex;gap:0.5rem;">
                     <button class="btn btn-sm btn-outline" onclick="openMessageModal('${c.doctor_name}')">Message</button>
                     <button class="btn btn-sm btn-outline" onclick="addReminder('${c.doctor_name}','${c.scheduled_at}')">Add Reminder</button>
                   </div>`;
            container.innerHTML += `
                <div style="background:rgba(255,255,255,0.02);border:1px solid var(--border);padding:1rem;border-radius:0.5rem;margin-bottom:1rem;border-left:3px solid ${borderColor};">
                    <div class="d-flex justify-between align-center mb-1">
                        <strong>${statusIcon} ${c.scheduled_at} - ${c.doctor_name}</strong>
                        ${statusLabel}
                    </div>
                    <p class="text-muted" style="font-size:0.85rem;">${c.specialty}${c.notes ? ' – ' + c.notes : ''}</p>
                    ${actions}
                </div>
            `;
        });
    } catch(e) { console.error(e); }
}

function showConsultNotes(notes) {
    const modal = document.getElementById('notesModal');
    if (!modal) {
        const m = document.createElement('div');
        m.id = 'notesModal';
        m.className = 'modal';
        m.innerHTML = `
            <div class="modal-content" style="max-width:450px;">
                <div class="d-flex justify-between align-center mb-2">
                    <h3>Doctor Notes</h3>
                    <button class="btn btn-outline btn-sm" onclick="closeModal('notesModal')">✕</button>
                </div>
                <div id="notesContent" style="background:var(--bg);padding:1rem;border-radius:0.5rem;font-size:0.9rem;"></div>
            </div>
        `;
        document.body.appendChild(m);
    }
    document.getElementById('notesContent').innerText = notes;
    document.getElementById('notesModal').classList.add('active');
}

function addReminder(doctor, time) {
    showToast(`Reminder set for ${doctor} on ${time}`, 'success');
}

// --- Medication Refills ---
async function requestRefill(medicationName, pharmacy) {
    try {
        const res = await fetch(`${API_BASE}/refills`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ medication_name: medicationName, pharmacy })
        });
        const data = await res.json();
        if (data.success) {
            showToast(`Refill #${data.refill_id} submitted to ${pharmacy} (Status: ${data.status})`, 'success');
            loadRefills();
            updateNotifBadge();
        }
    } catch(e) {
        showToast('Refill request failed – server offline', 'danger');
    }
}

async function loadRefills() {
    try {
        const res = await fetch(`${API_BASE}/refills`);
        const refills = await res.json();
        const container = document.getElementById('refillHistory');
        if (!container) return;
        if (refills.length === 0) {
            container.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">No refill history yet.</p>';
            return;
        }
        container.innerHTML = '<h4 class="text-muted" style="font-size:0.75rem;text-transform:uppercase;margin-bottom:0.5rem;">Refill History (from Database)</h4>';
        refills.forEach(r => {
            const color = r.status === 'Pending' ? 'var(--warning)' : 'var(--success)';
            container.innerHTML += `<div style="font-size:0.85rem;margin-bottom:0.5rem;display:flex;justify-content:space-between;"><span>${r.medication_name} → ${r.pharmacy}</span><span style="color:${color}">${r.status} (${r.timestamp})</span></div>`;
        });
    } catch(e) { console.error(e); }
}

// --- Set Medication Alert ---
function setMedAlert(medicationName) {
    if (Notification.permission === 'granted' || Notification.permission === 'default') {
        Notification.requestPermission().then(perm => {
            if (perm === 'granted') {
                showToast(`Browser alert enabled for ${medicationName}`, 'success');
            } else {
                showToast(`Alert saved in-app for ${medicationName}`, 'success');
            }
        });
    } else {
        showToast(`Alert saved in-app for ${medicationName}`, 'success');
    }
}

// --- Download Prescription List ---
function downloadPrescriptions() {
    const text = `SafeGuard - Prescription Report\n================================\nGenerated: ${new Date().toLocaleString()}\n\n1. Metformin 1000mg\n   Prescribed by: Dr. Patel (Oct 1, 2024)\n   Dosage: Once daily (morning)\n   Refills: 2 remaining\n   Pharmacy: Apollo (2km)\n\n2. Atenolol 50mg\n   Prescribed by: Dr. Sharma (Sep 15)\n   Dosage: Once daily (evening)\n   Refills: 0 remaining (Expiring Oct 15)\n\nAllergies: Penicillin\nInteractions: Avoid Alcohol with Atenolol\n`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'safeguard_prescriptions.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Prescription report downloaded', 'success');
}

// --- Devices ---
async function loadDevices() {
    try {
        const res = await fetch(`${API_BASE}/devices`);
        const devices = await res.json();
        const container = document.getElementById('devicesGrid');
        if (!container) return;
        container.innerHTML = '';
        devices.forEach(d => {
            const battColor = d.battery > 50 ? 'var(--success)' : d.battery > 20 ? 'var(--warning)' : 'var(--danger)';
            container.innerHTML += `
                <div class="card" style="border-left: 4px solid ${battColor};">
                    <div class="d-flex justify-between align-center mb-1">
                        <h3 style="margin:0;"><i class="fa-solid ${d.device_type === 'Smartwatch' ? 'fa-clock' : 'fa-heart-pulse'}"></i> ${d.name}</h3>
                        <span style="color:${battColor};font-size:0.85rem;">✓ ${d.status} (${d.battery}%)</span>
                    </div>
                    <div style="margin: 1rem 0;">
                        <div style="width:100%;height:6px;background:var(--bg);border-radius:3px;">
                            <div style="width:${d.battery}%;height:100%;background:${battColor};border-radius:3px;"></div>
                        </div>
                    </div>
                    <div style="display:flex;gap:0.5rem;">
                        <button class="btn btn-sm btn-outline" style="flex:1;justify-content:center;" onclick="showToast('${d.name} settings loaded','success')">Settings</button>
                        <button class="btn btn-sm btn-danger" style="justify-content:center;" onclick="removeDevice(${d.device_id},'${d.name}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
        // Add the activity ring card
        container.innerHTML += `
            <div class="card">
                <h3 class="mb-1 text-primary">Daily Activity Ring</h3>
                <div style="text-align:center;padding:1rem 0;">
                    <div style="position:relative;width:120px;height:120px;margin:0 auto;border-radius:50%;border:10px solid var(--border);border-top-color:var(--success);transform:rotate(-45deg);">
                        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(45deg);font-size:1.5rem;font-weight:bold;color:var(--success);">100%</div>
                    </div>
                    <p class="text-muted" style="margin-top:1rem;">All activity goals met!</p>
                </div>
            </div>
        `;
    } catch(e) { console.error(e); }
}

async function addDevice() {
    const modal = document.getElementById('addDeviceModal');
    if (!modal) {
        const m = document.createElement('div');
        m.id = 'addDeviceModal';
        m.className = 'modal';
        m.innerHTML = `
            <div class="modal-content" style="max-width:400px;">
                <div class="d-flex justify-between align-center mb-2">
                    <h3>Add Device</h3>
                    <button class="btn btn-outline btn-sm" onclick="closeModal('addDeviceModal')">✕</button>
                </div>
                <input type="text" id="deviceName" placeholder="Device name (e.g. Fitbit Charge 5)" style="width:100%;background:var(--bg);color:var(--text-main);border:1px solid var(--border);border-radius:0.5rem;padding:0.75rem;margin-bottom:0.75rem;font-family:'Outfit',sans-serif;">
                <select id="deviceType" style="width:100%;background:var(--bg);color:var(--text-main);border:1px solid var(--border);border-radius:0.5rem;padding:0.75rem;margin-bottom:1rem;font-family:'Outfit',sans-serif;">
                    <option value="Smartwatch">Smartwatch</option>
                    <option value="BP Monitor">BP Monitor</option>
                    <option value="Glucose Monitor">Glucose Monitor</option>
                    <option value="Pulse Oximeter">Pulse Oximeter</option>
                    <option value="Other">Other</option>
                </select>
                <button class="btn btn-primary" style="width:100%;justify-content:center;" onclick="submitDevice()">
                    <i class="fa-solid fa-plus"></i> Add Device
                </button>
            </div>
        `;
        document.body.appendChild(m);
    }
    document.getElementById('deviceName').value = '';
    document.getElementById('addDeviceModal').classList.add('active');
}

async function submitDevice() {
    const name = document.getElementById('deviceName').value.trim();
    const type = document.getElementById('deviceType').value;
    if (!name) { showToast('Enter a device name', 'warning'); return; }
    try {
        const res = await fetch(`${API_BASE}/devices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, device_type: type })
        });
        const data = await res.json();
        if (data.success) {
            showToast(`${name} added successfully`, 'success');
            closeModal('addDeviceModal');
            loadDevices();
            updateNotifBadge();
        }
    } catch(e) {
        showToast('Failed to add device', 'danger');
    }
}

async function removeDevice(id, name) {
    if (!confirm(`Remove ${name}?`)) return;
    try {
        await fetch(`${API_BASE}/devices/${id}`, { method: 'DELETE' });
        showToast(`${name} removed`, 'warning');
        loadDevices();
    } catch(e) { showToast('Failed to remove device', 'danger'); }
}

// --- Profile ---
async function loadProfile() {
    try {
        const res = await fetch(`${API_BASE}/profile`);
        const p = await res.json();
        const container = document.getElementById('profileData');
        if (!container) return;
        container.innerHTML = `
            <div style="text-align:center;margin-bottom:1.5rem;">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=10B981&color=fff&rounded=true&size=100" alt="Profile" style="margin-bottom:1rem;">
                <h3 style="margin:0;" id="profileName">${p.name}</h3>
                <p class="text-muted">Blood Group: ${p.blood_group}</p>
            </div>
            <div style="border-top:1px solid var(--border);padding-top:1rem;">
                <div class="d-flex justify-between mb-1"><span class="text-muted">Email</span><span id="profileEmail">${p.email}</span></div>
                <div class="d-flex justify-between mb-1"><span class="text-muted">Phone</span><span id="profilePhone">${p.phone}</span></div>
                <div class="d-flex justify-between mb-1"><span class="text-muted">Date of Birth</span><span>${p.dob}</span></div>
                <div class="d-flex justify-between mb-1"><span class="text-muted">Address</span><span>${p.address}</span></div>
                <button class="btn btn-outline w-100 mt-2" style="width:100%;justify-content:center;margin-top:1rem;" onclick="editProfile()">Edit Profile</button>
            </div>
        `;
    } catch(e) { console.error(e); }
}

function editProfile() {
    const modal = document.getElementById('editProfileModal');
    if (!modal) {
        const m = document.createElement('div');
        m.id = 'editProfileModal';
        m.className = 'modal';
        m.innerHTML = `
            <div class="modal-content" style="max-width:450px;">
                <div class="d-flex justify-between align-center mb-2">
                    <h3>Edit Profile</h3>
                    <button class="btn btn-outline btn-sm" onclick="closeModal('editProfileModal')">✕</button>
                </div>
                <div style="display:grid;gap:0.75rem;">
                    <input type="text" id="editName" placeholder="Full Name" style="width:100%;background:var(--bg);color:var(--text-main);border:1px solid var(--border);border-radius:0.5rem;padding:0.75rem;font-family:'Outfit',sans-serif;">
                    <input type="email" id="editEmail" placeholder="Email" style="width:100%;background:var(--bg);color:var(--text-main);border:1px solid var(--border);border-radius:0.5rem;padding:0.75rem;font-family:'Outfit',sans-serif;">
                    <input type="text" id="editPhone" placeholder="Phone" style="width:100%;background:var(--bg);color:var(--text-main);border:1px solid var(--border);border-radius:0.5rem;padding:0.75rem;font-family:'Outfit',sans-serif;">
                    <input type="text" id="editAddress" placeholder="Address" style="width:100%;background:var(--bg);color:var(--text-main);border:1px solid var(--border);border-radius:0.5rem;padding:0.75rem;font-family:'Outfit',sans-serif;">
                    <button class="btn btn-success" style="width:100%;justify-content:center;" onclick="saveProfile()">
                        <i class="fa-solid fa-floppy-disk"></i> Save Changes
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(m);
    }
    // Pre-fill with current values
    const name = document.getElementById('profileName');
    const email = document.getElementById('profileEmail');
    const phone = document.getElementById('profilePhone');
    if (name) document.getElementById('editName').value = name.innerText;
    if (email) document.getElementById('editEmail').value = email.innerText;
    if (phone) document.getElementById('editPhone').value = phone.innerText;
    document.getElementById('editProfileModal').classList.add('active');
}

async function saveProfile() {
    const data = {
        name: document.getElementById('editName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        address: document.getElementById('editAddress').value.trim()
    };
    // Remove empty fields
    Object.keys(data).forEach(k => { if (!data[k]) delete data[k]; });
    try {
        const res = await fetch(`${API_BASE}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
            showToast('Profile updated successfully', 'success');
            closeModal('editProfileModal');
            loadProfile();
        }
    } catch(e) {
        showToast('Failed to save profile', 'danger');
    }
}

// --- Notifications ---
async function handleNotifications() {
    const modal = document.getElementById('notifModal');
    if (!modal) {
        const m = document.createElement('div');
        m.id = 'notifModal';
        m.className = 'modal';
        m.innerHTML = `
            <div class="modal-content" style="max-width:500px;">
                <div class="d-flex justify-between align-center mb-2">
                    <h3><i class="fa-solid fa-bell"></i> Notifications</h3>
                    <button class="btn btn-outline btn-sm" onclick="closeModal('notifModal')">✕</button>
                </div>
                <div id="notifList" style="max-height:400px;overflow-y:auto;"></div>
            </div>
        `;
        document.body.appendChild(m);
    }
    document.getElementById('notifModal').classList.add('active');
    try {
        const res = await fetch(`${API_BASE}/notifications`);
        const notifs = await res.json();
        const container = document.getElementById('notifList');
        if (notifs.length === 0) {
            container.innerHTML = '<p class="text-muted" style="text-align:center;padding:2rem;">No notifications yet.</p>';
            return;
        }
        container.innerHTML = '';
        notifs.forEach(n => {
            const bg = n.read ? 'transparent' : 'rgba(79,70,229,0.1)';
            const dot = n.read ? '' : '<span style="width:8px;height:8px;border-radius:50%;background:var(--primary);display:inline-block;margin-right:0.5rem;"></span>';
            container.innerHTML += `
                <div style="background:${bg};padding:0.75rem;border-radius:0.5rem;margin-bottom:0.5rem;border:1px solid var(--border);cursor:pointer;" onclick="markNotifRead(${n.notif_id},this)">
                    <div class="d-flex justify-between align-center">
                        <strong style="font-size:0.9rem;">${dot}${n.title}</strong>
                        <span class="text-muted" style="font-size:0.75rem;">${n.timestamp}</span>
                    </div>
                    <p class="text-muted" style="font-size:0.85rem;margin:0.25rem 0 0;">${n.body}</p>
                </div>
            `;
        });
    } catch(e) {
        document.getElementById('notifList').innerHTML = '<p class="text-muted">Failed to load notifications.</p>';
    }
}

async function markNotifRead(id, el) {
    try {
        await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
        el.style.background = 'transparent';
        el.querySelector('span[style*="border-radius:50%"]')?.remove();
        updateNotifBadge();
    } catch(e) { console.error(e); }
}

async function updateNotifBadge() {
    try {
        const res = await fetch(`${API_BASE}/notifications/count`);
        const data = await res.json();
        const badge = document.getElementById('alertBadge');
        if (badge) badge.innerText = data.unread || '0';
    } catch(e) { console.error(e); }
}

// --- Health Log History ---
async function loadHealthLogs() {
    try {
        const res = await fetch(`${API_BASE}/health-logs`);
        const logs = await res.json();
        const container = document.getElementById('healthLogHistory');
        if (!container) return;
        if (logs.length === 0) {
            container.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">No health events recorded yet. Use the quick log buttons above.</p>';
            return;
        }
        container.innerHTML = '<h4 class="text-muted" style="font-size:0.75rem;text-transform:uppercase;margin-bottom:0.5rem;">Recent Health Logs (from DB)</h4>';
        logs.slice(0, 5).forEach(l => {
            const color = l.severity === 'Critical' ? 'var(--danger)' : l.severity === 'Warning' ? 'var(--warning)' : 'var(--success)';
            container.innerHTML += `<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.5rem;padding:0.5rem;background:rgba(255,255,255,0.02);border-radius:0.25rem;border-left:3px solid ${color};"><span>${l.event_type}</span><span class="text-muted">${l.timestamp}</span></div>`;
        });
    } catch(e) { console.error(e); }
}

// --- Emergency Contact ---
function addEmergencyContact() {
    const modal = document.getElementById('addContactModal');
    if (!modal) {
        const m = document.createElement('div');
        m.id = 'addContactModal';
        m.className = 'modal';
        m.innerHTML = `
            <div class="modal-content" style="max-width:400px;">
                <div class="d-flex justify-between align-center mb-2">
                    <h3>Add Emergency Contact</h3>
                    <button class="btn btn-outline btn-sm" onclick="closeModal('addContactModal')">✕</button>
                </div>
                <input type="text" id="contactName" placeholder="Contact Name" style="width:100%;background:var(--bg);color:var(--text-main);border:1px solid var(--border);border-radius:0.5rem;padding:0.75rem;margin-bottom:0.75rem;font-family:'Outfit',sans-serif;">
                <input type="text" id="contactRelation" placeholder="Relationship (e.g. Son, Nurse)" style="width:100%;background:var(--bg);color:var(--text-main);border:1px solid var(--border);border-radius:0.5rem;padding:0.75rem;margin-bottom:0.75rem;font-family:'Outfit',sans-serif;">
                <input type="text" id="contactPhone" placeholder="Phone Number" style="width:100%;background:var(--bg);color:var(--text-main);border:1px solid var(--border);border-radius:0.5rem;padding:0.75rem;margin-bottom:1rem;font-family:'Outfit',sans-serif;">
                <button class="btn btn-primary" style="width:100%;justify-content:center;" onclick="saveContact()">
                    <i class="fa-solid fa-user-plus"></i> Save Contact
                </button>
            </div>
        `;
        document.body.appendChild(m);
    }
    document.getElementById('contactName').value = '';
    document.getElementById('contactRelation').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('addContactModal').classList.add('active');
}

function saveContact() {
    const name = document.getElementById('contactName').value.trim();
    const relation = document.getElementById('contactRelation').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    if (!name || !phone) { showToast('Name and phone are required', 'warning'); return; }
    
    // Add to the contacts list in the DOM
    const contactsList = document.querySelector('#my-profile .card:last-child');
    if (contactsList) {
        const btn = contactsList.querySelector('button');
        const newContact = document.createElement('div');
        newContact.style = 'background:rgba(255,255,255,0.02);border:1px solid var(--border);padding:1rem;border-radius:0.5rem;margin-bottom:1rem;';
        newContact.innerHTML = `
            <h4 style="margin:0 0 0.25rem 0;">${name} (${relation})</h4>
            <p class="text-success" style="font-size:0.85rem;margin-bottom:0.5rem;"><i class="fa-solid fa-user-check"></i> Emergency Contact</p>
            <p class="text-muted" style="font-size:0.85rem;margin-bottom:0;">${phone}</p>
        `;
        btn.parentNode.insertBefore(newContact, btn);
    }
    showToast(`${name} added as emergency contact`, 'success');
    closeModal('addContactModal');
}

// Keep legacy handleAction for any remaining simple buttons
function handleAction(btn, newText, toastMessage, toastType = 'success') {
    if(btn.disabled) return;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;
    btn.style.opacity = '0.7';
    setTimeout(() => {
        showToast(toastMessage, toastType);
        btn.innerHTML = newText;
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
        if(toastType === 'success') {
            btn.classList.remove('btn-primary', 'btn-outline', 'btn-danger', 'btn-warning');
            btn.classList.add('btn-success');
        }
    }, 800);
}


// --- Modal Dragging Logic ---
let isDraggingModal = false;
let currentModalContent = null;
let dragStartX = 0;
let dragStartY = 0;
let initialTranslateX = 0;
let initialTranslateY = 0;

document.addEventListener('mousedown', (e) => {
    const modalContent = e.target.closest('.modal-content');
    if (!modalContent) return;
    
    // Prevent dragging if clicking on interactive elements
    const tag = e.target.tagName.toLowerCase();
    if (['input', 'button', 'textarea', 'select'].includes(tag) || e.target.closest('.btn') || e.target.closest('a')) return;

    isDraggingModal = true;
    currentModalContent = modalContent;
    
    // Get current transform
    const style = window.getComputedStyle(modalContent);
    const transform = style.transform;
    if (transform !== 'none') {
        const matrix = new DOMMatrixReadOnly(transform);
        initialTranslateX = matrix.m41;
        initialTranslateY = matrix.m42;
    } else {
        initialTranslateX = 0;
        initialTranslateY = 0;
    }
    
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    
    modalContent.style.cursor = 'grabbing';
    modalContent.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isDraggingModal || !currentModalContent) return;
    
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    
    currentModalContent.style.transform = `translate(${initialTranslateX + dx}px, ${initialTranslateY + dy}px)`;
});

document.addEventListener('mouseup', () => {
    if (isDraggingModal && currentModalContent) {
        currentModalContent.style.cursor = 'auto';
        currentModalContent.style.userSelect = 'auto';
        isDraggingModal = false;
        currentModalContent = null;
    }
});

// --- Enterprise Settings (Facilities & Org) ---
let globalFacilities = [
    { id: 1, name: "Apollo Care - Delhi", status: "Active", patients: 85, manager: "Priya Kumar", docs: 3, nurses: 8, alerts: 3, response: "12 mins" },
    { id: 2, name: "Apollo Care - Mumbai", status: "Active", patients: 65, manager: "Raj Singh", docs: 2, nurses: 6, alerts: 1, response: "9 mins" },
    { id: 3, name: "Apollo Care - Bangalore", status: "Active", patients: 30, manager: "Anita Desai", docs: 1, nurses: 4, alerts: 0, response: "8 mins" }
];

function loadFacilities() {
    const container = document.getElementById('facilitiesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    globalFacilities.forEach(f => {
        const alertClass = f.alerts > 0 ? (f.alerts > 2 ? 'text-danger' : 'text-warning') : 'text-success';
        
        container.innerHTML += `
            <div class="card" style="border-top: 4px solid var(--primary);">
                <h3 class="mb-1">${f.name}</h3>
                <p class="text-success" style="font-size: 0.85rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-circle-check"></i> ${f.status} (${f.patients} elderly)</p>
                <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 1rem;">Manager: ${f.manager}</p>
                <div class="d-flex justify-between text-muted" style="font-size: 0.85rem; margin-bottom: 0.25rem;"><span>Staff:</span> <span>${f.docs + f.nurses} (${f.docs} Docs, ${f.nurses} Nurses)</span></div>
                <div class="d-flex justify-between text-muted" style="font-size: 0.85rem; margin-bottom: 0.25rem;"><span>Alerts Today:</span> <span class="${alertClass}">${f.alerts} pending</span></div>
                <div class="d-flex justify-between text-muted" style="font-size: 0.85rem; margin-bottom: 1rem;"><span>Avg Response:</span> <span>${f.response}</span></div>
                <button class="btn btn-sm btn-outline w-100" style="width: 100%; justify-content: center;" onclick="showToast('Loading dashboard for ${f.name}...', 'success')">Manage Facility</button>
            </div>
        `;
    });
}

function addFacility() {
    const name = prompt("Enter Facility Name:");
    if (!name) return;
    const manager = prompt("Enter Manager Name:");
    if (!manager) return;
    
    globalFacilities.push({
        id: globalFacilities.length + 1,
        name: name,
        status: "Active",
        patients: 0,
        manager: manager,
        docs: 0,
        nurses: 0,
        alerts: 0,
        response: "-"
    });
    
    showToast('New facility added successfully.', 'success');
    loadFacilities();
}

function saveBrandSettings(btn) {
    const orgName = document.getElementById('orgNameInput').value;
    const pColor = document.getElementById('primaryColorInput').value;
    const sColor = document.getElementById('secondaryColorInput').value;
    const orgUrl = document.getElementById('orgUrlInput').value;
    
    // Update CSS variables globally
    document.documentElement.style.setProperty('--primary', pColor);
    document.documentElement.style.setProperty('--primary-hover', pColor);
    document.documentElement.style.setProperty('--success', sColor);
    
    // Update Branding in DOM
    const brandLabel = document.querySelector('.nav-brand');
    if (brandLabel) {
        brandLabel.innerHTML = `<i class="fa-solid fa-shield-heart"></i> ${orgName}`;
    }
    
    handleAction(btn, 'Save Brand Settings', 'Organization settings updated. Colors applied!', 'success');
}
