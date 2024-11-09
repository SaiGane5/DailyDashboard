export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  createdAt: Date;
}

export interface Weather {
  temp: number;
  condition: string;
  icon: string;
  location: string;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  day: string;
  temp: number;
  condition: string;
  icon: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  category: string;
  publishedAt: string;
}

export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

export interface PomodoroState {
  isActive: boolean;
  timeLeft: number;
  currentSession: number;
  isBreak: boolean;
  totalSessions: number;
  totalWorkTime: number;
}