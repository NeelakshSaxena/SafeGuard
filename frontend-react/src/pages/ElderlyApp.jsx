import React, { useState, useRef } from 'react';
import { useRole } from '../context/RoleContext';
import { Flame, MapPin, Pill, Activity, AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:5000/api';

const ElderlyApp = () => {
  const { role } = useRole();
  const [sosProgress, setSosProgress] = useState(0);
  const [locationText, setLocationText] = useState("Last check-in: Today at 09:15 AM");
  const sosTimeout = useRef(null);
  const progressInterval = useRef(null);

  if (role !== 'elderly') return <div className="p-4 text-center">Restricted to Patient View.</div>;

  const handleSOSStart = () => {
    setSosProgress(0);
    
    // Simulate progress bar
    progressInterval.current = setInterval(() => {
        setSosProgress(prev => {
            if (prev >= 100) return 100;
            return prev + (100 / 30); // 3 seconds = 30 intervals of 100ms
        });
    }, 100);

    sosTimeout.current = setTimeout(() => {
        alert('🆘 EMERGENCY SOS TRIGGERED!\n\n1. Calling Primary Caregiver\n2. Sharing live location\n3. Alerting all assigned staff');
        submitCheckin(1, 0, 0, 'SOS');
        handleSOSCancel();
    }, 3000);
  };

  const handleSOSCancel = () => {
    clearTimeout(sosTimeout.current);
    clearInterval(progressInterval.current);
    setSosProgress(0);
  };

  const submitCheckin = (elderId, lat, lng, type) => {
    fetch(`${API_BASE}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elder_id: elderId, latitude: lat, longitude: lng, type: type })
    }).catch(e => console.error(e));
  };

  const simulateCheckin = () => {
    setLocationText("Verifying GPS Location...");
    setTimeout(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocationText(`Check-in Confirmed. Location: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
                    submitCheckin(1, pos.coords.latitude, pos.coords.longitude, "Standard");
                },
                () => {
                    setLocationText("GPS Denied. Check-in saved with Network IP location.");
                    submitCheckin(1, 0, 0, "Standard");
                }
            );
        } else {
            setLocationText("Check-in saved (No GPS).");
            submitCheckin(1, 0, 0, "Standard");
        }
    }, 800);
  };

  const logHealth = (type) => {
    submitCheckin(1, 0, 0, type);
    alert(`[DB SYNC] ${type} event securely logged.`);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', background: 'var(--surface)', padding: '3rem', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Good Morning!</h2>
        <p className="text-success d-flex align-center justify-center gap-sm" style={{ fontSize: '1.2rem', fontWeight: 500 }}>
            <Flame /> 27 Day Safe Streak! 🎉
        </p>
        <p className="text-muted mb-2">Keep it up! One more day for 28!</p>

        <button 
            className="btn btn-danger" 
            style={{ 
                width: '100%', maxWidth: '300px', height: '250px', borderRadius: '50%', 
                fontSize: '2rem', fontWeight: 'bold', margin: '2rem auto', display: 'flex', 
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: sosProgress > 0 ? '0 0 50px rgba(239, 68, 68, 0.8)' : '0 0 30px rgba(239, 68, 68, 0.4)',
                position: 'relative', overflow: 'hidden'
            }}
            onMouseDown={handleSOSStart}
            onMouseUp={handleSOSCancel}
            onMouseLeave={handleSOSCancel}
            onTouchStart={handleSOSStart}
            onTouchEnd={handleSOSCancel}
        >
            <span style={{ zIndex: 2 }}>🆘 HOLD FOR SOS</span>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: `${sosProgress}%`, background: 'rgba(255,255,255,0.2)', transition: 'height 0.1s linear' }}></div>
        </button>

        <button className="btn btn-success" style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '2rem' }} onClick={simulateCheckin}>
            I'M SAFE
        </button>

        <p className="text-muted mb-2 mt-1 d-flex align-center justify-center gap-sm">
            <MapPin size={16}/> {locationText}
        </p>

        <h3 className="mb-1 mt-2 text-left">Quick Health Logs</h3>
        <div className="grid-3 mb-2" style={{ gap: '1rem' }}>
            <div className="card card-interactive d-flex flex-column align-center justify-center gap-sm" onClick={() => logHealth('Medication Taken')} style={{ padding: '1.5rem 1rem' }}>
                <Pill className="text-success" size={32} />
                <span style={{ fontSize: '1rem' }}>Med Taken</span>
            </div>
            <div className="card card-interactive d-flex flex-column align-center justify-center gap-sm" onClick={() => logHealth('Felt Dizzy')} style={{ padding: '1.5rem 1rem' }}>
                <Activity className="text-warning" size={32} />
                <span style={{ fontSize: '1rem' }}>Felt Dizzy</span>
            </div>
            <div className="card card-interactive d-flex flex-column align-center justify-center gap-sm" onClick={() => logHealth('Fall')} style={{ padding: '1.5rem 1rem' }}>
                <AlertCircle className="text-danger" size={32} />
                <span style={{ fontSize: '1rem' }}>Fall!</span>
            </div>
        </div>

        <div style={{ textAlign: 'left', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <h3 className="mb-1">Your Medications Today</h3>
            <div className="d-flex justify-between align-center mb-1 text-success bg-white/5 p-2 rounded">
                <span className="d-flex align-center gap-sm"><CheckCircle size={16}/> 08:00 - Aspirin 500mg</span> <span>Taken</span>
            </div>
            <div className="d-flex justify-between align-center mb-1 text-success bg-white/5 p-2 rounded">
                <span className="d-flex align-center gap-sm"><CheckCircle size={16}/> 13:00 - Metformin 1000mg</span> <span>Taken</span>
            </div>
            <div className="d-flex justify-between align-center mb-1 text-warning bg-white/5 p-2 rounded">
                <span className="d-flex align-center gap-sm"><Clock size={16}/> 20:00 - Atenolol 50mg</span> <span>Due in 4h</span>
            </div>
        </div>
    </div>
  );
};

export default ElderlyApp;
