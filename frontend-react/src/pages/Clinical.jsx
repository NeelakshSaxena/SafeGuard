import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext';
import { Stethoscope } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:5000/api';

const Clinical = () => {
  const { role } = useRole();
  const [elderly, setElderly] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/elderly`)
      .then(res => res.json())
      .then(data => setElderly(data))
      .catch(err => console.error(err));
  }, []);

  if (role !== 'doctor') return <div className="p-4 text-center">Restricted to Doctors.</div>;

  return (
    <div>
      <h2 className="d-flex align-center gap-1 mb-2"><Stethoscope className="text-primary" /> Clinical Dashboard</h2>
      
      <div className="d-flex gap-sm mb-2 align-center">
          <button className="chip active">My Assigned Patients</button>
          <button className="chip">High Risk</button>
          <button className="chip">Requires Review</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
                <tr>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Key Conditions</th>
                    <th>Med Adherence</th>
                    <th>Risk Score</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {elderly.map(e => {
                    const color = e.status === 'Safe' ? 'var(--success)' : e.status === 'Warning' ? 'var(--warning)' : 'var(--danger)';
                    const risk = 100 - e.adherence_pct;
                    return (
                        <tr key={e.elder_id}>
                            <td style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{e.name}</td>
                            <td className="text-muted">76</td>
                            <td>Diabetes, HTN</td>
                            <td style={{ color: e.adherence_pct > 80 ? 'var(--success)' : 'var(--warning)' }}>{e.adherence_pct}%</td>
                            <td style={{ color: risk > 40 ? 'var(--danger)' : 'var(--success)' }}>{risk}</td>
                            <td style={{ color }}>
                                <span style={{ display: 'inline-block', width: '8px', height: '8px', background: color, borderRadius: '50%', marginRight: '8px' }}></span>
                                {e.status}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clinical;
