/**
 * Componente para criar gráficos usando Chart.js
 */
export class ChartComponent {
    constructor(canvasId) {
        this.chart = null;
        this.canvas = null;
        this.canvas = document.getElementById(canvasId);
    }
    createWeeklyChart(data) {
        if (!this.canvas || typeof Chart === 'undefined')
            return;
        const ctx = this.canvas.getContext('2d');
        if (!ctx)
            return;
        // Destruir gráfico anterior se existir
        if (this.chart) {
            this.chart.destroy();
        }
        const labels = data.map(d => {
            const date = new Date(d.date + 'T00:00:00');
            const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            return days[date.getDay()];
        });
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Pomodoros',
                        data: data.map(d => d.pomodoros),
                        borderColor: 'rgb(231, 76, 60)',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Pomodoros por Dia (Últimos 7 dias)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    createMonthlyChart(data) {
        if (!this.canvas || typeof Chart === 'undefined')
            return;
        const ctx = this.canvas.getContext('2d');
        if (!ctx)
            return;
        if (this.chart) {
            this.chart.destroy();
        }
        // Agrupar por semana
        const weeklyData = [];
        for (let i = 0; i < data.length; i += 7) {
            const weekData = data.slice(i, i + 7);
            const weekStart = weekData[0]?.date || '';
            const totalPomodoros = weekData.reduce((sum, d) => sum + d.pomodoros, 0);
            weeklyData.push({
                week: `Semana ${Math.floor(i / 7) + 1}`,
                pomodoros: totalPomodoros
            });
        }
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: weeklyData.map(d => d.week),
                datasets: [
                    {
                        label: 'Pomodoros',
                        data: weeklyData.map(d => d.pomodoros),
                        backgroundColor: 'rgba(231, 76, 60, 0.8)',
                        borderColor: 'rgb(231, 76, 60)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Pomodoros por Semana (Últimos 30 dias)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}
//# sourceMappingURL=ChartComponent.js.map