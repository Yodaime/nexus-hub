import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { SavingsBox, SavingsDeposit } from '@/types';

interface SavingsState {
  boxes: SavingsBox[];
  addBox: (box: Omit<SavingsBox, 'id' | 'createdAt' | 'deposits' | 'currentAmount'>) => void;
  updateBox: (id: string, updates: Partial<SavingsBox>) => void;
  deleteBox: (id: string) => void;
  addDeposit: (boxId: string, amount: number, note?: string) => void;
  removeDeposit: (boxId: string, depositId: string) => void;
}

export const useSavingsStore = create<SavingsState>()(
  persist(
    (set) => ({
      boxes: [],

      addBox: (boxData) => {
        const newBox: SavingsBox = {
          ...boxData,
          id: uuidv4(),
          currentAmount: 0,
          deposits: [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ boxes: [...state.boxes, newBox] }));
      },

      updateBox: (id, updates) => {
        set((state) => ({
          boxes: state.boxes.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        }));
      },

      deleteBox: (id) => {
        set((state) => ({ boxes: state.boxes.filter((b) => b.id !== id) }));
      },

      addDeposit: (boxId, amount, note) => {
        const deposit: SavingsDeposit = {
          id: uuidv4(),
          amount,
          date: new Date().toISOString(),
          note,
        };
        set((state) => ({
          boxes: state.boxes.map((b) =>
            b.id === boxId
              ? { ...b, currentAmount: b.currentAmount + amount, deposits: [...b.deposits, deposit] }
              : b
          ),
        }));
      },

      removeDeposit: (boxId, depositId) => {
        set((state) => ({
          boxes: state.boxes.map((b) => {
            if (b.id !== boxId) return b;
            const deposit = b.deposits.find((d) => d.id === depositId);
            if (!deposit) return b;
            return {
              ...b,
              currentAmount: b.currentAmount - deposit.amount,
              deposits: b.deposits.filter((d) => d.id !== depositId),
            };
          }),
        }));
      },
    }),
    { name: 'savings-storage' }
  )
);
