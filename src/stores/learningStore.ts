import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LearningBlock {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface LearningStore {
  blocks: LearningBlock[];
  addBlock: (block: Omit<LearningBlock, 'id' | 'createdAt'>) => void;
  updateBlock: (id: string, updates: Partial<LearningBlock>) => void;
  deleteBlock: (id: string) => void;
}

export const useLearningStore = create<LearningStore>()(
  persist(
    (set) => ({
      blocks: [],

      addBlock: (block) =>
        set((state) => ({
          blocks: [
            ...state.blocks,
            {
              ...block,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateBlock: (id, updates) =>
        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === id ? { ...block, ...updates } : block
          ),
        })),

      deleteBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((block) => block.id !== id),
        })),
    }),
    {
      name: 'learning-store',
      version: 1,
    }
  )
);
