import React, { useState, useEffect } from 'react';

const messages = [
  "Keep going! 🚀",
  "You're doing great! 💪",
  "Focus and flow! 🌊",
  "One word at a time! 📝",
  "Speed and accuracy! ⚡",
  "You're unstoppable! 🔥",
  "Stay in the zone! 🎯",
  "Type like the wind! 🌪️",
  "Precision matters! 🔍",
  "You've got this! ✨"
];

const MotivationalMessage = ({ isActive, wpm }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive && wpm > 20) {
      const interval = setInterval(() => {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setCurrentMessage(randomMessage);
        setIsVisible(true);
        
        setTimeout(() => setIsVisible(false), 3000);
      }, 15000); // Show every 15 seconds

      return () => clearInterval(interval);
    }
  }, [isActive, wpm]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
      <div className="bg-accent/10 backdrop-blur-sm border border-accent/20 rounded-lg px-4 py-2 text-accent font-medium animate-bounce-in">
        {currentMessage}
      </div>
    </div>
  );
};

export default MotivationalMessage;
