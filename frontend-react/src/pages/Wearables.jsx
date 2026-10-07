import React from 'react';
import { Activity, Plus, Heart, Watch } from 'lucide-react';

const Wearables = () => {
  return (
    <div>
      <div className="d-flex justify-between align-center mb-2">
        <h2 className="d-flex align-center gap-1"><Activity className="text-primary" /> Connected Devices</h2>
        <button className="btn btn-primary"><Plus size={16} /> Add Device</button>
      </div>
      
      <div className="grid-3">
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
            <div className="d-flex justify-between align-center mb-1">
                <h3 className="d-flex align-center gap-sm m-0"><Watch size={20} /> Apple Watch</h3>
                <span className="text-success" style={{ fontSize: '0.85rem' }}>✓ Connected (87%)</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem', fontSize: '0.9rem' }}>
                <li className="d-flex justify-between mb-1"><span className="text-muted">Heart Rate</span> <span>78 bpm (normal)</span></li>
                <li className="d-flex justify-between mb-1"><span className="text-muted">Blood O2</span> <span>98%</span></li>
                <li className="d-flex justify-between mb-1"><span className="text-muted">Sleep</span> <span>7h 22m</span></li>
                <li className="d-flex justify-between"><span className="text-muted">Steps Today</span> <span>8,234</span></li>
            </ul>
            <button className="btn btn-sm btn-outline w-full d-flex justify-center">Manage Settings</button>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
            <div className="d-flex justify-between align-center mb-1">
                <h3 className="d-flex align-center gap-sm m-0"><Heart size={20} /> BP Monitor</h3>
                <span className="text-success" style={{ fontSize: '0.85rem' }}>✓ Connected (Last 1h)</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem', fontSize: '0.9rem' }}>
                <li className="d-flex justify-between mb-1"><span className="text-muted">Systolic</span> <span>128 mmHg</span></li>
                <li className="d-flex justify-between mb-1"><span className="text-muted">Diastolic</span> <span>82 mmHg</span></li>
                <li className="d-flex justify-between"><span className="text-muted">Pulse</span> <span>76 bpm</span></li>
            </ul>
            <button className="btn btn-sm btn-outline w-full d-flex justify-center">View Trends</button>
        </div>
        
        <div className="card">
            <h3 className="mb-1 text-primary">Daily Activity Ring</h3>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ 
                    position: 'relative', width: '120px', height: '120px', margin: '0 auto', 
                    borderRadius: '50%', border: '10px solid var(--border)', borderTopColor: 'var(--success)', 
                    transform: 'rotate(-45deg)' 
                }}>
                    <div style={{ 
                        position: 'absolute', top: '50%', left: '50%', 
                        transform: 'translate(-50%, -50%) rotate(45deg)', 
                        fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' 
                    }}>100%</div>
                </div>
                <p className="text-muted" style={{ marginTop: '1rem' }}>All activity goals met!</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Wearables;
