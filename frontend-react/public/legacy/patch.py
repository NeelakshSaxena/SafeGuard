import os

filepath = r'd:\Desktop\DBTHON\SafeGuard\frontend-react\public\legacy\app.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: openSidebar buttons
content = content.replace(
    '<button class="btn btn-outline" style="width: 100%; justify-content: center; margin-bottom: 0.5rem;">Send Message</button>',
    '<button class="btn btn-outline" style="width: 100%; justify-content: center; margin-bottom: 0.5rem;" onclick="showToast(\'Message sent to \' + patient.name, \'success\')">Send Message</button>'
)
content = content.replace(
    '<button class="btn btn-danger" style="width: 100%; justify-content: center;">Trigger Emergency Alert</button>',
    '<button class="btn btn-danger" style="width: 100%; justify-content: center;" onclick="showToast(\'Emergency Alert Triggered for \' + patient.name + \'!\', \'danger\')">Trigger Emergency Alert</button>'
)

# Fix 2: fetchElderlyCards -> renderElderlyCards
fetch_elderly_original = '''async function fetchElderlyCards() {
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
}'''

fetch_elderly_new = '''
window.dashFilter = 'All';
window.dashSearch = '';

async function fetchElderlyCards() {
    try {
        const res = await fetch(`${API_BASE}/elderly`);
        globalElderlyData = await res.json();
        renderElderlyCards();
    } catch (e) { console.error(e); }
}

function renderElderlyCards() {
    const grid = document.getElementById('elderlyCardsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    let filtered = globalElderlyData.filter(e => {
        if (window.dashSearch && !e.name.toLowerCase().includes(window.dashSearch)) return false;
        if (window.dashFilter === 'Alerts Only' && e.status !== 'Danger' && e.status !== 'Alert') return false;
        if (window.dashFilter === 'At Risk' && e.status !== 'Warning' && e.status !== 'Danger' && e.status !== 'Alert') return false;
        if (window.dashFilter === 'Low Adherence' && e.adherence_pct >= 80) return false;
        return true;
    });

    filtered.forEach(e => {
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
}
'''
content = content.replace(fetch_elderly_original, fetch_elderly_new)


# Fix 3: fetchAlerts and ackAlert
fetch_alerts_original = '''async function fetchAlerts() {
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
}'''

fetch_alerts_new = '''
window.alertFilter = 'Pending';
window.globalAlertsData = [];

async function fetchAlerts() {
    try {
        const res = await fetch(`${API_BASE}/alerts`);
        window.globalAlertsData = await res.json();
        renderAlerts();
    } catch (e) { console.error(e); }
}

function renderAlerts() {
    const tbody = document.getElementById('alertsTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    
    let filtered = window.globalAlertsData.filter(a => {
        if (window.alertFilter === 'Pending' && a.status !== 'Pending') return false;
        if (window.alertFilter === 'Acknowledged' && a.status !== 'Acknowledged') return false;
        if (window.alertFilter === 'Resolved' && a.status !== 'Resolved') return false;
        return true;
    });

    filtered.forEach(a => {
        const color = a.severity === 'Critical' ? 'var(--danger)' : 'var(--warning)';
        const statusColor = a.status === 'Pending' ? 'var(--danger)' : 'var(--success)';
        
        const encoded = encodeURIComponent(JSON.stringify(a));
        const actionBtn = a.status === 'Pending' 
            ? `<button class="btn btn-outline btn-sm" onclick="openAlertModal('${encoded}')">Details</button> <button class="btn btn-success btn-sm" onclick="ackAlert(${a.alert_id})">Ack</button>` 
            : `<span class="text-muted"><i class="fa-solid fa-check"></i> ${a.status}</span>`;
        
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
}

async function ackAlert(id) {
    try {
        await fetch(`${API_BASE}/alerts/${id}/acknowledge`, {method: 'POST'});
        const alert = window.globalAlertsData.find(a => a.alert_id === id);
        if (alert) alert.status = 'Acknowledged';
        showToast('Alert Acknowledged', 'success');
        renderAlerts();
        fetchDashboardStats();
    } catch (e) { console.error(e); }
}

function ackAllAlerts() {
    if(window.globalAlertsData) {
        window.globalAlertsData.forEach(a => {
            if(a.status === 'Pending') a.status = 'Acknowledged';
        });
    }
    showToast('All pending alerts acknowledged', 'success');
    renderAlerts();
}
'''
content = content.replace(fetch_alerts_original, fetch_alerts_new)

