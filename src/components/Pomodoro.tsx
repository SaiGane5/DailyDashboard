import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { useStore } from '../store';

export default function Pomodoro() {
  const {
    pomodoroState,
    pomodoroSettings,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    updatePomodoroTime,
  } = useStore();

  useEffect(() => {
    const interval = setInterval(() => {
      if (pomodoroState.isActive) {
        updatePomodoroTime();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoroState.isActive, updatePomodoroTime]);

  const minutes = Math.floor(pomodoroState.timeLeft / 60);
  const seconds = pomodoroState.timeLeft % 60;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Timer className="w-6 h-6" />
          Pomodoro Timer
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Session {pomodoroState.currentSession + 1}
        </div>
      </div>

      <div className="text-center">
        <div className="text-6xl font-bold text-gray-800 dark:text-white mb-8">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex justify-center gap-4">
          {!pomodoroState.isActive ? (
            <button
              onClick={startPomodoro}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Play className="w-5 h-5" />
              Start
            </button>
          ) : (
            <button
              onClick={pausePomodoro}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          <button
            onClick={resetPomodoro}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Total Sessions</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {pomodoroState.totalSessions}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Total Focus Time</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {Math.round(pomodoroState.totalWorkTime / 60)}m
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}