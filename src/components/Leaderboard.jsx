import React, { useState, useMemo } from 'react';
import { getTestResults } from '../utils/storageUtils';

export default function Leaderboard({ onBack }) {
  const [leaderboardType, setLeaderboardType] = useState('wpm'); // 'wpm' | 'accuracy' | 'recent'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'words' | 'time' | 'quote'
  
  const testResults = useMemo(() => getTestResults(), []);

  const filteredAndSorted = useMemo(() => {
    let results = testResults;
    
    if (filterType !== 'all') {
      results = results.filter(r => r.testType === filterType);
    }
    
    if (leaderboardType === 'wpm') {
      return results
        .sort((a, b) => (b.wpm || 0) - (a.wpm || 0))
        .slice(0, 10);
    } else if (leaderboardType === 'accuracy') {
      return results
        .sort((a, b) => (b.accuracy || 0) - (a.accuracy || 0))
        .slice(0, 10);
    } else {
      return results
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 10);
    }
  }, [testResults, leaderboardType, filterType]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h1 className="leaderboard-title">Leaderboard</h1>
        <div className="space-placeholder"></div>
      </div>

      <div className="leaderboard-controls">
        <div className="filter-group">
          <label>Type:</label>
          <select value={leaderboardType} onChange={(e) => setLeaderboardType(e.target.value)} className="control-select">
            <option value="wpm">Fastest (WPM)</option>
            <option value="accuracy">Most Accurate</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="control-select">
            <option value="all">All Types</option>
            <option value="words">Words Only</option>
            <option value="time">Time Only</option>
            <option value="quote">Quotes Only</option>
          </select>
        </div>
      </div>

      <div className="leaderboard-content">
        {filteredAndSorted.length === 0 ? (
          <div className="empty-state">
            <p>No results yet. Take a test to see scores here!</p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {filteredAndSorted.map((result, index) => (
              <div key={result.id} className="leaderboard-item">
                <div className="rank">
                  {getBadge(index) || <span className="rank-number">#{index + 1}</span>}
                </div>
                <div className="score-main">
                  <div className="score-value">
                    {leaderboardType === 'wpm' ? result.wpm : leaderboardType === 'accuracy' ? result.accuracy : 'N/A'}
                    {leaderboardType !== 'recent' && <span className="score-unit">{leaderboardType === 'wpm' ? 'wpm' : '%'}</span>}
                  </div>
                </div>
                <div className="score-details">
                  <div className="detail">
                    <span className="label">WPM:</span>
                    <span className="value">{result.wpm}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Acc:</span>
                    <span className="value">{result.accuracy}%</span>
                  </div>
                  <div className="detail">
                    <span className="label">Type:</span>
                    <span className="value type-small">
                      {result.testType}
                      {result.testType === 'words' && result.wordCount && ` (${result.wordCount})`}
                      {result.testType === 'time' && result.timeMode && ` (${result.timeMode}s)`}
                    </span>
                  </div>
                </div>
                <div className="score-time">
                  {formatDate(result.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
