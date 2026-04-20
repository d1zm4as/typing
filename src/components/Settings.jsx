import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getTestResults, clearTestResults } from '../utils/storageUtils';

export default function Settings({ onBack }) {
  const { theme, toggleTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [soundVolume, setSoundVolume] = useState(() => {
    const saved = localStorage.getItem('soundVolume');
    return saved ? parseFloat(saved) : 0.3;
  });
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved || 'medium';
  });
  const [cursorStyle, setCursorStyle] = useState(() => {
    const saved = localStorage.getItem('cursorStyle');
    return saved || 'default';
  });
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const saved = localStorage.getItem('animationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [zenMode, setZenMode] = useState(() => {
    const saved = localStorage.getItem('zenMode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('soundVolume', soundVolume.toString());
  }, [soundVolume]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('cursorStyle', cursorStyle);
  }, [cursorStyle]);

  useEffect(() => {
    localStorage.setItem('animationsEnabled', JSON.stringify(animationsEnabled));
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem('zenMode', JSON.stringify(zenMode));
  }, [zenMode]);

  const handleExportStats = () => {
    const results = getTestResults();
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `typing-stats-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetStats = () => {
    if (confirm('Are you sure? This will delete ALL your statistics permanently.')) {
      clearTestResults();
      alert('All statistics have been cleared.');
    }
  };

  const playSound = (volume = soundVolume) => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.log('Could not play sound');
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setSoundVolume(newVolume);
    playSound(newVolume);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h1 className="settings-title">Settings</h1>
        <div className="space-placeholder"></div>
      </div>

      <div className="settings-grid">
        {/* Theme Settings */}
        <div className="settings-card">
          <h2 className="settings-section-title">Appearance</h2>
          
          <div className="setting-item">
            <label>Theme</label>
            <div className="setting-value">
              <button
                onClick={toggleTheme}
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              >
                🌙 Dark
              </button>
              <button
                onClick={toggleTheme}
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              >
                ☀️ Light
              </button>
            </div>
          </div>

          <div className="setting-item">
            <label>Font Size</label>
            <div className="setting-value">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setFontSize(size);
                    playSound();
                  }}
                  className={`size-btn ${fontSize === size ? 'active' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-item">
            <label>Cursor Style</label>
            <select
              value={cursorStyle}
              onChange={(e) => {
                setCursorStyle(e.target.value);
                playSound();
              }}
              className="control-select"
            >
              <option value="default">Default</option>
              <option value="block">Block</option>
              <option value="underline">Underline</option>
              <option value="beam">Beam</option>
            </select>
          </div>
        </div>

        {/* Audio & Effects Settings */}
        <div className="settings-card">
          <h2 className="settings-section-title">Audio & Effects</h2>
          
          <div className="setting-item toggle-item">
            <label>Sound Effects</label>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`toggle-btn ${soundEnabled ? 'active' : ''}`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="setting-item">
            <label>Volume</label>
            <div className="volume-control">
              <span className="volume-icon">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={soundVolume}
                onChange={handleVolumeChange}
                disabled={!soundEnabled}
                style={{
                  opacity: soundEnabled ? 1 : 0.5,
                  cursor: soundEnabled ? 'pointer' : 'not-allowed',
                  width: '120px',
                }}
              />
              <span style={{ fontSize: '0.9rem', minWidth: '30px' }}>
                {Math.round(soundVolume * 100)}%
              </span>
            </div>
          </div>

          <div className="setting-item toggle-item">
            <label>Animations</label>
            <button
              onClick={() => {
                setAnimationsEnabled(!animationsEnabled);
                playSound();
              }}
              className={`toggle-btn ${animationsEnabled ? 'active' : ''}`}
            >
              {animationsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="setting-item toggle-item">
            <label>Zen Mode</label>
            <button
              onClick={() => {
                setZenMode(!zenMode);
                playSound();
              }}
              className={`toggle-btn ${zenMode ? 'active' : ''}`}
            >
              {zenMode ? 'ON' : 'OFF'}
            </button>
            <p className="setting-description">Hides UI elements during typing (move mouse to show)</p>
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-card">
          <h2 className="settings-section-title">Data</h2>
          
          <div className="setting-item">
            <button onClick={handleExportStats} className="action-btn export-btn">
              📥 Export Statistics
            </button>
            <p className="setting-description">Download your test statistics as JSON</p>
          </div>

          <div className="setting-item">
            <button onClick={handleResetStats} className="action-btn danger-btn">
              🗑️ Clear All Statistics
            </button>
            <p className="setting-description">Permanently delete all test results</p>
          </div>
        </div>

        {/* Information */}
        <div className="settings-card">
          <h2 className="settings-section-title">Information</h2>
          
          <div className="setting-item">
            <p className="setting-description">
              <strong>Typing Speed Tester v2.0</strong>
              <br />
              An enhanced MonkeyType clone with streak tracking, zen mode, and more.
            </p>
          </div>

          <div className="setting-item">
            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Keyboard Shortcuts</h3>
            <div className="shortcut-list">
              <div className="shortcut-item">
                <kbd>Esc</kbd> - Reset current test
              </div>
              <div className="shortcut-item">
                <kbd>Click on text</kbd> - Focus input
              </div>
              <div className="shortcut-item">
                <kbd>Tab</kbd> - Switch test modes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
