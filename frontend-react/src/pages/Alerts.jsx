import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext';
import { AlertTriangle, CheckCheck, Phone, MapPin } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:5000/api';

const AlertModal = ({ alert, onClose, onAck }) => {
  if (!alert) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 }}>
      <div className="card animate-fade-in" style={{ width: '600px', maxWidth: '90%' }}>
        <h2 className="mb-2">Alert: {alert.elderly_name}</h2>
        <div className="grid-2 gap-2 mb-2">
            <div>
                <p className="text-muted" style={{ fontSize: '0.875rem', textTransform: 'uppercase' }}>Alert Info</p>
                <p><strong>Type:</strong> {alert.alert_type}</p>
                <p><strong>Severity:</strong> <span className="text-danger">{alert.severity}</span></p>
                <p><strong>Created:</strong> {alert.timestamp}</p>
                <p><strong>Status:</strong> {alert.status}</p>
            </div>
            <div>
                <p className="text-muted" style={{ fontSize: '0.875rem', textTransform: 'uppercase' }}>Caregiver Action</p>
                <p className="d-flex align-center gap-sm mt-1"><Phone size={16}/> Call Primary: 555-0101</p>
                <p className="d-flex align-center gap-sm mt-1"><MapPin size={16}/> Check Last Location</p>
                <p className="text-warning d-flex align-center gap-sm mt-1"><AlertTriangle size={16}/> Action required within 15 mins</p>
            </div>
        </div>
        <div className="d-flex gap-1 justify-between">
            <button className="btn btn-outline w-full" onClick={onClose}>Close</button>
            <button className="btn btn-success w-full" onClick={() => onAck(alert.alert_id)}>Acknowledge</button>
        </div>
      </div>
    </div>
  );
};

const Alerts = () => {
  const { role } = useRole();
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fetchAlertsData = () => {
    fetch(`${API_BASE}/alerts`)
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAlertsData();
  }, []);

  const handleAck = (id) => {
    fetch(`${API_BASE}/alerts/${id}/acknowledge`, { method: 'POST' })
      .then(() => {
          setSelectedAlert(null);
          fetchAlertsData();
      })
      .catch(e => console.error(e));
  };

  if (role !== 'caregiver') {
    return <div className="p-4 text-center">Alert Center is restricted to Caregivers.</div>;
  }

  return (
    <div>
      <div className="d-flex justify-between align-center mb-2">
        <h2 className="d-flex align-center gap-1"><AlertTriangle className="text-danger" /> Alert Management Center</h2>
        <button className="btn btn-outline"><CheckCheck size={16} /> Acknowledge All</button>
      </div>
      
      <div className="d-flex gap-sm mb-2 align-center">
          <button className="chip active">Pending</button>
          <button className="chip">Acknowledged</button>
          <button className="chip">Resolved</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
                <tr>
                    <th>Severity</th>
                    <th>Type</th>
                    <th>Patient</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {alerts.map(a => {
                    const color = a.severity === 'Critical' ? 'var(--danger)' : 'var(--warning)';
                    const statusColor = a.status === 'Pending' ? 'var(--danger)' : 'var(--success)';
                    return (
                        <tr key={a.alert_id}>
                            <td style={{ color, fontWeight: 'bold' }}>
                                <span style={{ display: 'inline-block', width: '8px', height: '8px', background: color, borderRadius: '50%', marginRight: '8px' }}></span>
                                {a.severity}
                            </td>
                            <td>{a.alert_type}</td>
                            <td style={{ fontWeight: 500 }}>{a.elderly_name}</td>
                            <td className="text-muted">{a.timestamp.split(' ')[1]}</td>
                            <td style={{ color: statusColor, fontWeight: 500 }}>{a.status}</td>
                            <td>
                                {a.status === 'Pending' ? (
                                    <div className="d-flex gap-sm">
                                        <button className="btn btn-outline btn-sm" onClick={() => setSelectedAlert(a)}>Details</button>
                                        <button className="btn btn-success btn-sm" onClick={() => handleAck(a.alert_id)}>Ack</button>
                                    </div>
                                ) : (
                                    <span className="text-muted d-flex align-center gap-sm"><CheckCheck size={14} /> Resolved</span>
                                )}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
          </table>
        </div>
      </div>

      <AlertModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} onAck={handleAck} />
    </div>
  );
};

export default Alerts;
