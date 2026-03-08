// Task types
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Finance types
export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  description: string;
  type: TransactionType;
  createdAt: string;
}

// Goal types
export type GoalFrequency = 'daily' | 'weekly';
export type GoalStatus = 'not-started' | 'in-progress' | 'completed';

export interface Goal {
  id: string;
  title: string;
  description: string;
  frequency: GoalFrequency;
  status: GoalStatus;
  dueDate: string;
  progress: number; // 0-100
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// App types
export type Module = 'tasks' | 'finances';
