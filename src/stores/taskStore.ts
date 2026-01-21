import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskPriority, TaskStatus } from '@/types';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  getOverdueTasks: () => Task[];
  getUpcomingTasks: (days: number) => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [
        {
          id: uuidv4(),
          title: 'Completar design do dashboard',
          description: 'Finalizar o layout futurista com glassmorphism',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
          status: 'in-progress',
          tags: ['design', 'ui'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Implementar gráficos financeiros',
          description: 'Adicionar gráficos de pizza e linha para visualização',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'medium',
          status: 'pending',
          tags: ['frontend', 'charts'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Revisar código do módulo de tarefas',
          description: 'Code review e otimizações de performance',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
          status: 'pending',
          tags: ['review'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Configurar notificações push',
          description: 'Implementar sistema de lembretes',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'low',
          status: 'pending',
          tags: ['backend', 'notifications'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Testes unitários',
          description: 'Escrever testes para componentes principais',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'medium',
          status: 'completed',
          tags: ['testing'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],

      addTask: (taskData) => {
        const now = new Date().toISOString();
        const newTask: Task = {
          ...taskData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      getTasksByStatus: (status) => {
        return get().tasks.filter((task) => task.status === status);
      },

      getTasksByPriority: (priority) => {
        return get().tasks.filter((task) => task.priority === priority);
      },

      getOverdueTasks: () => {
        const now = new Date();
        return get().tasks.filter(
          (task) =>
            new Date(task.dueDate) < now && task.status !== 'completed'
        );
      },

      getUpcomingTasks: (days) => {
        const now = new Date();
        const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        return get().tasks.filter(
          (task) =>
            new Date(task.dueDate) >= now &&
            new Date(task.dueDate) <= futureDate &&
            task.status !== 'completed'
        );
      },
    }),
    {
      name: 'task-storage',
    }
  )
);
