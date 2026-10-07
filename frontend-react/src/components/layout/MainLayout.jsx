import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <div className="main-content animate-fade-in">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
