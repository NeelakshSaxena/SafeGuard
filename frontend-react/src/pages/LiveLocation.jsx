import React from 'react';
import { useRole } from '../context/RoleContext';
import { MapPin, Settings, Home, SignalHigh, Crosshair } from 'lucide-react';

const LiveLocation = () => {
  const { role } = useRole();

  if (role !== 'caregiver') return <div className="p-4 text-center">Restricted to Caregivers.</div>;

  return (
    <div>
      <div className="d-flex justify-between align-center mb-2">
        <h2 className="d-flex align-center gap-1"><MapPin className="text-primary" /> Live Location Tracking</h2>
        <button className="btn btn-outline"><Settings size={16} /> Geofence Settings</button>
      </div>
      
      <div className="grid-2">
        <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: '400px', background: '#2a3a4c', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '0.25rem', fontSize: '0.8rem' }} className="d-flex align-center gap-sm">
                <SignalHigh className="text-success" size={16} /> GPS Active
            </div>
            
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '200px', height: '200px', borderRadius: '50%', border: '2px dashed var(--success)', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', position: 'relative' }}>
                    <Home style={{ position: 'absolute', top: '20px', color: 'var(--success)' }} size={24} />
                    <div style={{ width: '15px', height: '15px', background: 'var(--primary)', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 10px var(--primary)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                </div>
                <p className="mt-2" style={{ fontWeight: 'bold' }}>📍 Safe Zone: Home</p>
            </div>
        </div>
        
        <div className="card">
            <h3 className="mb-1 text-primary">Location History & Geofencing</h3>
            
            <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Current Status</h4>
                <p className="text-success d-flex align-center gap-sm mb-1"><CheckCircle size={16} /> Inside Safe Zone (Home)</p>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Accuracy: ~5 meters | Battery: 87%</p>
                <button className="btn btn-outline w-full mt-1"><Crosshair size={16} /> Ping Device Now</button>
            </div>
            
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Today's Timeline</h4>
            <div style={{ borderLeft: '2px solid var(--border)', marginLeft: '10px', paddingLeft: '20px', position: 'relative' }}>
                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                    <div style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%', position: 'absolute', left: '-26px', top: '5px' }}></div>
                    <strong>10:30 AM</strong>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Returned to Home</p>
                </div>
                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                    <div style={{ width: '10px', height: '10px', background: 'var(--warning)', borderRadius: '50%', position: 'absolute', left: '-26px', top: '5px' }}></div>
                    <strong>09:15 AM</strong>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Pharmacy (1.2km away)</p>
                </div>
                <div style={{ position: 'relative' }}>
                    <div style={{ width: '10px', height: '10px', background: 'var(--success)', borderRadius: '50%', position: 'absolute', left: '-26px', top: '5px' }}></div>
                    <strong>08:00 AM</strong>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Home</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// CheckCircle missing import above, inline mock:
const CheckCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default LiveLocation;
