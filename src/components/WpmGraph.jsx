import React from 'react';

function WpmGraph({ data = [] }) {
  const width = 320;
  const height = 120;
  const padding = 15;
  
  if (!data || data.length === 0) return (
    <div className="wpm-graph empty">No data available</div>
  );

  const max = Math.max(...data, 10);
  const min = Math.max(0, Math.min(...data) - 10);
  const range = max - min;
  
  const points = data.map((v, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
    const normalizedV = (v - min) / (range || 1);
    const y = padding + (1 - normalizedV) * (height - padding * 2);
    return `${x},${y}`;
  });

  // polygon for filled area
  const polyPoints = [`${padding},${height - padding}`, ...points, `${width - padding},${height - padding}`].join(' ');
  const linePoints = points.join(' ');

  return (
    <div className="wpm-graph" style={{width, height}}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} preserveAspectRatio="none">
        <defs>
          <linearGradient id="wg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#5fe0a3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#5fe0a3" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="wgLine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#5fe0a3" />
            <stop offset="100%" stopColor="#c99b93" />
          </linearGradient>
        </defs>
        
        {/* Background grid */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} 
              stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        
        {/* Filled area */}
        <polygon points={polyPoints} fill="url(#wg)" />
        
        {/* Line */}
        <polyline 
          fill="none" 
          stroke="url(#wgLine)" 
          strokeWidth="2.5" 
          points={linePoints} 
          strokeLinecap="round" 
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Data points */}
        {points.map((point, i) => {
          const [x, y] = point.split(',').map(parseFloat);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2.5"
              fill="#5fe0a3"
              opacity={i === points.length - 1 ? 1 : 0.6}
            />
          );
        })}
      </svg>
      
      {/* Stats beneath graph */}
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--muted)'}}>
        <span>Peak: {Math.max(...data)} wpm</span>
        <span>Avg: {Math.round(data.reduce((a,b) => a+b, 0) / data.length)} wpm</span>
        <span>Min: {Math.min(...data)} wpm</span>
      </div>
    </div>
  );
}

export default React.memo(WpmGraph);
