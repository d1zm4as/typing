import React from 'react';

export default function WpmGraph({ data = [] }) {
  const width = 320;
  const height = 100;
  const padding = 10;
  if (!data || data.length === 0) return (
    <div className="wpm-graph empty">No data</div>
  );

  const max = Math.max(...data, 10);
  const points = data.map((v, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = padding + (1 - v / max) * (height - padding * 2);
    return `${x},${y}`;
  });

  // polygon for filled area (close to bottom)
  const polyPoints = [`${padding},${height - padding}`, ...points, `${width - padding},${height - padding}`].join(' ');
  const linePoints = points.join(' ');

  return (
    <div className="wpm-graph" style={{width, height}}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} preserveAspectRatio="none">
        <defs>
          <linearGradient id="wg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff6b9a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ff6b9a" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={polyPoints} fill="url(#wg)" />
        <polyline fill="none" stroke="#ff6b9a" strokeWidth="2" points={linePoints} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
