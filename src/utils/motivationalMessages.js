/**
 * Mensagens motivacionais para exibir após completar pomodoros
 */
export const MOTIVATIONAL_MESSAGES = {
    pomodoroComplete: [
        'Excelente trabalho! 🎉',
        'Mais um pomodoro conquistado! 💪',
        'Você está no caminho certo! ⭐',
        'Foco incrível! 🔥',
        'Parabéns pelo progresso! 🎊',
        'Continue assim! 💯',
        'Produtividade em alta! 📈',
        'Você é incrível! 🌟'
    ],
    breakComplete: [
        'Pausa concluída! Hora de focar novamente! 💪',
        'Recarregado e pronto! 🚀',
        'Vamos continuar! ⚡',
        'Energia renovada! 🔋',
        'Pronto para mais produtividade! 📊'
    ],
    goalReached: [
        '🎉 Meta diária alcançada! Você é demais!',
        '🏆 Parabéns! Você bateu sua meta!',
        '💯 Excelência alcançada!',
        '⭐ Você superou suas expectativas!',
        '🔥 Incrível! Meta conquistada!'
    ],
    streakMilestone: [
        '🔥 Streak incrível! Continue assim!',
        '📅 Dias consecutivos de produtividade!',
        '💪 Consistência é a chave!',
        '⭐ Você está construindo um hábito poderoso!',
        '🏆 Streak em andamento!'
    ],
    achievementUnlocked: [
        '🏆 Conquista desbloqueada!',
        '⭐ Nova conquista alcançada!',
        '🎉 Parabéns pela conquista!',
        '💯 Você é incrível!',
        '🔥 Mais uma conquista no bolso!'
    ]
};
export function getRandomMessage(category) {
    const messages = MOTIVATIONAL_MESSAGES[category];
    return messages[Math.floor(Math.random() * messages.length)];
}
//# sourceMappingURL=motivationalMessages.js.map