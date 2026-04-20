/**
 * Calculates Words Per Minute (WPM) from correct characters and time
 * @param {number} correctChars - Number of correctly typed characters
 * @param {number} timeInSeconds - Time elapsed in seconds
 * @returns {number} WPM rounded to nearest integer
 */
export const calculateWPM = (correctChars, timeInSeconds) => {
  if (timeInSeconds === 0) return 0;
  const minutes = timeInSeconds / 60;
  const words = correctChars / 5; // Standard: 1 word = 5 characters
  return Math.round(words / minutes);
};

/**
 * Calculates typing accuracy as a percentage
 * @param {number} correctChars - Number of correctly typed characters
 * @param {number} totalChars - Total characters typed
 * @returns {number} Accuracy percentage (0-100)
 */
export const calculateAccuracy = (correctChars, totalChars) => {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};

/**
 * Calculates comprehensive typing statistics
 * @param {string} userInput - User's typed input
 * @param {string} testText - Target text to type
 * @param {number} timeInSeconds - Time elapsed
 * @returns {Object} Object containing wpm, rawWPM, accuracy, and character counts
 */
export const calculateStats = (userInput, testText, timeInSeconds) => {
  let correctChars = 0;
  let incorrectChars = 0;

  // compare only up to the user's typed characters
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === testText[i]) {
      correctChars++;
    } else {
      incorrectChars++;
    }
  }

  const totalTyped = userInput.length;
  const wpm = calculateWPM(correctChars, timeInSeconds);
  const rawWPM = calculateWPM(totalTyped, timeInSeconds);
  const accuracy = totalTyped === 0 ? 100 : calculateAccuracy(correctChars, totalTyped);

  return {
    wpm,
    rawWPM,
    accuracy,
    correctChars,
    incorrectChars,
    totalTyped,
  };
};
