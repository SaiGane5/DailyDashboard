import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useStore } from './store';
import Weather from './components/Weather';
import News from './components/News';
import Pomodoro from './components/Pomodoro';
import Tasks from './components/Tasks';

function App() {
  const { theme, toggleTheme } = useStore();

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg"
            >
              {theme === 'light' ? (
                <Moon className="w-6 h-6" />
              ) : (
                <Sun className="w-6 h-6" />
              )}
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <Weather />
              <Tasks />
            </div>
            <div className="space-y-8">
              <Pomodoro />
              <News />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;