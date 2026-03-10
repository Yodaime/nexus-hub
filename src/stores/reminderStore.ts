import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  completed: boolean;
  createdAt: string;
}

interface ReminderStore {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'completed'>) => void;
  toggleComplete: (id: string) => void;
  deleteReminder: (id: string) => void;
}

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set) => ({
      reminders: [],
      addReminder: (data) =>
        set((state) => ({
          reminders: [
            {
              ...data,
              id: uuidv4(),
              completed: false,
              createdAt: new Date().toISOString(),
            },
            ...state.reminders,
          ],
        })),
      toggleComplete: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, completed: !r.completed } : r
          ),
        })),
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),
    }),
    { name: 'reminders-storage' }
  )
);
