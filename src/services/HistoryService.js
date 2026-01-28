import { StorageService } from './StorageService';
import { getDateString } from '../utils/timeUtils';
/**
 * Serviço para gerenciar histórico de sessões
 */
export class HistoryService {
    static init() {
        this.history = StorageService.loadHistory();
    }
    static addSession(type, duration, taskId) {
        const session = {
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
    static getHistory() {
        return [...this.history];
    }
    static getHistoryByDate(date) {
        return this.history.filter(session => session.date === date);
    }
    static getHistoryByType(type) {
        return this.history.filter(session => session.type === type);
    }
    static getHistoryByDateRange(startDate, endDate) {
        return this.history.filter(session => {
            return session.date >= startDate && session.date <= endDate;
        });
    }
    static getPomodorosByDate(date) {
        return this.getHistoryByDate(date).filter(s => s.type === 'work').length;
    }
    static getTotalTimeByDate(date) {
        return this.getHistoryByDate(date)
            .filter(s => s.type === 'work')
            .reduce((total, session) => total + session.duration, 0);
    }
    static getPomodorosByDateRange(startDate, endDate) {
        return this.getHistoryByDateRange(startDate, endDate)
            .filter(s => s.type === 'work')
            .length;
    }
    static getTotalTimeByDateRange(startDate, endDate) {
        return this.getHistoryByDateRange(startDate, endDate)
            .filter(s => s.type === 'work')
            .reduce((total, session) => total + session.duration, 0);
    }
    static getWeeklyStats() {
        const dates = [];
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
    static getMonthlyStats() {
        const dates = [];
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
    static clearHistory() {
        this.history = [];
        StorageService.saveHistory([]);
    }
}
HistoryService.history = [];
// Inicializar quando o serviço é carregado
HistoryService.init();
//# sourceMappingURL=HistoryService.js.map