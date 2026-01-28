import { StorageService } from './StorageService';
/**
 * Serviço para gerenciar tarefas
 */
export class TaskService {
    static init() {
        this.tasks = StorageService.loadTasks();
    }
    static getTasks() {
        return [...this.tasks];
    }
    static getActiveTasks() {
        return this.tasks.filter(task => !task.completed);
    }
    static getCompletedTasks() {
        return this.tasks.filter(task => task.completed);
    }
    static getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }
    static createTask(title, estimatedPomodoros) {
        const task = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title,
            completed: false,
            pomodorosSpent: 0,
            createdAt: Date.now(),
            estimatedPomodoros
        };
        this.tasks.push(task);
        this.save();
        return task;
    }
    static updateTask(id, updates) {
        const task = this.getTaskById(id);
        if (!task)
            return null;
        Object.assign(task, updates);
        this.save();
        return task;
    }
    static deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index === -1)
            return false;
        this.tasks.splice(index, 1);
        this.save();
        return true;
    }
    static completeTask(id) {
        const task = this.getTaskById(id);
        if (!task)
            return null;
        task.completed = true;
        task.completedAt = Date.now();
        this.save();
        return task;
    }
    static addPomodoroToTask(id) {
        const task = this.getTaskById(id);
        if (!task)
            return null;
        task.pomodorosSpent++;
        this.save();
        return task;
    }
    static getTasksByPomodoros(minPomodoros) {
        return this.tasks.filter(task => task.pomodorosSpent >= minPomodoros);
    }
    static save() {
        StorageService.saveTasks(this.tasks);
    }
}
TaskService.tasks = [];
// Inicializar quando o serviço é carregado
TaskService.init();
//# sourceMappingURL=TaskService.js.map