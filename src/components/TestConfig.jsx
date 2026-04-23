import React from 'react';
import './TestConfig.css';

export default function TestConfig({
  testType,
  setTestType,
  timeMode,
  setTimeMode,
  wordCount,
  setWordCount,
  quoteLength,
  setQuoteLength,
  isPunctuation,
  setIsPunctuation,
  isNumbers,
  setIsNumbers,
}) {
  const testModes = [
    { id: 'words', label: 'words', icon: '📝' },
    { id: 'time', label: 'time', icon: '⏱️' },
    { id: 'quote', label: 'quote', icon: '💬' },
  ];

  const wordCountOptions = [10, 25, 50, 100];
  const timeModeOptions = [15, 30, 60, 120];
  const quoteLengthOptions = [
    { id: 'short', label: 'short' },
    { id: 'medium', label: 'medium' },
    { id: 'long', label: 'long' },
  ];

  const getMode2Options = () => {
    switch (testType) {
      case 'words':
        return wordCountOptions;
      case 'time':
        return timeModeOptions;
      case 'quote':
        return quoteLengthOptions;
      default:
        return [];
    }
  };

  const getMode2Label = () => {
    switch (testType) {
      case 'words':
        return wordCount;
      case 'time':
        return `${timeMode}s`;
      case 'quote':
        return quoteLength;
      default:
        return '';
    }
  };

  const handleMode2Change = (value) => {
    switch (testType) {
      case 'words':
        setWordCount(value);
        break;
      case 'time':
        setTimeMode(value);
        break;
      case 'quote':
        setQuoteLength(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="test-config">
      {/* Left section: Punctuation & Numbers toggles */}
      <div className="config-section config-toggles">
        <button
          className={`toggle-btn ${isPunctuation ? 'active' : ''}`}
          onClick={() => setIsPunctuation(!isPunctuation)}
          title="Toggle punctuation"
        >
          <span className="toggle-label">punctuation</span>
        </button>
        <button
          className={`toggle-btn ${isNumbers ? 'active' : ''}`}
          onClick={() => setIsNumbers(!isNumbers)}
          title="Toggle numbers"
        >
          <span className="toggle-label">numbers</span>
        </button>
      </div>

      {/* Center section: Test mode selector */}
      <div className="config-section config-modes">
        {testModes.map((mode) => (
          <button
            key={mode.id}
            className={`mode-btn ${testType === mode.id ? 'active' : ''}`}
            onClick={() => setTestType(mode.id)}
            title={`Test mode: ${mode.label}`}
          >
            <span className="mode-icon">{mode.icon}</span>
            <span className="mode-label">{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Right section: Mode2 selector (duration/word count/quote-length) */}
      <div className="config-section config-mode2">
        <div className="mode2-selector">
          {getMode2Options().map((option) => {
            const value = typeof option === 'object' ? option.id : option;
            const label = typeof option === 'object' ? option.label : option;
            const isActive =
              testType === 'words'
                ? wordCount === value
                : testType === 'time'
                  ? timeMode === value
                  : quoteLength === value;

            return (
              <button
                key={value}
                className={`mode2-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleMode2Change(value)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
