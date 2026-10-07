import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext';
import { Database, Play, Clock, Code, Activity, Server } from 'lucide-react';
import './DBViz.css';

const API_BASE = 'http://127.0.0.1:5000/api';

const DBViz = () => {
  const { role } = useRole();
  const [query, setQuery] = useState("SELECT * FROM ELDERLY_PATIENT WHERE status = 'Warning'");
  const [results, setResults] = useState("Awaiting Query...");
  const [execTime, setExecTime] = useState("-");
  const [history, setHistory] = useState([]);
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    fetch(`${API_BASE}/db/stats`)
      .then(res => res.json())
      .then(data => setHistory(data.history))
      .catch(e => console.error(e));
  };

  const simulateQueryFlow = () => {
    const nodes = ['node-users', 'node-elderly', 'node-checkin', 'node-alert', 'node-health'];
    let delay = 0;
    
    nodes.forEach((node) => {
        setTimeout(() => {
            setActiveNode(node);
            setTimeout(() => {
                setActiveNode(null);
            }, 800);
        }, delay);
        delay += 600;
    });
  };

  const handleRunQuery = async () => {
    if (!query) return;
    setResults("Executing Query Plan...");
    simulateQueryFlow();
    
    try {
        const res = await fetch(`${API_BASE}/query-analyzer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data = await res.json();
        
        if (data.success) {
            setExecTime(`${data.execution_time_ms}ms`);
            let html = `[QUERY EXECUTION PLAN]\n${JSON.stringify(data.explain_plan, null, 2)}\n\n[RESULTS RETRIEVED: ${data.results.length} rows]\n${JSON.stringify(data.results, null, 2)}`;
            setResults(html);
            fetchHistory();
        } else {
            setExecTime("Error");
            setResults(data.error);
        }
    } catch (e) {
        setResults("API Offline - " + e.message);
    }
  };

  if (role !== 'caregiver' && role !== 'doctor') return <div className="p-4 text-center">Restricted Access.</div>;

  return (
    <div>
      <h2 className="d-flex align-center gap-1 mb-2"><Database className="text-primary" /> Database Diagnostics</h2>
      
      <div className="grid-2">
        <div className="card">
            <h3 className="mb-1 text-primary">Live Query Analyzer</h3>
            <textarea 
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ 
                    width: '100%', height: '100px', background: 'var(--bg)', color: 'var(--success)', 
                    border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '1rem', 
                    fontFamily: 'monospace', marginBottom: '1rem', outline: 'none' 
                }}
            />
            <div className="d-flex justify-between align-center mb-1">
                <button className="btn btn-primary" onClick={handleRunQuery}><Play size={16} /> Run Analysis</button>
                <span className="text-muted d-flex align-center gap-sm"><Clock size={16} /> Exec Time: <strong className="text-warning">{execTime}</strong></span>
            </div>
            <pre style={{ background: '#000', color: '#0f0', padding: '1rem', borderRadius: '0.5rem', maxHeight: '300px', overflowY: 'auto', fontSize: '0.8rem', border: '1px solid #333' }}>
                {results}
            </pre>
        </div>
        
        <div className="card">
            <h3 className="mb-1 text-primary">Schema Traffic Flow</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem 0' }}>
                <div className={`schema-box ${activeNode === 'node-users' ? 'highlight-node' : ''}`}>USERS (Auth)</div>
                <div className="flow-arrow">↓</div>
                <div className="d-flex gap-2">
                    <div className={`schema-box ${activeNode === 'node-elderly' ? 'highlight-node' : ''}`}>ELDERLY_PATIENT</div>
                    <div className={`schema-box ${activeNode === 'node-caregiver' ? 'highlight-node' : ''}`}>CAREGIVER_MAPPING</div>
                </div>
                <div className="flow-arrow">↙ ↓ ↘</div>
                <div className="d-flex gap-1" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div className={`schema-box ${activeNode === 'node-checkin' ? 'highlight-node' : ''}`}>CHECKINS</div>
                    <div className={`schema-box ${activeNode === 'node-alert' ? 'highlight-node' : ''}`}>ALERTS</div>
                    <div className={`schema-box ${activeNode === 'node-health' ? 'highlight-node' : ''}`}>HEALTH_EVENTS</div>
                </div>
            </div>
            
            <h3 className="mt-2 mb-1 text-primary">Recent Slow Queries (&gt;50ms)</h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {history.map((h, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '0.25rem', fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                        <div className="d-flex justify-between mb-1 text-muted">
                            <span>{h.time}</span>
                            <span style={{ color: h.ms > 100 ? 'var(--warning)' : 'var(--success)' }}>{h.ms}ms ⚡</span>
                        </div>
                        <div style={{ color: 'var(--text-main)', wordBreak: 'break-all' }}>{h.query}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DBViz;
