import React, { useState } from 'react';

export default function Home({ studentData, setStudentData, onStartAnalysis, isLoading }) {
  const [name, setName] = useState(studentData.name || 'Alex Vance');
  const [selectedRole, setSelectedRole] = useState(studentData.role || 'Frontend Developer');
  const [customRole, setCustomRole] = useState('');
  const [skillsText, setSkillsText] = useState(studentData.skills || 'HTML, CSS, JavaScript, React');

  const standardRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'ML Engineer',
    'Other'
  ];

  const quickSkillPresets = {
    'Frontend Developer': 'HTML, CSS, JavaScript, React, Git',
    'Backend Developer': 'JavaScript, Node.js, Express, SQL, REST APIs',
    'Full Stack Developer': 'HTML, CSS, JavaScript, React, Node.js, Express, MongoDB',
    'Data Analyst': 'SQL, Python, Excel, Pandas, Data Visualization',
    'ML Engineer': 'Python, NumPy, Scikit-Learn, Pandas, Math & Stats'
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    if (quickSkillPresets[role]) {
      setSkillsText(quickSkillPresets[role]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalRole = selectedRole === 'Other' ? (customRole.trim() || 'Software Engineer') : selectedRole;
    
    const updated = {
      name: name.trim() || 'Student',
      role: finalRole,
      skills: skillsText
    };

    setStudentData(updated);
    onStartAnalysis(updated);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
        <h1 className="page-title">Personalized AI Placement Mentor</h1>
        <p className="page-subtitle">
          Accelerate your campus placement readiness with AI skill gap analysis, interactive mock interviews, and tailored career roadmaps.
        </p>
      </div>

      <div className="glass-card spider-card">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📋</span> Student Career Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Vance"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Placement Role</label>
            <select
              className="form-select"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              {standardRoles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {selectedRole === 'Other' && (
            <div className="form-group">
              <label className="form-label">Specify Target Role</label>
              <input
                type="text"
                className="form-input"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. DevOps Engineer, Mobile App Developer"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <span>Current Skills & Knowledge</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>(Comma-separated)</span>
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. HTML, CSS, JavaScript, React, Python, Git"
              required
            />
          </div>

          {/* Quick presets helper */}
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick Presets:</span>
            {Object.keys(quickSkillPresets).map((r) => (
              <button
                key={r}
                type="button"
                className="btn-secondary"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                onClick={() => {
                  setSelectedRole(r);
                  setSkillsText(quickSkillPresets[r]);
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Analyzing Skill Gap...' : '🚀 Analyze Skill Gap & Match Score'}
          </button>
        </form>
      </div>
    </div>
  );
}
