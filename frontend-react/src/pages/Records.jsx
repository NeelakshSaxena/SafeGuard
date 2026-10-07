import React from 'react';
import { FileText, Upload, File, Share2, TrendingUp, Image as ImageIcon } from 'lucide-react';

const Records = () => {
  return (
    <div>
      <div className="d-flex justify-between align-center mb-2">
        <h2 className="d-flex align-center gap-1"><FileText className="text-primary" /> Health Records & Labs</h2>
        <button className="btn btn-primary"><Upload size={16} /> Upload Record</button>
      </div>
      
      <div className="grid-2">
        <div className="card">
            <h3 className="mb-1 text-primary">Recent Lab Reports</h3>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div className="d-flex justify-between mb-1 align-center">
                    <h4 style={{ margin: 0 }}>Blood Test (Oct 1, 2024)</h4>
                    <span className="chip" style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '2px 8px', fontSize: '0.75rem' }}>Results Ready</span>
                </div>
                <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Metropolis Healthcare</p>
                <div className="d-flex justify-between text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}><span>Glucose:</span> <span className="text-warning">118 mg/dL (High)</span></div>
                <div className="d-flex justify-between text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}><span>HbA1c:</span> <span className="text-warning">6.8% (Prediabetic)</span></div>
                <div className="d-flex justify-between text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}><span>LDL:</span> <span className="text-success">135 mg/dL</span></div>
                <div className="d-flex gap-1 mt-1">
                    <button className="btn btn-sm btn-outline"><File size={14} /> View PDF</button>
                    <button className="btn btn-sm btn-outline"><Share2 size={14} /> Share</button>
                </div>
            </div>
            <div>
                <div className="d-flex justify-between mb-1 align-center">
                    <h4 style={{ margin: 0 }}>Lipid Panel (Sep 15, 2024)</h4>
                    <span className="chip" style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '2px 8px', fontSize: '0.75rem' }}>Results Ready</span>
                </div>
                <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Max Lab</p>
                <button className="btn btn-sm btn-outline"><File size={14} /> View PDF</button>
            </div>
        </div>
        
        <div className="card">
            <h3 className="mb-1 text-primary">Documents & Trends</h3>
            <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Glucose Levels Trend (12m)</h4>
                <div className="d-flex justify-between text-muted" style={{ fontSize: '0.85rem' }}><span>Oct 1:</span> <span>118 mg/dL</span></div>
                <div className="d-flex justify-between text-muted" style={{ fontSize: '0.85rem' }}><span>Jul 15:</span> <span>115 mg/dL</span></div>
                <div className="d-flex justify-between text-muted" style={{ fontSize: '0.85rem' }}><span>Apr 22:</span> <span>112 mg/dL</span></div>
                <div className="d-flex justify-between text-muted" style={{ fontSize: '0.85rem' }}><span>Jan 10:</span> <span>110 mg/dL</span></div>
                <p className="text-warning mt-1 d-flex align-center gap-sm" style={{ fontSize: '0.85rem' }}>
                    <TrendingUp size={14} /> Trend: Slightly increasing. Monitor diet.
                </p>
            </div>
            
            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Static Documents</h4>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem', fontSize: '0.9rem' }}>
                <li className="mb-1 d-flex align-center gap-sm"><File className="text-danger" size={16} /> Allergy Card</li>
                <li className="mb-1 d-flex align-center gap-sm"><File className="text-danger" size={16} /> Vaccination Cert</li>
                <li className="mb-1 d-flex align-center gap-sm"><ImageIcon className="text-primary" size={16} /> X-Ray Results (Oct)</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Records;
