/**
 * Utilitários para manipulação de datas
 */
/**
 * Obtém array de datas dos últimos N dias
 */
export function getLastNDays(n) {
    const dates = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}
/**
 * Obtém array de datas da semana atual
 */
export function getCurrentWeekDates() {
    const dates = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}
/**
 * Formata data para exibição (DD/MM)
 */
export function formatDateShort(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
}
/**
 * Formata data para exibição completa (DD/MM/YYYY)
 */
export function formatDateFull(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
/**
 * Obtém nome do dia da semana
 */
export function getDayName(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
}
//# sourceMappingURL=dateUtils.js.map