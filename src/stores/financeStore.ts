import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, Category, TransactionType } from '@/types';

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTransactionsByDateRange: (start: Date, end: Date) => Transaction[];
  getTotalByType: (type: TransactionType) => number;
  getBalance: () => number;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Alimentação', icon: 'Utensils', color: '#ff6b6b', type: 'expense' },
  { id: '2', name: 'Transporte', icon: 'Car', color: '#4ecdc4', type: 'expense' },
  { id: '3', name: 'Lazer', icon: 'Gamepad2', color: '#9d4edd', type: 'expense' },
  { id: '4', name: 'Saúde', icon: 'Heart', color: '#f472b6', type: 'expense' },
  { id: '5', name: 'Educação', icon: 'GraduationCap', color: '#00d4ff', type: 'expense' },
  { id: '6', name: 'Moradia', icon: 'Home', color: '#fbbf24', type: 'expense' },
  { id: '7', name: 'Salário', icon: 'Wallet', color: '#22c55e', type: 'income' },
  { id: '8', name: 'Freelance', icon: 'Laptop', color: '#06b6d4', type: 'income' },
  { id: '9', name: 'Investimentos', icon: 'TrendingUp', color: '#8b5cf6', type: 'income' },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [
        {
          id: uuidv4(),
          amount: 5000,
          categoryId: '7',
          date: new Date().toISOString(),
          description: 'Salário mensal',
          type: 'income',
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          amount: 1200,
          categoryId: '6',
          date: new Date().toISOString(),
          description: 'Aluguel',
          type: 'expense',
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          amount: 450,
          categoryId: '1',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Supermercado',
          type: 'expense',
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          amount: 150,
          categoryId: '2',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Combustível',
          type: 'expense',
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          amount: 800,
          categoryId: '8',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Projeto freelance',
          type: 'income',
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          amount: 200,
          categoryId: '3',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Cinema e jantar',
          type: 'expense',
          createdAt: new Date().toISOString(),
        },
      ],
      categories: defaultCategories,

      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: uuidv4(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      getTransactionsByType: (type) => {
        return get().transactions.filter((t) => t.type === type);
      },

      getTransactionsByCategory: (categoryId) => {
        return get().transactions.filter((t) => t.categoryId === categoryId);
      },

      getTransactionsByDateRange: (start, end) => {
        return get().transactions.filter((t) => {
          const date = new Date(t.date);
          return date >= start && date <= end;
        });
      },

      getTotalByType: (type) => {
        return get()
          .transactions.filter((t) => t.type === type)
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getBalance: () => {
        const income = get().getTotalByType('income');
        const expense = get().getTotalByType('expense');
        return income - expense;
      },
    }),
    {
      name: 'finance-storage',
    }
  )
);
