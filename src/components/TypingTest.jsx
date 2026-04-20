import React, { useState, useEffect, useRef } from 'react';
import { generateWords, wordsToString } from '../utils/wordUtils';
import { calculateStats } from '../utils/statsUtils';
import Timer from './Timer';
import Stats from './Stats';
import WpmGraph from './WpmGraph';

export default function TypingTest() {
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
  const [mode, setMode] = useState('words');
  const inputRef = useRef(null);
  const testText = wordsToString(words);

  useEffect(() => {
    let interval;
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        if (!startTime) return;
        const seconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
        setTimeElapsed(seconds);
        try {
          const s = calculateStats(userInput, testText, seconds);
          setWpmHistory((h) => [...h, s.wpm]);
        } catch (e) {}
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isFinished, userInput, testText]);

  useEffect(() => {
    if (inputRef.current && !isFinished) inputRef.current.focus();
  }, [isFinished]);

  const handleInputChange = (e) => {
    let input = e.target.value;
    if (input.length > 0 && input[0] === ' ') return;
    if (!isActive && input.length > 0) {
      setIsActive(true);
      setStartTime(Date.now());
    }
    // detect typed char index for animation
    if (input.length > userInput.length) {
      setLastTypedIndex(input.length - 1);
    } else {
      setLastTypedIndex(-1);
    }

    // detect word completion: user typed a space after a non-space
    const prev = userInput;
    if (input.endsWith(' ') && !prev.endsWith(' ') && input.length > prev.length) {
      const typedTrim = input.replace(/\s+$/g, '');
      const typedWords = typedTrim.length ? typedTrim.split(' ') : [];
      const completedIndex = typedWords.length - 1;
      if (completedIndex >= 0 && completedIndex < words.length) {
        const now = Date.now();
        const interval = lastWordTime ? (now - lastWordTime) / 1000 : ((now - (startTime || now)) / 1000);
        // compute starting character index for this word
        let startChar = 0;
        for (let i = 0; i < completedIndex; i++) startChar += words[i].length + 1;
        const len = words[completedIndex].length;
        const typedSegment = typedTrim.slice(startChar, startChar + len);
        let correctChars = 0;
        for (let i = 0; i < Math.min(len, typedSegment.length); i++) {
          if (typedSegment[i] === words[completedIndex][i]) correctChars++;
        }
        const wordWpm = interval > 0 ? Math.round((correctChars / 5) / (interval / 60)) : 0;
        setWpmHistory((h) => [...h, wordWpm]);
        setWordTimestamps((t) => [...t, now]);
        setLastWordTime(now);
      }
    }

    // normalize trailing whitespace and collapse multiple spaces
    const trimmedEnd = input.replace(/\s+$/g, '');
    const normalized = trimmedEnd.replace(/\s+/g, ' ');

    // finish if normalized input matches the target (handles extra/multi spaces)
    if (normalized === testText || input.slice(0, testText.length) === testText) {
      setUserInput(testText);
      setIsActive(false);
      setIsFinished(true);
      setEndTime(Date.now());
      const finalSec = startTime ? Math.max(1, Math.round((Date.now() - startTime) / 1000)) : Math.max(1, timeElapsed);
      setTimeElapsed(finalSec);
      // trigger fade-out of text then show results
      setTextFading(true);
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
  };

  const handleReset = () => {
    // keep current words (changed via controls) — do not regenerate here
    setUserInput('');
    setIsActive(false);
    setTimeElapsed(0);
    setIsFinished(false);
    setLastTypedIndex(-1);
    setWpmHistory([]);
    setTextFading(false);
    setShowResults(false);
    if (inputRef.current) inputRef.current.focus();
  };

  // reset on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleReset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const statsLive = calculateStats(userInput, testText, Math.max(1, timeElapsed));

  const [wpmHistory, setWpmHistory] = useState([]);
  const [wordTimestamps, setWordTimestamps] = useState([]);
  const [lastWordTime, setLastWordTime] = useState(null);

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
      const wordStart = charPos;
      const letters = chars.map((char, i) => {
        const index = charPos;
        const typed = index < userInput.length;
        const correct = typed && userInput[index] === char;
        const className = typed ? (correct ? 'char-correct' : 'char-incorrect') : 'char-untyped';
        const showCursor = index === userInput.length && !isFinished;
        charPos += 1;

        return (
          <span key={`c-${wIdx}-${i}`} className="smooth-fade" aria-hidden>
            {showCursor && <span className="cursor" aria-hidden />}
            <span className={`${className} ${index === lastTypedIndex ? 'char-pop' : ''}`}>{char}</span>
          </span>
        );
      });

      // after the word, account for the space character in positions
      const wordEnd = charPos - 1;
      const spaceIndex = charPos;
      const spaceCursor = spaceIndex === userInput.length && !isFinished;
      charPos += 1; // for the space

      const wordDone = userInput.length > wordEnd;

      return (
        <span key={`w-${wIdx}`} className={`word ${wordDone ? 'word-done' : ''}`} aria-hidden>
          {letters}
          {spaceCursor && <span className="cursor" aria-hidden />}
          <span className="space">&nbsp;</span>
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
    <div className="app-shell">
      <div className="typing-area w-full">
        {/* small muted stats like in screenshot */}
        <div className="text-center mb-6 muted text-xs stats-line">
          <div className="stats-left">
            <span className="mr-3">english</span>
            <span className="mr-3">average pace {statsLive.wpm} wpm</span>
            <span className="mr-3">avg: {statsLive.wpm} wpm</span>
            <span>{statsLive.accuracy}% acc</span>
          </div>
          <div className="stats-controls">
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
            {wordCount === 'custom' && (
              <input type="number" min="1" max="1000" defaultValue={50} onBlur={(e) => { const n = Math.max(1, Math.min(1000, parseInt(e.target.value,10)||50)); setWordCount(n); setWords(generateWords(n)); handleReset(); }} className="custom-count-input" />
            )}
          </div>
        </div>

        <div className={`text-display mb-4 ${textFading ? 'fade-out' : ''}`} onClick={() => inputRef.current && inputRef.current.focus()}>
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
