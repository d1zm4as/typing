import React from 'react';

export default function Timer({ timeElapsed, isActive }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      <div className={`text-lg font-mono font-semibold ${isActive ? 'text-white' : 'muted'}`}>
        {formatTime(timeElapsed)}
      </div>
    </div>
  );
}
