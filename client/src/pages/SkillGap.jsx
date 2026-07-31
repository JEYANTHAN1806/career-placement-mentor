import React, { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SkillGap({ skillGapData, studentData, onProceedToInterview, onReanalyze, isLoading, error }) {
  const [filter, setFilter] = useState('all');

  if (isLoading) {
    return <LoadingSpinner message={`Claude AI is mapping target skills for ${studentData.role}...`} />;
  }

  if (error || !skillGapData) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="glass-card spider-card">
          <h2 style={{ color: 'var(--primary-accent)', marginBottom: '1rem' }}>Analysis Failed</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {error || 'Unable to retrieve skill gap data.'}
          </p>
          <button className="btn-primary" onClick={onReanalyze}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  const { matchPercentage = 65, summary = '', requiredSkills = [] } = skillGapData;

  const filteredSkills = requiredSkills.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const haveCount = requiredSkills.filter(s => s.status === 'have').length;
  const partialCount = requiredSkills.filter(s => s.status === 'partial').length;
  const missingCount = requiredSkills.filter(s => s.status === 'missing').length;

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      <div className="page-header">
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📊</div>
        <h1 className="page-title">Skill Gap & Role Alignment</h1>
        <p className="page-subtitle">
          Target Role: <strong style={{ color: 'var(--secondary-accent)' }}>{studentData.role}</strong>
        </p>
      </div>

      {/* Match Percentage Banner Card */}
      <div className="glass-card spider-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Overall Placement Match Score
            </div>
            <div style={{ fontSize: '3.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: matchPercentage >= 70 ? 'var(--status-have)' : 'var(--secondary-accent)' }}>
              {matchPercentage}%
            </div>
            <div className="progress-bar-bg" style={{ height: '12px', marginTop: '0.5rem' }}>
              <div className="progress-bar-fill" style={{ width: `${matchPercentage}%` }}></div>
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--border-card)', paddingLeft: '1.5rem' }}>
            <p style={{ color: 'var(--text-main)', fontSize: '1rem', fontStyle: 'italic', marginBottom: '1rem' }}>
              "{summary}"
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ color: 'var(--status-have)', fontWeight: 700 }}>{haveCount}</span> <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Acquired</span>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <span style={{ color: 'var(--status-partial)', fontWeight: 700 }}>{partialCount}</span> <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Partial</span>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <span style={{ color: 'var(--status-missing)', fontWeight: 700 }}>{missingCount}</span> <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Missing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.3rem' }}>Required Competencies ({filteredSkills.length})</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'have', 'partial', 'missing'].map((f) => (
            <button
              key={f}
              className={`btn-secondary ${filter === f ? 'active' : ''}`}
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '0.8rem',
                textTransform: 'capitalize',
                borderColor: filter === f ? 'var(--primary-accent)' : 'var(--border-card)',
                background: filter === f ? 'rgba(255, 0, 85, 0.15)' : 'transparent'
              }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Matrix List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
        {filteredSkills.map((item, index) => (
          <div
            key={index}
            className="glass-card"
            style={{
              padding: '1.1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              borderLeft: item.status === 'have'
                ? '4px solid var(--status-have)'
                : item.status === 'partial'
                ? '4px solid var(--status-partial)'
                : '4px solid var(--status-missing)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.25rem' }}>
                {item.status === 'have' && '✅'}
                {item.status === 'partial' && '⚠️'}
                {item.status === 'missing' && '❌'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{item.skill}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Priority: <span style={{ textTransform: 'capitalize', color: item.priority === 'high' ? 'var(--primary-accent)' : 'var(--text-main)' }}>{item.priority}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className={`badge badge-priority-${item.priority || 'medium'}`}>
                {item.priority} Priority
              </span>
              <span className={`badge badge-${item.status}`}>
                {item.status === 'have' ? 'Acquired' : item.status === 'partial' ? 'Partial' : 'Missing'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="glass-card spider-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(255, 0, 85, 0.08) 0%, rgba(0, 242, 254, 0.05) 100%)' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Ready for Stage 2: Mock Interview Simulator</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Test your communication and technical knowledge in a 5-question AI mock interview tailored for {studentData.role}.
        </p>
        <button className="btn-primary" onClick={onProceedToInterview}>
          💬 Start AI Mock Interview Now →
        </button>
      </div>
    </div>
  );
}
