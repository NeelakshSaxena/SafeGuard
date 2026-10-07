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
        <p className="text-muted">This module is under construction for Phase 2+.</p>
      </div>
    </div>
  );
};

export default Placeholder;
