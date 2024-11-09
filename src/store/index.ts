import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, PomodoroSettings, PomodoroState } from '../types';

interface AppState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  pomodoroSettings: PomodoroSettings;
  updatePomodoroSettings: (settings: PomodoroSettings) => void;
  pomodoroState: PomodoroState;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  updatePomodoroTime: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...task, id: crypto.randomUUID(), createdAt: new Date() },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      pomodoroSettings: {
        workDuration: 25 * 60,
        breakDuration: 5 * 60,
        longBreakDuration: 15 * 60,
        sessionsBeforeLongBreak: 4,
      },
      updatePomodoroSettings: (settings) =>
        set({ pomodoroSettings: settings }),
      pomodoroState: {
        isActive: false,
        timeLeft: 25 * 60,
        currentSession: 0,
        isBreak: false,
        totalSessions: 0,
        totalWorkTime: 0,
      },
      startPomodoro: () =>
        set((state) => ({
          pomodoroState: { ...state.pomodoroState, isActive: true },
        })),
      pausePomodoro: () =>
        set((state) => ({
          pomodoroState: { ...state.pomodoroState, isActive: false },
        })),
      resetPomodoro: () =>
        set((state) => ({
          pomodoroState: {
            ...state.pomodoroState,
            isActive: false,
            timeLeft: state.pomodoroSettings.workDuration,
            isBreak: false,
          },
        })),
      updatePomodoroTime: () =>
        set((state) => {
          if (!state.pomodoroState.isActive) return state;
          
          const newTimeLeft = state.pomodoroState.timeLeft - 1;
          if (newTimeLeft === 0) {
            const isBreak = !state.pomodoroState.isBreak;
            const currentSession = isBreak
              ? state.pomodoroState.currentSession
              : state.pomodoroState.currentSession + 1;
            
            return {
              pomodoroState: {
                ...state.pomodoroState,
                timeLeft: isBreak
                  ? currentSession % state.pomodoroSettings.sessionsBeforeLongBreak === 0
                    ? state.pomodoroSettings.longBreakDuration
                    : state.pomodoroSettings.breakDuration
                  : state.pomodoroSettings.workDuration,
                isBreak,
                currentSession,
                totalSessions: state.pomodoroState.totalSessions + 1,
                totalWorkTime: state.pomodoroState.totalWorkTime + (isBreak ? 0 : state.pomodoroSettings.workDuration),
              },
            };
          }

          return {
            pomodoroState: {
              ...state.pomodoroState,
              timeLeft: newTimeLeft,
            },
          };
        }),
    }),
    {
      name: 'dashboard-storage',
    }
  )
);