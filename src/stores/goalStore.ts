import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Goal, GoalFrequency, GoalStatus } from '@/types';

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  getGoalsByFrequency: (frequency: GoalFrequency) => Goal[];
  getGoalsByStatus: (status: GoalStatus) => Goal[];
  moveGoal: (id: string, newStatus: GoalStatus) => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [
        {
          id: uuidv4(),
          title: 'Exercitar-se',
          description: 'Fazer 30 minutos de exercício',
          frequency: 'daily',
          status: 'in-progress',
          dueDate: new Date().toISOString(),
          progress: 50,
          category: 'Saúde',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Ler um capítulo',
          description: 'Ler um capítulo do livro',
          frequency: 'daily',
          status: 'not-started',
          dueDate: new Date().toISOString(),
          progress: 0,
          category: 'Aprendizado',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Revisar código',
          description: 'Revisar código da semana',
          frequency: 'weekly',
          status: 'completed',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          progress: 100,
          category: 'Trabalho',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],

      addGoal: (goal) =>
        set((state) => ({
          goals: [
            {
              id: uuidv4(),
              ...goal,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.goals,
          ],
        })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
              : goal
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),

      getGoalsByFrequency: (frequency) => {
        return get().goals.filter((goal) => goal.frequency === frequency);
      },

      getGoalsByStatus: (status) => {
        return get().goals.filter((goal) => goal.status === status);
      },

      moveGoal: (id, newStatus) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, status: newStatus } : goal
          ),
        }));
      },
    }),
    {
      name: 'goal-store',
    }
  )
);
