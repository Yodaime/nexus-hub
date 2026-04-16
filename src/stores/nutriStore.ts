import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export type FoodCategory = 'fruta' | 'legume' | 'bebida' | 'proteina' | 'carboidrato' | 'outro';
export type MealType = 'café' | 'lanche-manhã' | 'almoço' | 'lanche-tarde' | 'jantar' | 'ceia';

export interface Food {
  id: string;
  user_id: string;
  name: string;
  category: FoodCategory;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
  meal: MealType;
  consumed_at: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

interface NutriState {
  foods: Food[];
  loading: boolean;
  fetchFoods: () => Promise<void>;
  addFood: (food: Omit<Food, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateFood: (id: string, updates: Partial<Food>) => Promise<void>;
  deleteFood: (id: string) => Promise<void>;
}

export const useNutriStore = create<NutriState>((set, get) => ({
  foods: [],
  loading: false,

  fetchFoods: async () => {
    set({ loading: true });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ foods: [], loading: false });
      return;
    }
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('consumed_at', { ascending: false });
    if (error) {
      console.error('Erro ao buscar alimentos:', error);
      set({ loading: false });
      return;
    }
    set({ foods: (data as Food[]) || [], loading: false });
  },

  addFood: async (food) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');
    const { data, error } = await supabase
      .from('foods')
      .insert({ ...food, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    set((state) => ({ foods: [data as Food, ...state.foods] }));
  },

  updateFood: async (id, updates) => {
    const { data, error } = await supabase
      .from('foods')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    set((state) => ({
      foods: state.foods.map((f) => (f.id === id ? (data as Food) : f)),
    }));
  },

  deleteFood: async (id) => {
    const { error } = await supabase.from('foods').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({ foods: state.foods.filter((f) => f.id !== id) }));
  },
}));
