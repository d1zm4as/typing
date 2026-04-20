// Storage utilities for persisting typing test stats

const STORAGE_KEY = 'typingTestStats';
const STREAK_KEY = 'typingStreak';
const STORAGE_VERSION = 1;

export const saveTestResult = (result) => {
  try {
    const existing = getTestResults() || [];
    const newResult = {
      ...result,
      timestamp: Date.now(),
      id: `${Date.now()}-${Math.random()}`,
    };
    const updated = [...existing, newResult];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Update streak
    updateStreak(result.accuracy >= 95); // Consider 95%+ as success for streak
    
    return newResult;
  } catch (error) {
    console.error('Failed to save test result:', error);
    return null;
  }
};

export const getTestResults = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to retrieve test results:', error);
    return [];
  }
};

export const getStats = () => {
  const results = getTestResults();
  if (results.length === 0) {
    return {
      totalTests: 0,
      averageWPM: 0,
      averageAccuracy: 0,
      bestWPM: 0,
      totalTime: 0,
      streak: 0,
      bestStreak: 0,
    };
  }

  const totalTests = results.length;
  const averageWPM = Math.round(results.reduce((sum, r) => sum + (r.wpm || 0), 0) / totalTests);
  const averageAccuracy = Math.round(results.reduce((sum, r) => sum + (r.accuracy || 0), 0) / totalTests);
  const bestWPM = Math.max(...results.map(r => r.wpm || 0));
  const totalTime = results.reduce((sum, r) => sum + (r.timeElapsed || 0), 0);
  
  const streak = getStreak();
  const bestStreak = getBestStreak();

  return {
    totalTests,
    averageWPM,
    averageAccuracy,
    bestWPM,
    totalTime,
    streak,
    bestStreak,
  };
};

export const clearTestResults = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear test results:', error);
    return false;
  }
};

export const deleteTestResult = (id) => {
  try {
    const results = getTestResults();
    const filtered = results.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete test result:', error);
    return false;
  }
};

// Streak management
export const updateStreak = (isSuccess) => {
  try {
    let streakData = getStreakData();
    
    if (isSuccess) {
      streakData.current += 1;
    } else {
      if (streakData.current > streakData.best) {
        streakData.best = streakData.current;
      }
      streakData.current = 0;
    }
    
    streakData.lastUpdate = Date.now();
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
  } catch (error) {
    console.error('Failed to update streak:', error);
  }
};

export const getStreak = () => {
  const data = getStreakData();
  return data.current;
};

export const getBestStreak = () => {
  const data = getStreakData();
  return data.best;
};

const getStreakData = () => {
  try {
    const data = localStorage.getItem(STREAK_KEY);
    if (!data) {
      return { current: 0, best: 0, lastUpdate: Date.now() };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to retrieve streak data:', error);
    return { current: 0, best: 0, lastUpdate: Date.now() };
  }
};
