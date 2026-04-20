import React, { useState, useMemo } from 'react';
import { getTestResults, deleteTestResult, clearTestResults } from '../utils/storageUtils';
import { useTheme } from '../contexts/ThemeContext';

export default function History({ onBack }) {
  const [testResults, setTestResults] = useState(getTestResults());
  const [filterType, setFilterType] = useState('all'); // 'all' | 'words' | 'time' | 'quote'
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'wpm' | 'accuracy'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  
  const { isDark } = useTheme();

  const filteredResults = useMemo(() => {
    let filtered = testResults;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.testType === filterType);
    }
    
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      if (sortBy === 'date') {
        aVal = a.timestamp || 0;
        bVal = b.timestamp || 0;
      } else if (sortBy === 'wpm') {
        aVal = a.wpm || 0;
        bVal = b.wpm || 0;
      } else if (sortBy === 'accuracy') {
        aVal = a.accuracy || 0;
        bVal = b.accuracy || 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });
    
    return filtered;
  }, [testResults, filterType, sortBy, sortOrder]);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this test result?')) {
      deleteTestResult(id);
      setTestResults(getTestResults());
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to delete ALL test results? This cannot be undone.')) {
      clearTestResults();
      setTestResults([]);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const stats = useMemo(() => {
    if (filteredResults.length === 0) {
      return {
        avgWPM: 0,
        avgAccuracy: 0,
        bestWPM: 0,
        totalTests: 0,
        totalTime: 0,
      };
    }
    
    return {
      avgWPM: Math.round(filteredResults.reduce((sum, r) => sum + (r.wpm || 0), 0) / filteredResults.length),
      avgAccuracy: Math.round(filteredResults.reduce((sum, r) => sum + (r.accuracy || 0), 0) / filteredResults.length),
      bestWPM: Math.max(...filteredResults.map(r => r.wpm || 0)),
      totalTests: filteredResults.length,
      totalTime: filteredResults.reduce((sum, r) => sum + (r.timeElapsed || 0), 0),
    };
  }, [filteredResults]);

  return (
    <div className="history-container">
      <div className="history-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h1 className="history-title">History</h1>
        <div className="space-placeholder"></div>
      </div>

      {/* Summary Stats */}
      <div className="history-stats-grid">
        <div className="history-stat-card">
          <div className="history-stat-value">{stats.totalTests}</div>
          <div className="history-stat-label">Tests</div>
        </div>
        <div className="history-stat-card">
          <div className="history-stat-value">{stats.avgWPM}</div>
          <div className="history-stat-label">Avg WPM</div>
        </div>
        <div className="history-stat-card">
          <div className="history-stat-value">{stats.bestWPM}</div>
          <div className="history-stat-label">Best WPM</div>
        </div>
        <div className="history-stat-card">
          <div className="history-stat-value">{stats.avgAccuracy}%</div>
          <div className="history-stat-label">Avg Accuracy</div>
        </div>
        <div className="history-stat-card">
          <div className="history-stat-value">{formatDuration(stats.totalTime)}</div>
          <div className="history-stat-label">Total Time</div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="history-controls">
        <div className="filter-group">
          <label>Type:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="control-select">
            <option value="all">All</option>
            <option value="words">Words</option>
            <option value="time">Time</option>
            <option value="quote">Quote</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="control-select">
            <option value="date">Date</option>
            <option value="wpm">WPM</option>
            <option value="accuracy">Accuracy</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Order:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="control-select">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <button onClick={handleClear} className="clear-btn">
          Clear All
        </button>
      </div>

      {/* Test Results List */}
      <div className="history-list">
        {filteredResults.length === 0 ? (
          <div className="empty-state">
            <p>No test results yet. Go back and take a test!</p>
          </div>
        ) : (
          <div className="history-table">
            <div className="table-header">
              <div className="col col-date">Date</div>
              <div className="col col-type">Type</div>
              <div className="col col-wpm">WPM</div>
              <div className="col col-acc">Acc</div>
              <div className="col col-time">Time</div>
              <div className="col col-action">Action</div>
            </div>
            {filteredResults.map((result) => (
              <div key={result.id} className="table-row">
                <div className="col col-date">{formatDate(result.timestamp)}</div>
                <div className="col col-type">
                  <span className={`type-badge type-${result.testType}`}>
                    {result.testType}
                    {result.testType === 'words' && result.wordCount && ` (${result.wordCount})`}
                    {result.testType === 'time' && result.timeMode && ` (${result.timeMode}s)`}
                  </span>
                </div>
                <div className="col col-wpm">
                  <span className="stat-highlight">{result.wpm}</span>
                </div>
                <div className="col col-acc">
                  <span className="stat-highlight">{result.accuracy}%</span>
                </div>
                <div className="col col-time">{result.timeElapsed}s</div>
                <div className="col col-action">
                  <button
                    onClick={() => handleDelete(result.id)}
                    className="delete-btn"
                    title="Delete this result"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
