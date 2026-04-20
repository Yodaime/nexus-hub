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
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

interface NutriState {
  foods: Food[]; // consumos (is_template = false)
  templates: Food[]; // alimentos cadastrados no catálogo (is_template = true)
  loading: boolean;
  fetchFoods: () => Promise<void>;
  addFood: (food: Omit<Food, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_template'> & { is_template?: boolean }) => Promise<void>;
  logConsumption: (templateId: string, quantity: number, meal: MealType, consumed_at: string) => Promise<void>;
  updateFood: (id: string, updates: Partial<Food>) => Promise<void>;
  deleteFood: (id: string) => Promise<void>;
}

export const useNutriStore = create<NutriState>((set, get) => ({
  foods: [],
  templates: [],
  loading: false,

  fetchFoods: async () => {
    set({ loading: true });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ foods: [], templates: [], loading: false });
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
    const all = (data as any[]) || [];
    set({
      foods: all.filter((f) => !f.is_template) as Food[],
      templates: all.filter((f) => f.is_template) as Food[],
      loading: false,
    });
  },

  addFood: async (food) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');
    const payload = { ...food, user_id: user.id, is_template: food.is_template ?? true };
    const { data, error } = await supabase
      .from('foods')
      .insert(payload as any)
      .select()
      .single();
    if (error) throw error;
    const inserted = data as Food;
    set((state) => inserted.is_template
      ? { templates: [inserted, ...state.templates] }
      : { foods: [inserted, ...state.foods] }
    );
  },

  logConsumption: async (templateId, quantity, meal, consumed_at) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');
    const tpl = get().templates.find((t) => t.id === templateId);
    if (!tpl) throw new Error('Alimento não encontrado no catálogo');
    const payload = {
      user_id: user.id,
      name: tpl.name,
      category: tpl.category,
      calories: tpl.calories,
      protein: tpl.protein,
      carbs: tpl.carbs,
      fat: tpl.fat,
      unit: tpl.unit,
      quantity,
      meal,
      consumed_at,
      notes: tpl.notes ?? null,
      is_template: false,
    };
    const { data, error } = await supabase
      .from('foods')
      .insert(payload as any)
      .select()
      .single();
    if (error) throw error;
    set((state) => ({ foods: [data as Food, ...state.foods] }));
  },

  updateFood: async (id, updates) => {
    const { data, error } = await supabase
      .from('foods')
      .update({ ...updates, updated_at: new Date().toISOString() } as any)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    const updated = data as Food;
    set((state) => ({
      foods: state.foods.map((f) => (f.id === id ? updated : f)),
      templates: state.templates.map((f) => (f.id === id ? updated : f)),
    }));
  },

  deleteFood: async (id) => {
    const { error } = await supabase.from('foods').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({
      foods: state.foods.filter((f) => f.id !== id),
      templates: state.templates.filter((f) => f.id !== id),
    }));
  },
}));
