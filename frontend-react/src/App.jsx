import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import MainLayout from './components/layout/MainLayout';
import Placeholder from './pages/Placeholder';
import './index.css';

function App() {
  return (
    <RoleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Placeholder title="Dashboard Overview" />} />
            <Route path="alerts" element={<Placeholder title="Alert Center" />} />
            <Route path="analytics" element={<Placeholder title="Analytics & Trends" />} />
            <Route path="location" element={<Placeholder title="Live Location" />} />
            <Route path="dbviz" element={<Placeholder title="DB Diagnostics" />} />
            <Route path="telehealth" element={<Placeholder title="Telemedicine" />} />
            <Route path="records" element={<Placeholder title="Health Records" />} />
            <Route path="prescriptions" element={<Placeholder title="Medications" />} />
            <Route path="wearables" element={<Placeholder title="Connected Devices" />} />
            <Route path="*" element={<Placeholder title="Not Found" />} />
          </Route>
        </Routes>
      </Router>
    </RoleProvider>
  );
}

export default App;
