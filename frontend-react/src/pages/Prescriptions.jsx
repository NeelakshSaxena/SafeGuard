import React from 'react';
import { Pill, Download, AlertTriangle } from 'lucide-react';

const Prescriptions = () => {
  return (
    <div>
      <h2 className="mb-2 d-flex align-center gap-1"><Pill className="text-primary" /> Medication & Prescriptions</h2>
      <div className="grid-2">
        <div className="card">
            <h3 className="mb-1 text-primary">Active Prescriptions</h3>
            
            <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', borderLeft: '4px solid var(--success)' }}>
                <h4 style={{ margin: 0 }}>1. Metformin 1000mg</h4>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Prescribed by: Dr. Patel (Oct 1, 2024)</p>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Dosage: Once daily (morning)</p>
                <p className="text-success" style={{ fontSize: '0.85rem' }}>Refills: 2 remaining | Pharmacy: Apollo (2km)</p>
                <div className="d-flex gap-1 mt-1">
                    <button className="btn btn-sm btn-success">Refill Now</button>
                    <button className="btn btn-sm btn-outline">Set Alert</button>
                </div>
            </div>
            
            <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', borderLeft: '4px solid var(--warning)' }}>
                <h4 style={{ margin: 0 }}>2. Atenolol 50mg</h4>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Prescribed by: Dr. Sharma (Sep 15)</p>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Dosage: Once daily (evening)</p>
                <p className="text-warning" style={{ fontSize: '0.85rem' }}>⚠️ Refills: 0 remaining (Expiring Oct 15)</p>
                <div className="d-flex gap-1 mt-1">
                    <button className="btn btn-sm btn-warning">Request Doctor Refill</button>
                </div>
            </div>
        </div>
        
        <div className="card">
            <h3 className="mb-1 text-primary">Allergies & Interactions</h3>
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                <p className="text-danger mb-1 d-flex align-center gap-sm">
                    <AlertTriangle size={16}/> <strong>Allergic to:</strong> Penicillin
                </p>
                <p className="text-danger d-flex align-center gap-sm">
                    <AlertTriangle size={16}/> <strong>Avoid with:</strong> Alcohol (Atenolol)
                </p>
            </div>
            
            <h3 className="mb-1 mt-2 text-primary">History</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Oct 1: Prescription added (Metformin)</p>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Sep 30: Pharmacy delivery completed</p>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Sep 28: Prescription refilled (Atenolol)</p>
            
            <button className="btn btn-outline w-full mt-2 d-flex justify-center">
                <Download size={16} className="mr-2" /> Download Full List
            </button>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
