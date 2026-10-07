import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext';
import { CheckCircle, AlertCircle, AlertTriangle, Clock, MapPin, X } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:5000/api';

const PatientSidebar = ({ patient, onClose }) => {
  if (!patient) return null;
  const color = patient.status === 'Safe' ? 'var(--success)' : patient.status === 'Warning' ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="patient-sidebar open" style={{
      position: 'absolute', right: 0, top: 0, width: '400px', height: '100%', 
      background: 'var(--surface)', borderLeft: '1px solid var(--border)', zIndex: 50, 
      boxShadow: '-5px 0 15px rgba(0,0,0,0.5)', overflowY: 'auto', padding: '2rem'
    }}>
      <div className="d-flex justify-between align-center mb-2">
        <h2 style={{ color }}>{patient.name}</h2>
        <X className="text-muted" style={{ cursor: 'pointer' }} onClick={onClose} />
      </div>
      
      <p className="text-muted mb-2">Age: 76 | DOB: 1948-05-12</p>
      
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
        <h4 className="mb-1 text-muted" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>Real-time Status</h4>
        <div className="d-flex justify-between mb-1">
            <span>Status:</span>
            <strong style={{ color }}>{patient.status}</strong>
        </div>
        <div className="d-flex justify-between mb-1">
            <span>Last Check-in:</span>
            <span>{patient.last_checkin || 'None'}</span>
        </div>
        <div className="d-flex justify-between">
            <span>Med Adherence:</span>
            <strong>{patient.adherence_pct}%</strong>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--bg)', borderRadius: '3px', marginTop: '0.5rem' }}>
            <div style={{ height: '100%', width: `${patient.adherence_pct}%`, background: color, borderRadius: '3px' }}></div>
        </div>
      </div>

      <h4 className="mb-1 text-muted" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>Assigned Caregivers</h4>
      <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}><span className="text-primary mr-2">👤</span> Mom (Primary) - Active</p>
      <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}><span className="text-primary mr-2">🩺</span> Dr. Patel - Clinical</p>
      
      <button className="btn btn-outline w-full mb-1">Send Message</button>
      <button className="btn btn-danger w-full">Trigger Emergency Alert</button>
    </div>
  );
};

const Dashboard = () => {
  const { role } = useRole();
  const [stats, setStats] = useState({ safe_count: 0, warning_count: 0, alert_count: 0, pending_alerts: 0 });
  const [elderly, setElderly] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/dashboard/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
      
    fetch(`${API_BASE}/elderly`)
      .then(res => res.json())
      .then(data => setElderly(data))
      .catch(err => console.error(err));
  }, []);

  if (role !== 'caregiver' && role !== 'doctor') {
    return <div className="p-4 text-center">Dashboard is for Caregivers & Doctors only. Switch role.</div>;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div className="d-flex justify-between align-center mb-1">
        <h2>Overview</h2>
        <span className="text-success" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
            System Health: 98% ✓ | Last Sync: Just now ↻
        </span>
      </div>

      <div className="d-flex gap-1 mb-2" style={{ flexWrap: 'wrap' }}>
        <div className="card d-flex align-center gap-1" style={{ flex: 1, borderLeft: '4px solid var(--success)' }}>
            <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.safe_count}</div>
                <div className="text-muted" style={{ fontSize: '0.875rem' }}>Safe & Active <span className="text-success">↑ +2</span></div>
            </div>
        </div>
        <div className="card d-flex align-center gap-1" style={{ flex: 1, borderLeft: '4px solid var(--warning)' }}>
            <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.warning_count}</div>
                <div className="text-muted" style={{ fontSize: '0.875rem' }}>Approaching Limit <span className="text-danger">↓ -1</span></div>
            </div>
        </div>
        <div className="card d-flex align-center gap-1" style={{ flex: 1, borderLeft: '4px solid var(--danger)' }}>
            <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.alert_count}</div>
                <div className="text-muted" style={{ fontSize: '0.875rem' }}>Critical Alerts <span className="text-warning">⚠️ Action Req</span></div>
            </div>
        </div>
      </div>

      <div className="d-flex gap-sm mb-2 align-center" style={{ flexWrap: 'wrap' }}>
          <button className="chip active">All</button>
          <button className="chip">Alerts Only</button>
          <button className="chip">At Risk</button>
          <button className="chip">Low Adherence</button>
          <input type="text" className="chip" style={{ marginLeft: 'auto', outline: 'none', width: '250px', cursor: 'text' }} placeholder="Search by name..." />
      </div>

      <div className="grid-3">
        {elderly.map(e => {
            const risk = 100 - e.adherence_pct;
            const isSafe = e.status === 'Safe';
            const isWarning = e.status === 'Warning';
            const color = isSafe ? 'var(--success)' : isWarning ? 'var(--warning)' : 'var(--danger)';
            return (
              <div 
                key={e.elder_id} 
                className="card card-interactive" 
                style={{ borderLeft: `4px solid ${color}` }}
                onClick={() => setSelectedPatient(e)}
              >
                  <div className="d-flex justify-between align-center mb-1">
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{e.name}</h3>
                      <span style={{ color, fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {isSafe ? <CheckCircle size={12}/> : isWarning ? <AlertCircle size={12}/> : <AlertTriangle size={12}/>} 
                        {e.status}
                      </span>
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    Age: 76 | Risk Score: <span style={{ color: risk > 40 ? 'var(--danger)' : 'var(--success)' }}>{risk}</span>
                  </div>
                  <div className="d-flex justify-between" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <span className="text-muted d-flex align-center gap-sm">
                      <Clock size={14} /> {e.last_checkin ? e.last_checkin.split(' ')[1] : <span className="text-danger">No check-ins</span>}
                    </span>
                    <span className="text-primary d-flex align-center gap-sm"><MapPin size={14} /> Home</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Adherence</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '60%' }}>
                          <div style={{ flex: 1, height: '4px', background: 'var(--bg)', borderRadius: '2px' }}>
                              <div style={{ height: '100%', width: `${e.adherence_pct}%`, background: e.adherence_pct > 80 ? 'var(--success)' : 'var(--warning)', borderRadius: '2px' }}></div>
                          </div>
                          <span style={{ color: e.adherence_pct > 80 ? 'var(--success)' : 'var(--warning)' }}>{e.adherence_pct}%</span>
                      </div>
                  </div>
              </div>
            )
        })}
      </div>

      <PatientSidebar patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
    </div>
  );
};

export default Dashboard;
