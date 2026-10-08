import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { MapPin, Settings, Home, SignalHigh, Crosshair, X, ShieldAlert, Save } from 'lucide-react';

const LiveLocation = () => {
  const { role } = useRole();
  const [showSettings, setShowSettings] = useState(false);

  if (role !== 'caregiver') return <div className="p-4 text-center">Restricted to Caregivers.</div>;

  return (
    <div>
      <div className="d-flex justify-between align-center mb-2">
        <h2 className="d-flex align-center gap-1"><MapPin className="text-primary" /> Live Location Tracking</h2>
        <button 
            className={`btn ${showSettings ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setShowSettings(!showSettings)}
        >
            {showSettings ? <><X size={16} /> Close Settings</> : <><Settings size={16} /> Geofence Settings</>}
        </button>
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
        
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            {showSettings ? (
                <div className="settings-panel fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <h3 className="mb-1 text-primary d-flex align-center gap-sm"><ShieldAlert size={20} /> Geofence Settings</h3>
                    <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>Configure safe zones and alert preferences for the patient.</p>
                    
                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                        <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>Safe Zone Configuration</h4>
                            
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Primary Location</label>
                            <input type="text" className="form-control w-full mb-1" defaultValue="123 Caregiver Ave, Safeville" style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-color)' }} />
                            
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Radius (Meters)</label>
                            <div className="d-flex align-center gap-1">
                                <input type="range" min="10" max="1000" defaultValue="150" style={{ flex: 1 }} />
                                <span style={{ width: '40px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 'bold' }}>150m</span>
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>Alert Preferences</h4>
                            
                            <div className="d-flex justify-between align-center mb-1 pb-1" style={{ borderBottom: '1px solid var(--border)' }}>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Exit Safe Zone Alert</strong>
                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Notify when patient leaves the safe zone</span>
                                </div>
                                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                            </div>
                            
                            <div className="d-flex justify-between align-center mb-1 pb-1" style={{ borderBottom: '1px solid var(--border)' }}>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Enter Safe Zone Alert</strong>
                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Notify when patient returns to safe zone</span>
                                </div>
                                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                            </div>
                            
                            <div className="d-flex justify-between align-center">
                                <div>
                                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Low Battery Alert</strong>
                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Notify when device battery drops below 15%</span>
                                </div>
                                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
                        <button className="btn btn-primary w-full d-flex align-center justify-center gap-sm" onClick={() => { alert('Settings saved successfully!'); setShowSettings(false); }}>
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                <div className="history-panel fade-in">
                    <h3 className="mb-1 text-primary">Location History & Geofencing</h3>
                    
                    <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>Current Status</h4>
                        <p className="text-success d-flex align-center gap-sm mb-1"><CheckCircle size={16} /> Inside Safe Zone (Home)</p>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Accuracy: ~5 meters | Battery: 87%</p>
                        <button className="btn btn-outline w-full mt-1 d-flex align-center justify-center gap-sm" onClick={() => alert('Ping sent to device. Awaiting response...')}><Crosshair size={16} /> Ping Device Now</button>
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
            )}
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
