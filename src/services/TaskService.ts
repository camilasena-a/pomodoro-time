import { Task } from '../types';
import { StorageService } from './StorageService';

/**
 * Serviço para gerenciar tarefas
 */
export class TaskService {
    private static tasks: Task[] = [];

    static init(): void {
        this.tasks = StorageService.loadTasks();
    }

    static getTasks(): Task[] {
        return [...this.tasks];
    }

    static getActiveTasks(): Task[] {
        return this.tasks.filter(task => !task.completed);
    }

    static getCompletedTasks(): Task[] {
        return this.tasks.filter(task => task.completed);
    }

    static getTaskById(id: string): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    static createTask(title: string, estimatedPomodoros?: number): Task {
        const task: Task = {
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

    static updateTask(id: string, updates: Partial<Task>): Task | null {
        const task = this.getTaskById(id);
        if (!task) return null;

        Object.assign(task, updates);
        this.save();
        return task;
    }

    static deleteTask(id: string): boolean {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index === -1) return false;

        this.tasks.splice(index, 1);
        this.save();
        return true;
    }

    static completeTask(id: string): Task | null {
        const task = this.getTaskById(id);
        if (!task) return null;

        task.completed = true;
        task.completedAt = Date.now();
        this.save();
        return task;
    }

    static addPomodoroToTask(id: string): Task | null {
        const task = this.getTaskById(id);
        if (!task) return null;

        task.pomodorosSpent++;
        this.save();
        return task;
    }

    static getTasksByPomodoros(minPomodoros: number): Task[] {
        return this.tasks.filter(task => task.pomodorosSpent >= minPomodoros);
    }

    private static save(): void {
        StorageService.saveTasks(this.tasks);
    }
}

// Inicializar quando o serviço é carregado
TaskService.init();