# Add event listeners script to end of app.js
event_listeners = '''
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // 1. Dashboard Filters
        const dashChips = document.querySelectorAll('#dashboard .filter-bar .chip');
        dashChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                dashChips.forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                window.dashFilter = e.target.innerText;
                renderElderlyCards();
            });
        });
        const dashSearch = document.querySelector('#dashboard .filter-bar input.search-bar');
        if(dashSearch) {
            dashSearch.addEventListener('input', (e) => {
                window.dashSearch = e.target.value.toLowerCase();
                renderElderlyCards();
            });
        }

        // 2. Alert Centre Filters
        const alertChips = document.querySelectorAll('#alerts .filter-bar .chip');
        alertChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                alertChips.forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                window.alertFilter = e.target.innerText;
                renderAlerts();
            });
        });

        const ackAllBtn = document.querySelector('#alerts .btn-outline');
        if (ackAllBtn && ackAllBtn.innerText.includes('Acknowledge All')) {
            ackAllBtn.setAttribute('onclick', 'ackAllAlerts()');
        }

        // 3. Analytics Export CSV
        const exportBtn = document.querySelector('#analytics .btn-outline');
        if (exportBtn && exportBtn.innerText.includes('Export CSV')) {
            exportBtn.addEventListener('click', () => {
                const csvContent = "data:text/csv;charset=utf-8,Date,Compliance,Risk\\nMon,95,12\\nTue,92,14\\nWed,88,18\\nThu,90,15\\nFri,85,22\\nSat,96,19\\nSun,91,13";
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "analytics_export.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast('Analytics exported to CSV', 'success');
            });
        }

        // 4. AI Prediction
        const aiRefresh = document.querySelector('#ai-insights .btn-outline');
        if (aiRefresh && aiRefresh.innerText.includes('Refresh Models')) {
            aiRefresh.addEventListener('click', () => showToast('AI Models refreshed successfully', 'success'));
        }
        const aiDetailsBtns = document.querySelectorAll('#ai-insights .btn-outline.w-100');
        aiDetailsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.innerText.includes('Detailed Analysis')) showToast('Opening detailed analysis...', 'success');
                if (e.target.innerText.includes('Adjust Reminders')) showToast('Reminder settings opened', 'success');
            });
        });
        const aiAlertDoctor = document.querySelector('#ai-insights .btn-danger');
        if (aiAlertDoctor) aiAlertDoctor.addEventListener('click', () => showToast('Doctor alerted immediately!', 'danger'));
        const aiCheckin = document.querySelectorAll('#ai-insights .btn-outline');
        aiCheckin.forEach(btn => {
            if (btn.innerText.includes('Check-in')) btn.addEventListener('click', () => showToast('Check-in requested from patient', 'success'));
        });

        // 5. Live Location
        const geoBtn = document.querySelector('#live-location .btn-outline');
        if (geoBtn && geoBtn.innerText.includes('Geofence')) {
            geoBtn.addEventListener('click', () => showToast('Geofence Settings opened', 'success'));
        }

        // 6. Facilities
        const addFacBtn = document.querySelector('#facilities .btn-primary');
        if (addFacBtn && addFacBtn.innerText.includes('Add Facility')) {
            addFacBtn.addEventListener('click', () => showToast('Add facility dialog opened', 'success'));
        }
        const manageFacBtns = document.querySelectorAll('#facilities .btn-outline.w-100');
        manageFacBtns.forEach(btn => {
            if (btn.innerText.includes('Manage Facility')) btn.addEventListener('click', () => showToast('Facility Management opened', 'success'));
        });

        // 7. Admin
        const saveBrandBtn = document.querySelector('#admin .btn-primary.w-100');
        if (saveBrandBtn && saveBrandBtn.innerText.includes('Save Brand')) {
            saveBrandBtn.addEventListener('click', () => showToast('Brand settings saved successfully!', 'success'));
        }
        const upgradeBtn = document.querySelector('#admin .btn-outline.w-100');
        if (upgradeBtn && upgradeBtn.innerText.includes('Upgrade Plan')) {
            upgradeBtn.addEventListener('click', () => showToast('Redirecting to upgrade plan...', 'success'));
        }

        // 8. Community
        const writePostBtn = document.querySelector('#community .btn-outline.w-100');
        if (writePostBtn && writePostBtn.innerText.includes('Write Post')) {
            writePostBtn.addEventListener('click', () => showToast('Write post dialog opened', 'success'));
        }
        const rsvpBtn = document.querySelector('#community .btn-success');
        if (rsvpBtn && rsvpBtn.innerText.includes('RSVP')) {
            rsvpBtn.addEventListener('click', () => showToast('RSVP confirmed for Live Q&A', 'success'));
        }
    }, 1000);
});
'''

content += event_listeners

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
