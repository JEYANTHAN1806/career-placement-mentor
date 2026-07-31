import React from 'react';

export default function LoadingSpinner({ message = 'Analyzing with Claude AI...' }) {
  return (
    <div className="spinner-overlay">
      <div className="spider-spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>
        {message}
      </p>
    </div>
  );
}
