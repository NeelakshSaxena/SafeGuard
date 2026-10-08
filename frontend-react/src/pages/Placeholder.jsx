import React from 'react';
import { useRole } from '../context/RoleContext';

const Placeholder = ({ title }) => {
  const { role } = useRole();
  return (
    <div>
      <div className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
        SafeGuard &gt; {role.toUpperCase()} &gt; {title}
      </div>
      <h2>{title}</h2>
      <div className="card mt-2">
        <p className="text-muted mb-2">This module is part of the Phase 2 roadmap, but essential actions are available below.</p>
        
        {title === 'Organization Settings' && (
          <div className="d-flex gap-1 mt-2">
            <button className="btn btn-primary" onClick={() => alert('Brand Settings saved successfully!')}>Save Brand Settings</button>
            <button className="btn btn-success" onClick={() => alert('Plan Upgraded successfully! You will be billed accordingly.')}>Upgrade Plan</button>
          </div>
        )}

        {title === 'Facilities Management' && (
          <div className="d-flex gap-1 mt-2">
            <button className="btn btn-primary" onClick={() => alert('New Facility addition workflow started.')}>Add New Facility</button>
            <button className="btn btn-outline" onClick={() => alert('Facility Report exporting as PDF...')}>Export Report</button>
          </div>
        )}

        {title === 'Community Forums' && (
          <div className="d-flex gap-1 mt-2">
            <button className="btn btn-primary" onClick={() => alert('Drafting new post...')}>Create New Post</button>
            <button className="btn btn-outline" onClick={() => alert('Successfully joined Caregiver Support Group!')}>Join Support Group</button>
          </div>
        )}

        {title === 'AI Predictive Insights' && (
          <div className="d-flex gap-1 mt-2">
            <button className="btn btn-primary" onClick={() => alert('Predictive Model running... (This might take a moment)')}>Run Predictive Model</button>
            <button className="btn btn-outline" onClick={() => alert('AI Analysis Report exported.')}>Export AI Analysis</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Placeholder;
