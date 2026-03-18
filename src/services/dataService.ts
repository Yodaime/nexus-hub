import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: string;
  due_date?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date?: string;
  progress: number;
  status: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface Finance {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  type: string;
  category?: string;
  date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  frequency: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  reminder_date: string;
  category?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Saving {
  id: string;
  user_id: string;
  name: string;
  goal_amount: number;
  current_amount: number;
  target_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Tasks
export const tasksService = {
  async fetchTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Task[];
  },

  async createTask(task: Omit<Task, "id" | "created_at" | "updated_at">) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
      .from("tasks")
      .insert({ ...task, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  },
};

// Goals
export const goalsService = {
  async fetchGoals() {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Goal[];
  },

  async createGoal(goal: Omit<Goal, "id" | "created_at" | "updated_at">) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
      .from("goals")
      .insert({ ...goal, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data as Goal;
  },

  async updateGoal(id: string, updates: Partial<Goal>) {
    const { data, error } = await supabase
      .from("goals")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Goal;
  },

  async deleteGoal(id: string) {
    const { error } = await supabase.from("goals").delete().eq("id", id);
    if (error) throw error;
  },
};

// Finances
export const financesService = {
  async fetchFinances() {
    const { data, error } = await supabase
      .from("finances")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return data as Finance[];
  },

  async createFinance(
    finance: Omit<Finance, "id" | "created_at" | "updated_at">
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
      .from("finances")
      .insert({ ...finance, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data as Finance;
  },

  async updateFinance(id: string, updates: Partial<Finance>) {
    const { data, error } = await supabase
      .from("finances")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Finance;
  },

  async deleteFinance(id: string) {
    const { error } = await supabase.from("finances").delete().eq("id", id);
    if (error) throw error;
  },
};

// Habits
export const habitsService = {
  async fetchHabits() {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Habit[];
  },

  async createHabit(habit: Omit<Habit, "id" | "created_at" | "updated_at">) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
      .from("habits")
      .insert({ ...habit, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data as Habit;
  },

  async updateHabit(id: string, updates: Partial<Habit>) {
    const { data, error } = await supabase
      .from("habits")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Habit;
  },

  async deleteHabit(id: string) {
    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (error) throw error;
  },
};

// Reminders
export const remindersService = {
  async fetchReminders() {
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .order("reminder_date", { ascending: true });

    if (error) throw error;
    return data as Reminder[];
  },

  async createReminder(
    reminder: Omit<Reminder, "id" | "created_at" | "updated_at">
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
      .from("reminders")
      .insert({ ...reminder, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data as Reminder;
  },

  async updateReminder(id: string, updates: Partial<Reminder>) {
    const { data, error } = await supabase
      .from("reminders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Reminder;
  },

  async deleteReminder(id: string) {
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (error) throw error;
  },
};

// Savings
export const savingsService = {
  async fetchSavings() {
    const { data, error } = await supabase
      .from("savings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Saving[];
  },

  async createSaving(saving: Omit<Saving, "id" | "created_at" | "updated_at">) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
      .from("savings")
      .insert({ ...saving, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data as Saving;
  },

  async updateSaving(id: string, updates: Partial<Saving>) {
    const { data, error } = await supabase
      .from("savings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Saving;
  },

  async deleteSaving(id: string) {
    const { error } = await supabase.from("savings").delete().eq("id", id);
    if (error) throw error;
  },
};
