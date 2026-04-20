export const calculateWPM = (correctChars, timeInSeconds) => {
  if (timeInSeconds === 0) return 0;
  const minutes = timeInSeconds / 60;
  const words = correctChars / 5; // Standard: 1 word = 5 characters
  return Math.round(words / minutes);
};

export const calculateAccuracy = (correctChars, totalChars) => {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};

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
