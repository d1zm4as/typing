# MonkeyType Clone - Advanced Typing Speed Tester

A full-featured typing speed test application built with React, Vite, and Tailwind CSS. This is a feature-rich clone of MonkeyType with a modern, responsive design.

## Features

### 🎯 Core Typing Tests
- **Words Mode**: Type a set number of words (10, 25, 50, 100, or custom)
- **Time Mode**: Time-based tests (15s, 30s, 60s)
- **Quote Mode**: Type famous quotes with variable difficulty levels (short, medium)

### 📊 Statistics & Tracking
- **Live Stats**: Real-time WPM and accuracy during tests
- **History Page**: Complete test history with filtering and sorting
- **Leaderboard**: Track your best scores and personal records
  - Fastest WPM
  - Highest Accuracy
  - Most Recent Tests
- **Data Export**: Export all statistics as JSON
- **Performance Graphs**: Visual WPM progression during tests

### ⚙️ Settings & Customization
- **Theme Toggle**: Dark/Light mode with persistent storage
- **Sound Effects**: Toggle keyboard sounds on/off
- **Animation Preferences**: Control animation intensity
- **Font Size Options**: Adjust text display size
- **Cursor Styles**: Choose from different cursor styles
- **Keyboard Shortcuts**: Esc to reset current test

### 🎨 UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Polish transitions and visual feedback
- **Real-time Feedback**: Character-by-character typing feedback
  - Green: Correct character
  - Red: Incorrect character
  - Gray: Not yet typed
- **Accessibility**: Keyboard-focused navigation

### 🔊 Audio Feedback
- Keystroke sounds
- Success sound on test completion
- Customizable audio settings

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── TypingTest.jsx      # Main typing interface
│   ├── History.jsx         # Test history & statistics
│   ├── Settings.jsx        # User preferences
│   ├── Leaderboard.jsx     # Personal best scores
│   ├── Stats.jsx           # Results display
│   ├── Timer.jsx           # Time display
│   └── WpmGraph.jsx        # Performance visualization
├── contexts/
│   └── ThemeContext.jsx    # Theme management
├── utils/
│   ├── wordUtils.js        # Word generation utilities
│   ├── statsUtils.js       # Calculation functions
│   ├── storageUtils.js     # LocalStorage management
│   └── soundUtils.js       # Audio effects
├── data/
│   └── quotes.js           # Quote database
├── App.jsx                 # Main app component
├── App.css                 # App styles
├── index.css               # Global styles
└── main.jsx                # Entry point
```

## Key Metrics Tracked

- **WPM (Words Per Minute)**: Accuracy-adjusted typing speed
- **Raw WPM**: Total characters typed per minute
- **Accuracy**: Percentage of correctly typed characters
- **Time Elapsed**: Duration of the test
- **Correct/Incorrect Characters**: Character-by-character breakdown

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Reset current test |
| `Click on text` | Focus input |

## Statistics Calculation

- **1 Word = 5 characters** (industry standard)
- **WPM = (Correct Characters ÷ 5) ÷ (Time in Minutes)**
- **Accuracy = (Correct Characters ÷ Total Characters) × 100%**

## Data Storage

All data is stored locally in your browser's localStorage:
- Test results
- Theme preference
- Settings (sound, animations, etc.)
- Statistics

No data is sent to external servers.

## Technologies Used

- **React 19**: UI framework
- **Vite**: Build tool & dev server
- **Tailwind CSS 4**: Styling
- **Web Audio API**: Sound effects
- **LocalStorage API**: Persistent storage

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Optimizations

- React.memo for component memoization
- useCallback for event handler optimization
- useMemo for derived state calculation
- Efficient re-render management
- Debounced stats calculations

## Audio Features

Sound effects are generated using the Web Audio API:
- **Keystroke**: Triangle wave at 700-900Hz
- **Success**: Three ascending sine waves
- **Error**: Square wave at 300Hz

All sounds can be toggled in settings.

## Future Enhancements

Potential features for future versions:

- Custom word lists
- Theme customization
- More quote categories
- Advanced analytics
- Daily challenges


## Troubleshooting

### Sounds not working?
- Check browser permissions
- Ensure "Sound Effects" is enabled in Settings
- Try a different browser

### Stats not saving?
- Check if localStorage is enabled
- Try clearing browser cache
- Check browser storage quota

### Performance issues?
- Disable animations in Settings
- Close other browser tabs
- Try a different browser

## License

MIT License - Feel free to use this project for learning and personal use.

## Contributing

Feel free to fork, modify, and improve this project!

## Acknowledgments

- Inspired by [MonkeyType](https://monkeytype.com/)
- Built as a learning project with React and modern web technologies
- Quote database curated from famous speeches and literature

## Support

For issues, suggestions, or improvements, please create an issue or submit a pull request.

---

Happy typing! 🚀

Average user WPM ranges:
- Beginner: 20-40 WPM
- Intermediate: 40-70 WPM
- Advanced: 70-100 WPM
- Professional: 100+ WPM

Challenge yourself and see how fast you can type!
