import React from 'react';

export default function Navbar({ activePage, setActivePage, studentData }) {
  const pages = [
    { id: 'home', label: '1. Role Selection', icon: '🎯' },
    { id: 'skillGap', label: '2. Skill Gap', icon: '📊' },
    { id: 'interview', label: '3. Mock Interview', icon: '💬' },
    { id: 'roadmap', label: '4. Roadmap', icon: '🗺️' },
    { id: 'dashboard', label: 'Demo Dashboard', icon: '⚡' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand-logo" onClick={() => setActivePage('home')}>
          <span>🕸️ CareerMentor</span>
          <span className="brand-badge">AI Mentor</span>
        </div>

        <div className="nav-links">
          {pages.map((p) => (
            <button
              key={p.id}
              className={`nav-item ${activePage === p.id ? 'active' : ''}`}
              onClick={() => setActivePage(p.id)}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {studentData?.name && (
          <div className="student-pill">
            <span>👤 {studentData.name}</span>
            <span style={{ opacity: 0.6 }}>|</span>
            <span>{studentData.role}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
