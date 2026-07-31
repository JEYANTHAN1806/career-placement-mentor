import React from 'react';

export default function Dashboard({ studentData, skillGapData, interviewAverage, roadmapData, setActivePage }) {
  const matchPct = skillGapData?.matchPercentage || 68;
  const interviewScore = interviewAverage ? parseFloat(interviewAverage) : 8.2;
  const milestones = roadmapData?.milestones || [];

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
      <div className="page-header">
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚡</div>
        <h1 className="page-title">Executive Placement Dashboard</h1>
        <p className="page-subtitle">
          Unified demo dashboard summarizing candidate placement readiness, AI interview performance, and roadmap.
        </p>
      </div>

      {/* Top Profile Bar */}
      <div className="glass-card spider-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Candidate Placement Profile
            </span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem' }}>{studentData.name || 'Alex Vance'}</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Target Role: <strong style={{ color: '#fff' }}>{studentData.role || 'Frontend Developer'}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={() => setActivePage('home')}>
              ✏️ Edit Profile
            </button>
            <button className="btn-primary" onClick={() => setActivePage('interview')}>
              💬 Retake Interview
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Card 1: Skill Match */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role Skill Match</span>
              <div style={{ fontSize: '2.8rem', fontFamily: 'Outfit', fontWeight: 800, color: 'var(--secondary-accent)' }}>
                {matchPct}%
              </div>
            </div>
            <div style={{ fontSize: '2rem' }}>📊</div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Competency alignment for {studentData.role}.
          </p>
          <button
            className="btn-secondary"
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
            onClick={() => setActivePage('skillGap')}
          >
            View Full Skill Matrix →
          </button>
        </div>

        {/* Card 2: Interview Score */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--primary-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mock Interview Rating</span>
              <div style={{ fontSize: '2.8rem', fontFamily: 'Outfit', fontWeight: 800, color: 'var(--primary-accent)' }}>
                {interviewScore} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ 10</span>
              </div>
            </div>
            <div style={{ fontSize: '2rem' }}>💬</div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Average technical & behavioral response score.
          </p>
          <button
            className="btn-secondary"
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
            onClick={() => setActivePage('interview')}
          >
            Review Interview Q&A →
          </button>
        </div>

        {/* Card 3: Action Roadmap */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--status-have)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>6-Week Roadmap</span>
              <div style={{ fontSize: '2.8rem', fontFamily: 'Outfit', fontWeight: 800, color: 'var(--status-have)' }}>
                {milestones.length || 3} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Phases</span>
              </div>
            </div>
            <div style={{ fontSize: '2rem' }}>🗺️</div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Step-by-step projects & learning timeline.
          </p>
          <button
            className="btn-secondary"
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
            onClick={() => setActivePage('roadmap')}
          >
            View Roadmap Timeline →
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="glass-card spider-card">
        <h3 style={{ marginBottom: '1.25rem' }}>Demo Navigation Hub</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div
            onClick={() => setActivePage('home')}
            style={{ cursor: 'pointer', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>🎯 1. Role Selection</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configure student name, target role & skills</p>
          </div>

          <div
            onClick={() => setActivePage('skillGap')}
            style={{ cursor: 'pointer', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>📊 2. Skill Gap</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Skill matrix, HAVE/MISSING priority breakdown</p>
          </div>

          <div
            onClick={() => setActivePage('interview')}
            style={{ cursor: 'pointer', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>💬 3. Mock Interview</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>5-question AI chat simulator with scorecards</p>
          </div>

          <div
            onClick={() => setActivePage('roadmap')}
            style={{ cursor: 'pointer', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>🗺️ 4. Action Roadmap</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>6-week project & study milestone timeline</p>
          </div>
        </div>
      </div>
    </div>
  );
}
