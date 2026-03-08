import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const dayLabels: Record<DayOfWeek, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export const allDays: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export interface Habit {
  id: string;
  title: string;
  days: DayOfWeek[];
  createdAt: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
}

interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  addHabit: (title: string, days: DayOfWeek[]) => void;
  removeHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  isCompleted: (habitId: string, date: string) => boolean;
  getHabitsForDay: (day: DayOfWeek) => Habit[];
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [
        { id: '1', title: 'Tomar água ao acordar', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], createdAt: new Date().toISOString() },
        { id: '2', title: 'Fazer 20 min exercícios', days: ['monday', 'wednesday', 'friday'], createdAt: new Date().toISOString() },
        { id: '3', title: 'Ler 30 minutos', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], createdAt: new Date().toISOString() },
        { id: '4', title: 'Meditar 10 minutos', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], createdAt: new Date().toISOString() },
      ],
      completions: [],

      addHabit: (title, days) => {
        set((state) => ({
          habits: [...state.habits, { id: uuidv4(), title, days, createdAt: new Date().toISOString() }],
        }));
      },

      removeHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          completions: state.completions.filter((c) => c.habitId !== id),
        }));
      },

      toggleCompletion: (habitId, date) => {
        set((state) => {
          const exists = state.completions.find((c) => c.habitId === habitId && c.date === date);
          if (exists) {
            return { completions: state.completions.filter((c) => !(c.habitId === habitId && c.date === date)) };
          }
          return { completions: [...state.completions, { habitId, date }] };
        });
      },

      isCompleted: (habitId, date) => {
        return get().completions.some((c) => c.habitId === habitId && c.date === date);
      },

      getHabitsForDay: (day) => {
        return get().habits.filter((h) => h.days.includes(day));
      },
    }),
    { name: 'habit-storage' }
  )
);
