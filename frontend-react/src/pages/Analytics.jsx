import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext';
import { PieChart as PieChartIcon, Download } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const API_BASE = 'http://127.0.0.1:5000/api';

const Analytics = () => {
  const { role } = useRole();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/analytics/mock`)
      .then(res => {
          if (!res.ok) throw new Error("API Offline or data missing");
          return res.json();
      })
      .then(d => setData(d))
      .catch(e => setError(e.message));
  }, []);

  if (role !== 'caregiver') return <div className="p-4 text-center">Restricted to Caregivers.</div>;
  if (error) return <div className="card text-danger">Error loading analytics: {error}</div>;
  if (!data) return <div className="p-4 text-muted">Loading Analytics...</div>;

  const complianceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Compliance %',
      data: data.compliance,
      backgroundColor: data.compliance.map(v => v >= 90 ? '#10B981' : '#F59E0B'),
      borderRadius: 4
    }]
  };

  const riskData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Avg Risk Score',
      data: data.risk_trend,
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const adherenceData = {
    labels: ['>90% (Safe)', '75-90% (Warning)', '<75% (Critical)'],
    datasets: [{
      data: [25, 15, 10],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  };

  const heatmapData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Alert Frequency',
      data: [2, 5, 1, 8, 3, 2, 0],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      fill: true,
      stepped: true
    }]
  };

  const chartOptions = { responsive: true, plugins: { legend: { display: false } }, maintainAspectRatio: false };

  return (
    <div>
      <div className="d-flex justify-between align-center mb-2">
        <h2 className="d-flex align-center gap-1"><PieChartIcon className="text-primary" /> Analytics & Trends</h2>
        <button className="btn btn-outline btn-sm"><Download size={16} /> Export CSV</button>
      </div>
      
      <div className="grid-2 mb-2">
        <div className="card">
          <h3 className="mb-1 text-muted">7-Day Check-in Compliance</h3>
          <div style={{ height: '250px' }}><Bar data={complianceData} options={chartOptions} /></div>
        </div>
        <div className="card">
          <h3 className="mb-1 text-muted">Risk Score Trends</h3>
          <div style={{ height: '250px' }}><Line data={riskData} options={chartOptions} /></div>
        </div>
      </div>
      
      <div className="grid-2">
        <div className="card">
          <h3 className="mb-1 text-muted">Medication Adherence Distribution</h3>
          <div style={{ height: '250px' }}><Doughnut data={adherenceData} options={{...chartOptions, plugins: { legend: { position: 'right', labels: { color: '#94A3B8' } } }, cutout: '70%' }} /></div>
        </div>
        <div className="card">
          <h3 className="mb-1 text-muted">Alert Summary Heatmap</h3>
          <div style={{ height: '250px' }}><Line data={heatmapData} options={chartOptions} /></div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
