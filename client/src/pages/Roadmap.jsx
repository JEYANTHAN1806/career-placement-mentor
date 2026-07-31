import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Roadmap({ roadmapData, studentData, onProceedToDashboard, onGenerateRoadmap, isLoading, error }) {
  if (isLoading) {
    return <LoadingSpinner message={`Generating custom 6-week placement roadmap for ${studentData.role}...`} />;
  }

  if (error || !roadmapData) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="glass-card spider-card">
          <h2 style={{ color: 'var(--primary-accent)', marginBottom: '1rem' }}>Roadmap Generation Error</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || 'Unable to build roadmap.'}</p>
          <button className="btn-primary" onClick={onGenerateRoadmap}>🔄 Generate Roadmap</button>
        </div>
      </div>
    );
  }

  const { summary = '', milestones = [], timelineWeeks = 6 } = roadmapData;

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      <div className="page-header">
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🗺️</div>
        <h1 className="page-title">Personalized Career Roadmap</h1>
        <p className="page-subtitle">
          {timelineWeeks}-Week Action Plan tailored for <strong style={{ color: 'var(--secondary-accent)' }}>{studentData.role}</strong> placement success.
        </p>
      </div>

      <div className="glass-card spider-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--secondary-accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🎯</span> Strategic Executive Summary
        </h3>
        <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.6 }}>
          {summary || `Customized action plan based on your skill gap analysis and mock interview score.`}
        </p>
      </div>

      {/* Timeline Milestones Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '3rem', position: 'relative' }}>
        {milestones.map((m, idx) => (
          <div key={idx} className="glass-card" style={{ position: 'relative', padding: '1.75rem', borderLeft: '4px solid var(--primary-accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span className="badge badge-priority-high" style={{ marginBottom: '0.25rem' }}>
                  {m.duration || `Phase ${idx + 1}`}
                </span>
                <h3 style={{ fontSize: '1.3rem', marginTop: '0.25rem' }}>{m.phase}</h3>
              </div>

              <span className="badge badge-have">
                {idx === 0 ? '▶️ Active Phase' : '📌 Planned Phase'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
              {/* Study Topics */}
              <div>
                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                  📚 Focus Topics & Skills
                </h4>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.925rem' }}>
                  {m.topics?.map((topic, tIdx) => (
                    <li key={tIdx} style={{ marginBottom: '0.4rem' }}>{topic}</li>
                  ))}
                </ul>
              </div>

              {/* Portfolio Project Idea */}
              <div style={{ background: 'rgba(0, 242, 254, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                <h4 style={{ color: 'var(--secondary-accent)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  💡 Portfolio Project Blueprint
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {m.projectIdea}
                </p>
              </div>
            </div>

            {/* Recommended Resources */}
            {m.resources && m.resources.length > 0 && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Recommended Resources:</span>
                {m.resources.map((res, rIdx) => (
                  <span key={rIdx} className="badge badge-priority-medium" style={{ fontSize: '0.75rem' }}>
                    🔗 {res}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card spider-card" style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Full Placement Prep Profile Ready</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          View the unified executive summary dashboard for live judge presentation.
        </p>
        <button className="btn-primary" onClick={onProceedToDashboard}>
          ⚡ Open Demo Executive Dashboard →
        </button>
      </div>
    </div>
  );
}
