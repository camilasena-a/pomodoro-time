/**
 * Utilitários para manipulação de tempo
 */

/**
 * Formata segundos em formato MM:SS
 */
export function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Formata minutos em formato legível (Xh Ymin ou Ymin)
 */
export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
}

/**
 * Converte minutos para segundos
 */
export function minutesToSeconds(minutes: number): number {
    return minutes * 60;
}

/**
 * Converte segundos para minutos
 */
export function secondsToMinutes(seconds: number): number {
    return Math.floor(seconds / 60);
}

/**
 * Obtém data no formato YYYY-MM-DD
 */
export function getDateString(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
}

/**
 * Obtém timestamp do início do dia
 */
export function getStartOfDay(date: Date = new Date()): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

/**
 * Obtém timestamp do fim do dia
 */
export function getEndOfDay(date: Date = new Date()): number {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d.getTime();
}

/**
 * Verifica se duas datas são do mesmo dia
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return getDateString(date1) === getDateString(date2);
}

/**
 * Obtém dias entre duas datas
 */
export function getDaysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}
