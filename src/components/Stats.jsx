import React from 'react';

function Stats({ stats }) {
  const displayStats = [
    { label: 'WPM', value: stats.wpm, color: 'success' },
    { label: 'Raw WPM', value: stats.rawWPM, color: 'accent' },
    { label: 'Accuracy', value: `${stats.accuracy}%`, color: 'accent' },
    { label: 'Characters', value: `${stats.correctChars}/${stats.totalTyped}`, color: 'default' },
  ];

  return (
    <>
      {/* Compact view for inline */}
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

      {/* Detailed view for results screen */}
      <div className="stats-detailed">
        {displayStats.map((stat) => (
          <div key={stat.label} className="stat-box">
            <div className={`stat-value ${stat.color === 'error' ? 'error' : ''}`}>
              {stat.value}
            </div>
            <div className="stat-name">{stat.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default React.memo(Stats);
