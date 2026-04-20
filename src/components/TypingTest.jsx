import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { generateWords, wordsToString } from '../utils/wordUtils';
import { calculateStats } from '../utils/statsUtils';
import { saveTestResult, getStats } from '../utils/storageUtils';
import { playKeySound, playSuccessSound } from '../utils/soundUtils';
import { useTheme } from '../contexts/ThemeContext';
import { getRandomQuote, getQuotesByLength } from '../data/quotes';
import Timer from './Timer';
import Stats from './Stats';
import WpmGraph from './WpmGraph';

export default function TypingTest({ onViewHistory, onViewSettings }) {
  // State declarations - organized at top
  const [wordCount, setWordCount] = useState(50);
  const [words, setWords] = useState(() => generateWords(50));
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [textFading, setTextFading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastTypedIndex, setLastTypedIndex] = useState(-1);
  const [testType, setTestType] = useState('words'); // 'words' | 'time' | 'quote'
  const [timeMode, setTimeMode] = useState(60); // 15, 30, 60, or custom value in seconds
  const [currentQuote, setCurrentQuote] = useState(null);
  const [quoteLength, setQuoteLength] = useState('short'); // 'short' | 'medium' | 'long'
  const [wpmHistory, setWpmHistory] = useState([]);
  const [wordTimestamps, setWordTimestamps] = useState([]);
  const [lastWordTime, setLastWordTime] = useState(null);
  const [overallStats, setOverallStats] = useState(() => getStats());
  const [zenMode, setZenMode] = useState(() => {
    const saved = localStorage.getItem('zenMode');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [showZenControls, setShowZenControls] = useState(false);
  const [zenControlTimeout, setZenControlTimeout] = useState(null);
  
  const { toggleTheme, isDark } = useTheme();
  const inputRef = useRef(null);
  const textDisplayRef = useRef(null);
  const testText = currentQuote ? currentQuote.text : wordsToString(words);

  useEffect(() => {
    let interval;
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        if (!startTime) return;
        const seconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
        setTimeElapsed(seconds);
        
        // Check if time-based test is complete
        if (testType === 'time' && seconds >= timeMode) {
          setIsActive(false);
          setIsFinished(true);
          setEndTime(Date.now());
          setTextFading(true);
          setTimeout(() => setShowResults(true), 350);
          return;
        }
        
        try {
          const s = calculateStats(userInput, testText, seconds);
          setWpmHistory((h) => [...h, s.wpm]);
        } catch (e) {}
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isFinished, userInput, testText, testType, timeMode, startTime]);

  useEffect(() => {
    if (inputRef.current && !isFinished) inputRef.current.focus();
  }, [isFinished]);

  // Auto-scroll text display to keep cursor in view
  useEffect(() => {
    if (textDisplayRef.current && userInput.length > 0) {
      const container = textDisplayRef.current;
      const cursor = container.querySelector('.cursor');
      if (cursor) {
        const containerRect = container.getBoundingClientRect();
        const cursorRect = cursor.getBoundingClientRect();
        const relativeTop = cursorRect.top - containerRect.top + container.scrollTop;
        
        // Keep cursor in the upper-middle part of the container
        const targetScroll = Math.max(0, relativeTop - container.clientHeight * 0.35);
        container.scrollTop = targetScroll;
      }
    }
  }, [userInput]);

  // Save test result when finished
  useEffect(() => {
    if (isFinished && userInput.length > 0) {
      const result = saveTestResult({
        wpm: statsLive.wpm,
        rawWPM: statsLive.rawWPM,
        accuracy: statsLive.accuracy,
        correctChars: statsLive.correctChars,
        incorrectChars: statsLive.incorrectChars,
        totalTyped: statsLive.totalTyped,
        timeElapsed,
        testType,
        timeMode: testType === 'time' ? timeMode : null,
        wordCount: testType === 'words' ? wordCount : null,
        quote: testType === 'quote' ? currentQuote : null,
      });
      if (result) {
        setOverallStats(getStats());
      }
    }
  }, [isFinished]);

  const handleInputChange = useCallback((e) => {
    let input = e.target.value;
    if (input.length > 0 && input[0] === ' ') return;
    if (!isActive && input.length > 0) {
      setIsActive(true);
      setStartTime(Date.now());
    }
    // detect typed char index for animation
    if (input.length > userInput.length) {
      setLastTypedIndex(input.length - 1);
      playKeySound();
    } else {
      setLastTypedIndex(-1);
    }

    // normalize trailing whitespace and collapse multiple spaces
    const trimmedEnd = input.replace(/\s+$/g, '');
    const normalized = trimmedEnd.replace(/\s+/g, ' ');

    // finish if normalized input matches the target (handles extra/multi spaces)
    const exactTrimMatch = normalized === testText;
    const prefixMatch = input.slice(0, testText.length) === testText;
    // robust character-by-character match when input reaches the target length
    let charByCharMatch = false;
    if (input.length >= testText.length) {
      charByCharMatch = true;
      for (let i = 0; i < testText.length; i++) {
        if (input[i] !== testText[i]) {
          charByCharMatch = false;
          break;
        }
      }
    }

    if (exactTrimMatch || prefixMatch || charByCharMatch) {
      setUserInput(testText);
      setIsActive(false);
      setIsFinished(true);
      setEndTime(Date.now());
      const finalSec = startTime ? Math.max(1, Math.round((Date.now() - startTime) / 1000)) : Math.max(1, timeElapsed);
      setTimeElapsed(finalSec);
      // trigger fade-out of text then show results
      setTextFading(true);
      playSuccessSound();
      setTimeout(() => setShowResults(true), 350);
      try {
        const s = calculateStats(testText, testText, finalSec);
        setWpmHistory((h) => (h && h.length && h[h.length - 1] === s.wpm ? h : [...h, s.wpm]));
      } catch (e) {}
      return;
    }

    // if user typed beyond target, clamp the input to target length
    if (input.length >= testText.length) {
      input = input.slice(0, testText.length);
      setUserInput(input);
      return;
    }

    setUserInput(input);
  }, [isActive, userInput, testText, startTime, timeElapsed]);

  const handleReset = useCallback(() => {
    // keep current words (changed via controls) — do not regenerate here
    setUserInput('');
    setIsActive(false);
    setTimeElapsed(0);
    setIsFinished(false);
    setLastTypedIndex(-1);
    setWpmHistory([]);
    setWordTimestamps([]);
    setLastWordTime(null);
    setTextFading(false);
    setShowResults(false);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleTestTypeChange = useCallback((newType) => {
    handleReset();
    setTestType(newType);
    if (newType === 'time') {
      setWords(generateWords(250)); // Generate plenty of words for any time-based test
    } else if (newType === 'words') {
      setWords(generateWords(wordCount));
      setCurrentQuote(null);
    } else if (newType === 'quote') {
      setWords([]);
      setCurrentQuote(getRandomQuote());
    }
  }, [wordCount]);

  const handleTimeChange = useCallback((seconds) => {
    setTimeMode(seconds);
    if (testType === 'time') {
      handleReset();
      setWords(generateWords(250));
    }
  }, [testType]);

  const handleQuoteLengthChange = useCallback((length) => {
    setQuoteLength(length);
    handleReset();
    const quotes = getQuotesByLength(length);
    if (quotes.length > 0) {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleReset();
      if (e.key === 'Tab') {
        e.preventDefault();
        // Cycle through test types: words -> time -> quote -> words
        const types = ['words', 'time', 'quote'];
        const currentIndex = types.indexOf(testType);
        const nextType = types[(currentIndex + 1) % types.length];
        handleTestTypeChange(nextType);
      }
      if (e.key === 'z' && e.ctrlKey) {
        e.preventDefault();
        setZenMode(!zenMode);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zenMode, testType, handleTestTypeChange]);

  // Zen mode mouse move handler
  useEffect(() => {
    if (!zenMode) return;
    
    const handleMouseMove = () => {
      setShowZenControls(true);
      if (zenControlTimeout) clearTimeout(zenControlTimeout);
      const timeout = setTimeout(() => {
        setShowZenControls(false);
      }, 3000);
      setZenControlTimeout(timeout);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (zenControlTimeout) clearTimeout(zenControlTimeout);
    };
  }, [zenMode, zenControlTimeout]);

  const statsLive = calculateStats(userInput, testText, Math.max(1, timeElapsed));

  // ensure a final WPM snapshot exists when the test finishes
  useEffect(() => {
    if (isFinished) {
      try {
        const s = calculateStats(userInput, testText, Math.max(1, timeElapsed));
        setWpmHistory((h) => {
          if (!h || h.length === 0) return [s.wpm];
          if (h[h.length - 1] === s.wpm) return h;
          return [...h, s.wpm];
        });
      } catch (e) {}
    }
  }, [isFinished]);

  const renderText = () => {
    // Render per-word to avoid clustering and improve wrapping.
    const wordsArr = testText.split(' ');
    let charPos = 0; // absolute character position across whole string

    return wordsArr.map((word, wIdx) => {
      const chars = word.split('');
      const isLast = wIdx === wordsArr.length - 1;
      const wordStart = charPos;
      const wordEnd = charPos + chars.length - 1;
      // consider a word "done" only once the user has moved past it
      // For non-last words require the trailing space to be typed; for the last word
      // treat it as done when fully typed (so the test can finish without an extra space).
      const wordDone = userInput.length > wordEnd && (isLast || userInput[wordEnd + 1] === ' ');

      const letters = chars.map((char, i) => {
        const index = charPos + i;
        const typed = index < userInput.length;
        const correct = typed && userInput[index] === char;
        const className = typed ? (wordDone ? 'char-done' : (correct ? 'char-correct' : 'char-incorrect')) : 'char-untyped';
        const showCursor = index === userInput.length && !isFinished;

        return (
          <span key={`c-${wIdx}-${i}`} className="smooth-fade" aria-hidden>
            {showCursor && <span className="cursor" aria-hidden />}
            <span className={`${className} ${index === lastTypedIndex ? 'char-pop' : ''}`}>{char}</span>
          </span>
        );
      });

      // advance charPos by the number of chars in the word
      charPos += chars.length;

      // only add a space position for non-last words
      let spaceIndex = null;
      let spaceCursor = false;
      if (!isLast) {
        spaceIndex = charPos;
        spaceCursor = spaceIndex === userInput.length && !isFinished;
        charPos += 1; // for the space
      }

      return (
        <span key={`w-${wIdx}`} className={`word ${wordDone ? 'word-done' : ''}`} aria-hidden>
          {letters}
          {spaceCursor && <span className="cursor" aria-hidden />}
          {!isLast && <span className="space">&nbsp;</span>}
        </span>
      );
    });
  };

  // controls for word count
  const handleWordCountChange = (e) => {
    const v = e.target.value;
    if (v === 'custom') {
      setWordCount('custom');
      return;
    }
    const n = parseInt(v, 10) || 50;
    setWordCount(n);
    setWords(generateWords(n));
    handleReset();
  };

  const handleCustomCount = (e) => {
    const n = Math.max(1, Math.min(1000, parseInt(e.target.value, 10) || 50));
    setWordCount(n);
    setWords(generateWords(n));
    handleReset();
  };

  return (
    <div className={`app-shell ${zenMode ? 'zen-mode' + (showZenControls ? ' show-controls' : '') : ''}`}>
      <div className="nav-buttons">
        <button 
          onClick={() => setZenMode(!zenMode)} 
          className="nav-btn" 
          title="Zen Mode (Ctrl+Z)"
        >
          {zenMode ? '🔍' : '🧘'}
        </button>
        <button onClick={onViewSettings} className="nav-btn" title="Settings">
          ⚙️ Settings
        </button>
        <button onClick={onViewHistory} className="nav-btn" title="View history">
          📊 Stats
        </button>
        <div className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {isDark ? '☀️' : '🌙'}
        </div>
      </div>
      <div className="typing-area w-full">
        {/* Compact stats header at top */}
        <div className="compact-stats-header">
          <div className="stats-info">
            <span className="stat-item">english</span>
            <span className="stat-sep">·</span>
            <span className="stat-item">avg pace <strong>{statsLive.wpm}</strong> wpm</span>
            <span className="stat-sep">·</span>
            <span className="stat-item"><strong>{statsLive.accuracy}%</strong> acc</span>
            {overallStats.streak > 0 && (
              <>
                <span className="stat-sep">·</span>
                <span className="streak-counter" title="Current typing streak">
                  🔥 {overallStats.streak}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Controls area */}
        <div className="controls-area">
            {/* Mode selector - with Tab hint */}
            <div className="segmented" title="Press Tab to cycle">
              <button
                className={`seg-btn ${testType === 'words' ? 'active' : ''}`}
                onClick={() => handleTestTypeChange('words')}
              >
                words
              </button>
              {[15, 30, 60].map((seconds) => (
                <button
                  key={seconds}
                  className={`seg-btn ${testType === 'time' && timeMode === seconds ? 'active' : ''}`}
                  onClick={() => { setTimeMode(seconds); handleTestTypeChange('time'); }}
                >
                  {seconds}s
                </button>
              ))}
              <button
                className={`seg-btn ${testType === 'quote' ? 'active' : ''}`}
                onClick={() => handleTestTypeChange('quote')}
              >
                quote
              </button>
            </div>

            {/* Word count controls (shown when in words mode) */}
            {testType === 'words' && (
              <div className="segmented">
                {[10,25,50,100].map((n) => (
                  <button
                    key={n}
                    className={`seg-btn ${wordCount === n ? 'active' : ''}`}
                    onClick={() => { setWordCount(n); setWords(generateWords(n)); handleReset(); }}
                  >
                    {n}
                  </button>
                ))}
                <button className={`seg-btn ${wordCount === 'custom' ? 'active' : ''}`} onClick={() => setWordCount('custom')}>Custom</button>
              </div>
            )}
            
            {wordCount === 'custom' && testType === 'words' && (
              <input type="number" min="1" max="1000" defaultValue={50} onBlur={(e) => { const n = Math.max(1, Math.min(1000, parseInt(e.target.value,10)||50)); setWordCount(n); setWords(generateWords(n)); handleReset(); }} className="custom-count-input" />
            )}

            {/* Quote length controls (shown when in quote mode) */}
            {testType === 'quote' && (
              <div className="segmented">
                {['short', 'medium'].map((length) => (
                  <button
                    key={length}
                    className={`seg-btn ${quoteLength === length ? 'active' : ''}`}
                    onClick={() => handleQuoteLengthChange(length)}
                  >
                    {length}
                  </button>
                ))}
                <button
                  className="seg-btn"
                  onClick={() => { handleReset(); setCurrentQuote(getQuotesByLength(quoteLength)[Math.floor(Math.random() * getQuotesByLength(quoteLength).length)]); }}
                  title="Get a new quote"
                >
                  new
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Timer display */}
        {testType === 'time' && (
          <div className="mb-6 text-center">
            <div className={`text-3xl font-mono font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>
              {Math.max(0, timeMode - timeElapsed)}s
            </div>
          </div>
        )}

        {/* Quote author display */}
        {testType === 'quote' && currentQuote && (
          <div className="mb-2 text-center muted text-xs">
            <span>— {currentQuote.author}</span>
          </div>
        )}

        <div ref={textDisplayRef} className={`text-display mb-4 ${textFading ? 'fade-out' : ''}`} onClick={() => inputRef.current && inputRef.current.focus()}>
          {renderText()}
        </div>

        <div className="mb-2">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder=""
            className="input-hidden"
            disabled={isFinished}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="mt-4">
          {isFinished && (
            <div className={`results-panel ${showResults ? 'visible' : ''}`}>
              <div className="end-results">
                <Stats stats={statsLive} />
                <WpmGraph data={wpmHistory} />
                <button
                  onClick={handleReset}
                  className="seg-btn"
                  style={{ marginTop: '1rem', padding: '0.75rem 1.5rem' }}
                >
                  try again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
