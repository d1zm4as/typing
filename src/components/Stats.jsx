import React from 'react';

export default function Stats({ stats }) {
  return (
    <div className="stats-compact">
      <div className="stat-left">
        <div className="stat-wpm">{stats.wpm}</div>
        <div className="stat-label muted">WPM</div>
      </div>
      <div className="stat-sep" />
      <div className="stat-right">
        <div className="stat-acc">{stats.accuracy}%</div>
        <div className="stat-label muted">Accuracy</div>
      </div>
    </div>
  );
}
