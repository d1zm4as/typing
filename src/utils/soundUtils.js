// Sound effects utilities

let audioContext = null;

const initAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Audio context not supported');
      return false;
    }
  }
  return audioContext !== null;
};

export const playKeySound = () => {
  const soundEnabled = JSON.parse(localStorage.getItem('soundEnabled') ?? 'true');
  if (!soundEnabled || !initAudioContext()) return;

  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = 700 + Math.random() * 200;
    osc.type = 'triangle';
    
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.05);
  } catch (e) {
    // Silently fail if audio doesn't work
  }
};

export const playSuccessSound = () => {
  const soundEnabled = JSON.parse(localStorage.getItem('soundEnabled') ?? 'true');
  if (!soundEnabled || !initAudioContext()) return;

  try {
    const notes = [800, 1000, 1200];
    
    for (let i = 0; i < notes.length; i++) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.value = notes[i];
      osc.type = 'sine';
      
      const startTime = audioContext.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
      
      osc.start(startTime);
      osc.stop(startTime + 0.1);
    }
  } catch (e) {
    // Silently fail
  }
};

export const playErrorSound = () => {
  const soundEnabled = JSON.parse(localStorage.getItem('soundEnabled') ?? 'true');
  if (!soundEnabled || !initAudioContext()) return;

  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = 300;
    osc.type = 'square';
    
    gain.gain.setValueAtTime(0.15, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    // Silently fail
  }
};

export const playClickSound = () => {
  const soundEnabled = JSON.parse(localStorage.getItem('soundEnabled') ?? 'true');
  if (!soundEnabled || !initAudioContext()) return;

  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = 500;
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.05, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.03);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.03);
  } catch (e) {
    // Silently fail
  }
};
