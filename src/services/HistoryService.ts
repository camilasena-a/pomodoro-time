import { SessionHistory, SessionType } from '../types';
import { StorageService } from './StorageService';
import { getDateString } from '../utils/timeUtils';

/**
 * Serviço para gerenciar histórico de sessões
 */
export class HistoryService {
    private static history: SessionHistory[] = [];

    static init(): void {
        this.history = StorageService.loadHistory();
    }

    static addSession(type: SessionType, duration: number, taskId?: string): void {
        const session: SessionHistory = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            duration,
            completedAt: Date.now(),
            date: getDateString(),
            taskId
        };

        this.history.push(session);
        StorageService.saveHistory(this.history);
    }

    static getHistory(): SessionHistory[] {
        return [...this.history];
    }

    static getHistoryByDate(date: string): SessionHistory[] {
        return this.history.filter(session => session.date === date);
    }

    static getHistoryByType(type: SessionType): SessionHistory[] {
        return this.history.filter(session => session.type === type);
    }

    static getHistoryByDateRange(startDate: string, endDate: string): SessionHistory[] {
        return this.history.filter(session => {
            return session.date >= startDate && session.date <= endDate;
        });
    }

    static getPomodorosByDate(date: string): number {
        return this.getHistoryByDate(date).filter(s => s.type === 'work').length;
    }

    static getTotalTimeByDate(date: string): number {
        return this.getHistoryByDate(date)
            .filter(s => s.type === 'work')
            .reduce((total, session) => total + session.duration, 0);
    }

    static getPomodorosByDateRange(startDate: string, endDate: string): number {
        return this.getHistoryByDateRange(startDate, endDate)
            .filter(s => s.type === 'work')
            .length;
    }

    static getTotalTimeByDateRange(startDate: string, endDate: string): number {
        return this.getHistoryByDateRange(startDate, endDate)
            .filter(s => s.type === 'work')
            .reduce((total, session) => total + session.duration, 0);
    }

    static getWeeklyStats(): { date: string; pomodoros: number; time: number }[] {
        const dates: string[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(getDateString(date));
        }

        return dates.map(date => ({
            date,
            pomodoros: this.getPomodorosByDate(date),
            time: this.getTotalTimeByDate(date)
        }));
    }

    static getMonthlyStats(): { date: string; pomodoros: number; time: number }[] {
        const dates: string[] = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(getDateString(date));
        }

        return dates.map(date => ({
            date,
            pomodoros: this.getPomodorosByDate(date),
            time: this.getTotalTimeByDate(date)
        }));
    }

    static clearHistory(): void {
        this.history = [];
        StorageService.saveHistory([]);
    }
}

// Inicializar quando o serviço é carregado
HistoryService.init();
