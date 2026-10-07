import React from 'react';
import { useRole } from '../../context/RoleContext';
import { Bell, Clock } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { role, setRole } = useRole();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRoleLabel = () => {
    switch (role) {
      case 'caregiver': return 'Caregiver';
      case 'elderly': return 'Patient';
      case 'doctor': return 'Doctor';
      default: return 'User';
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <i className="fa-solid fa-shield-heart" style={{ marginRight: '8px' }}></i> 
        SafeGuard
      </div>
      <div className="nav-actions">
        <select 
          className="role-switcher" 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="caregiver">👤 Caregiver View</option>
          <option value="elderly">👴 Patient View</option>
          <option value="doctor">🩺 Doctor View</option>
        </select>
        
        <span className="text-muted d-flex align-center gap-sm hide-mobile">
          <Clock size={16} /> 
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </span>
        
        <div className="bell-icon">
          <Bell size={20} />
          <span className="badge">3</span>
        </div>
        
        <div className="user-profile">
          <img src={`https://ui-avatars.com/api/?name=${getRoleLabel()}&background=4F46E5&color=fff&rounded=true&size=32`} alt="Profile" />
          <span>{getRoleLabel()}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
