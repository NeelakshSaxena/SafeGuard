import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider, useRole } from './context/RoleContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import LiveLocation from './pages/LiveLocation';
import DBViz from './pages/DBViz';
import Clinical from './pages/Clinical';
import ElderlyApp from './pages/ElderlyApp';
import Telehealth from './pages/Telehealth';
import Records from './pages/Records';
import Prescriptions from './pages/Prescriptions';
import Wearables from './pages/Wearables';
import Placeholder from './pages/Placeholder';
import './index.css';

const HomeRoute = () => {
  const { role } = useRole();
  if (role === 'caregiver') return <Dashboard />;
  if (role === 'doctor') return <Clinical />;
  if (role === 'elderly') return <ElderlyApp />;
  return <Navigate to="/alerts" />;
};

function App() {
  return (
    <RoleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomeRoute />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="location" element={<LiveLocation />} />
            <Route path="dbviz" element={<DBViz />} />
            <Route path="telehealth" element={<Telehealth />} />
            <Route path="records" element={<Records />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="wearables" element={<Wearables />} />
            <Route path="*" element={<Placeholder title="Not Found" />} />
          </Route>
        </Routes>
      </Router>
    </RoleProvider>
  );
}

export default App;
