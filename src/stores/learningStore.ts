import { create } from 'zustand';

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

export const useLearningStore = create<LearningStore>((set) => ({
  blocks: [
    {
      id: '1',
      title: 'Exemplo de Aprendizado',
      description: 'Este é um exemplo de bloco de aprendizado. Você pode adicionar anotações sobre o que está aprendendo.',
      createdAt: new Date().toISOString(),
    },
  ],

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
}));
