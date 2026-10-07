import React from 'react';
import { Video, MessageCircle, Calendar, Clock, Check, FileText } from 'lucide-react';

const Telehealth = () => {
  return (
    <div>
      <h2 className="mb-2 d-flex align-center gap-1"><Video className="text-primary" /> Telemedicine & Video Consultation</h2>
      <div className="grid-2">
        <div className="card">
            <h3 className="mb-1 text-primary">Available Doctors (Next 30 mins)</h3>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div className="d-flex justify-between align-center">
                    <div>
                        <h4 style={{ margin: 0 }}>Dr. Patel - General Practice</h4>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}><span className="text-success">● Online now</span> (Next slot: In 5 mins)</p>
                        <p style={{ color: '#F59E0B', fontSize: '0.8rem' }}>⭐⭐⭐⭐⭐ (128 reviews) | ₹500/consultation</p>
                    </div>
                    <img src="https://ui-avatars.com/api/?name=Dr+Patel&background=10B981&color=fff&rounded=true" width="50" height="50" alt="Dr Patel" />
                </div>
                <div className="d-flex gap-sm mt-1">
                    <button className="btn btn-sm btn-success w-full" onClick={() => alert('Video call started (Simulated)')}>
                        <Video size={16} /> Book Call
                    </button>
                    <button className="btn btn-sm btn-outline">
                        <MessageCircle size={16} /> Message
                    </button>
                </div>
            </div>
            <div>
                <div className="d-flex justify-between align-center">
                    <div>
                        <h4 style={{ margin: 0 }}>Dr. Sharma - Cardiologist</h4>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Online in 2 hours (Next slot: 6:00 PM)</p>
                        <p style={{ color: '#F59E0B', fontSize: '0.8rem' }}>⭐⭐⭐⭐ (89 reviews) | ₹1500/consultation</p>
                    </div>
                    <img src="https://ui-avatars.com/api/?name=Dr+Sharma&background=3B82F6&color=fff&rounded=true" width="50" height="50" alt="Dr Sharma" />
                </div>
                <div className="d-flex gap-sm mt-1">
                    <button className="btn btn-sm btn-primary w-full">
                        <Calendar size={16} /> Book Later
                    </button>
                    <button className="btn btn-sm btn-outline">
                        <MessageCircle size={16} /> Message
                    </button>
                </div>
            </div>
        </div>
        
        <div className="card">
            <h3 className="mb-1 text-primary">My Upcoming Consultations</h3>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                <div className="d-flex justify-between align-center mb-1">
                    <strong className="d-flex align-center gap-sm"><Clock className="text-warning" size={16} /> Oct 8 3:00 PM - Dr. Sharma</strong>
                    <span className="chip" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Upcoming</span>
                </div>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Cardiology follow-up</p>
                <div className="d-flex gap-sm mt-1">
                    <button className="btn btn-sm btn-outline">Reschedule</button>
                    <button className="btn btn-sm btn-outline">Add Reminder</button>
                </div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '0.5rem' }}>
                <div className="d-flex justify-between align-center mb-1">
                    <strong className="d-flex align-center gap-sm"><Check className="text-success" size={16} /> Oct 6 10:00 AM - Dr. Patel</strong>
                    <span className="text-success" style={{ fontSize: '0.85rem' }}>Completed</span>
                </div>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Notes: Continue current meds, mild headache.</p>
                <p className="text-success d-flex align-center gap-sm mt-1" style={{ fontSize: '0.85rem' }}><FileText size={14} /> Prescription shared</p>
                <div className="d-flex gap-sm mt-1">
                    <button className="btn btn-sm btn-outline">View Notes</button>
                    <button className="btn btn-sm btn-outline">Recording</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Telehealth;
