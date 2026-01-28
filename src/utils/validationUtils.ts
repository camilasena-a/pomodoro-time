/**
 * Utilitários de validação para dados de entrada
 */

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export interface ValidationRules {
    min: number;
    max: number;
    integer?: boolean;
}

/**
 * Valida um valor numérico contra regras específicas
 */
export function validateNumber(
    value: number | string,
    rules: ValidationRules,
    fieldName: string
): ValidationResult {
    // Converter para número
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    // Verificar se é um número válido
    if (isNaN(numValue)) {
        return {
            isValid: false,
            error: `${fieldName} deve ser um número válido`
        };
    }

    // Verificar se é inteiro (se necessário)
    if (rules.integer && !Number.isInteger(numValue)) {
        return {
            isValid: false,
            error: `${fieldName} deve ser um número inteiro`
        };
    }

    // Verificar mínimo
    if (numValue < rules.min) {
        return {
            isValid: false,
            error: `${fieldName} deve ser no mínimo ${rules.min} minuto${rules.min > 1 ? 's' : ''}`
        };
    }

    // Verificar máximo
    if (numValue > rules.max) {
        return {
            isValid: false,
            error: `${fieldName} deve ser no máximo ${rules.max} minuto${rules.max > 1 ? 's' : ''}`
        };
    }

    return { isValid: true };
}

/**
 * Regras de validação para cada campo
 */
export const VALIDATION_RULES = {
    workDuration: {
        min: 1,
        max: 120,
        integer: true,
        fieldName: 'Duração do Trabalho'
    },
    shortBreak: {
        min: 1,
        max: 30,
        integer: true,
        fieldName: 'Pausa Curta'
    },
    longBreak: {
        min: 1,
        max: 60,
        integer: true,
        fieldName: 'Pausa Longa'
    }
} as const;

/**
 * Valida duração de trabalho
 */
export function validateWorkDuration(value: number | string): ValidationResult {
    return validateNumber(value, VALIDATION_RULES.workDuration, VALIDATION_RULES.workDuration.fieldName);
}

/**
 * Valida pausa curta
 */
export function validateShortBreak(value: number | string): ValidationResult {
    return validateNumber(value, VALIDATION_RULES.shortBreak, VALIDATION_RULES.shortBreak.fieldName);
}

/**
 * Valida pausa longa
 */
export function validateLongBreak(value: number | string): ValidationResult {
    return validateNumber(value, VALIDATION_RULES.longBreak, VALIDATION_RULES.longBreak.fieldName);
}

/**
 * Sanitiza um valor numérico, garantindo que está dentro dos limites
 */
export function sanitizeNumber(value: number | string, rules: ValidationRules): number {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
        return rules.min; // Retornar mínimo se inválido
    }

    // Arredondar se precisar ser inteiro
    const finalValue = rules.integer ? Math.round(numValue) : numValue;

    // Garantir que está dentro dos limites
    return Math.max(rules.min, Math.min(rules.max, finalValue));
}

/**
 * Valida objeto de configurações completo
 */
export function validateSettings(settings: any): ValidationResult {
    if (!settings || typeof settings !== 'object') {
        return {
            isValid: false,
            error: 'Configurações inválidas: objeto esperado'
        };
    }

    // Validar workDuration
    if (settings.workDuration !== undefined) {
        const workResult = validateWorkDuration(settings.workDuration);
        if (!workResult.isValid) {
            return workResult;
        }
    }

    // Validar shortBreak
    if (settings.shortBreak !== undefined) {
        const shortResult = validateShortBreak(settings.shortBreak);
        if (!shortResult.isValid) {
            return shortResult;
        }
    }

    // Validar longBreak
    if (settings.longBreak !== undefined) {
        const longResult = validateLongBreak(settings.longBreak);
        if (!longResult.isValid) {
            return longResult;
        }
    }

    // Validar soundEnabled (deve ser boolean se presente)
    if (settings.soundEnabled !== undefined && typeof settings.soundEnabled !== 'boolean') {
        return {
            isValid: false,
            error: 'Notificação sonora deve ser verdadeiro ou falso'
        };
    }

    return { isValid: true };
}

/**
 * Sanitiza objeto de configurações, corrigindo valores inválidos
 */
export function sanitizeSettings(settings: any): any {
    if (!settings || typeof settings !== 'object') {
        return {
            workDuration: 25,
            shortBreak: 5,
            longBreak: 15,
            soundEnabled: true
        };
    }

    const sanitized: any = {};

    if (settings.workDuration !== undefined) {
        sanitized.workDuration = sanitizeNumber(
            settings.workDuration,
            VALIDATION_RULES.workDuration
        );
    }

    if (settings.shortBreak !== undefined) {
        sanitized.shortBreak = sanitizeNumber(
            settings.shortBreak,
            VALIDATION_RULES.shortBreak
        );
    }

    if (settings.longBreak !== undefined) {
        sanitized.longBreak = sanitizeNumber(
            settings.longBreak,
            VALIDATION_RULES.longBreak
        );
    }

    if (settings.soundEnabled !== undefined) {
        sanitized.soundEnabled = Boolean(settings.soundEnabled);
    }

    // Preservar outras propriedades válidas
    if (settings.autoStartBreaks !== undefined) {
        sanitized.autoStartBreaks = Boolean(settings.autoStartBreaks);
    }

    if (settings.autoStartPomodoros !== undefined) {
        sanitized.autoStartPomodoros = Boolean(settings.autoStartPomodoros);
    }

    if (settings.soundVolume !== undefined) {
        const volume = typeof settings.soundVolume === 'number' 
            ? settings.soundVolume 
            : parseFloat(settings.soundVolume);
        sanitized.soundVolume = isNaN(volume) ? 0.3 : Math.max(0, Math.min(1, volume));
    }

    if (settings.soundType !== undefined && typeof settings.soundType === 'string') {
        sanitized.soundType = settings.soundType;
    }

    return sanitized;
}
