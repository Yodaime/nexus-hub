import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type SleepRange = '4-6' | '6-8' | '8-10';
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  sleep: SleepRange;
  mood: MoodLevel;
  note?: string;
  createdAt: string;
}

interface MoodStore {
  entries: MoodEntry[];
  addEntry: (entry: Omit<MoodEntry, 'id' | 'createdAt'>) => void;
  deleteEntry: (id: string) => void;
}

export const useMoodStore = create<MoodStore>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (data) =>
        set((state) => ({
          entries: [
            { ...data, id: uuidv4(), createdAt: new Date().toISOString() },
            ...state.entries,
          ],
        })),
      deleteEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
    }),
    { name: 'mood-storage' }
  )
);
