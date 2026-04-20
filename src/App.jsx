import { useState } from 'react'
import TypingTest from './components/TypingTest'
import History from './components/History'
import Settings from './components/Settings'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'

function App() {
  const [view, setView] = useState('test') // 'test' | 'history' | 'settings'

  return (
    <ThemeProvider>
      {view === 'test' ? (
        <TypingTest onViewHistory={() => setView('history')} onViewSettings={() => setView('settings')} />
      ) : view === 'history' ? (
        <History onBack={() => setView('test')} />
      ) : (
        <Settings onBack={() => setView('test')} />
      )}
    </ThemeProvider>
  )
}

export default App
