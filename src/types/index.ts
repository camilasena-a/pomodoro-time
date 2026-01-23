// Tipos e Interfaces
export type SessionType = 'work' | 'shortBreak' | 'longBreak';
export type Theme = 'light' | 'dark';
export type ModalType = 'settings' | 'stats' | 'tasks' | 'history' | 'achievements';

export interface PomodoroSettings {
    workDuration: number;
    shortBreak: number;
    longBreak: number;
    soundEnabled: boolean;
    soundVolume?: number;
    soundType?: string;
    autoStartBreaks?: boolean;
    autoStartPomodoros?: boolean;
}

export interface PomodoroStats {
    completedPomodoros: number;
    totalTime: number; // em minutos
    sessionCount: number;
}

export interface SessionState {
    currentTime: number;
    isRunning: boolean;
    currentSessionType: SessionType;
    sessionCount: number;
    completedPomodoros: number;
    totalTime: number;
    timestamp: number;
    workDuration: number;
    shortBreak: number;
    longBreak: number;
}

export interface SessionHistory {
    id: string;
    type: SessionType;
    duration: number; // em minutos
    completedAt: number;
    date: string; // YYYY-MM-DD
    taskId?: string;
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    pomodorosSpent: number;
    createdAt: number;
    completedAt?: number;
    estimatedPomodoros?: number;
}

export interface DailyGoal {
    targetPomodoros: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
    todayPomodoros: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: number;
    progress?: number;
    target?: number;
}

export interface UserStats {
    level: number;
    xp: number;
    xpToNextLevel: number;
    totalXP: number;
}
