import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { 
  Users, AlertTriangle, PieChart, Database, MapPin, 
  Stethoscope, Video, FileText, Smartphone, Pill, Activity, Shield
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { role } = useRole();

  const renderLinks = () => {
    switch(role) {
      case 'caregiver':
        return (
          <>
            <div className="nav-group-title">Monitoring</div>
            <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
              <Users size={20} /> Dashboard
            </NavLink>
            <NavLink to="/alerts" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <AlertTriangle size={20} /> Alert Center
            </NavLink>
            <NavLink to="/analytics" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <PieChart size={20} /> Analytics & Trends
            </NavLink>
            <NavLink to="/location" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <MapPin size={20} /> Live Location
            </NavLink>
            
            <div className="nav-group-title mt-2">System</div>
            <NavLink to="/dbviz" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Database size={20} /> DB Diagnostics
            </NavLink>
          </>
        );
      case 'doctor':
        return (
          <>
            <div className="nav-group-title">Clinical</div>
            <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
              <Stethoscope size={20} /> Clinical Overview
            </NavLink>
            <NavLink to="/telehealth" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Video size={20} /> Telemedicine
            </NavLink>
            <NavLink to="/records" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <FileText size={20} /> Health Records
            </NavLink>
          </>
        );
      case 'elderly':
        return (
          <>
            <div className="nav-group-title">My App</div>
            <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
              <Smartphone size={20} /> My Dashboard
            </NavLink>
            <NavLink to="/telehealth" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Stethoscope size={20} /> Consult Doctor
            </NavLink>
            <NavLink to="/prescriptions" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Pill size={20} /> Medications
            </NavLink>
            <NavLink to="/wearables" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Activity size={20} /> Connected Devices
            </NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="sidebar">
      {renderLinks()}
    </div>
  );
};

export default Sidebar;
