## 🔄 Integração dos Stores com Supabase

Este documento explica como sincronizar seus Zustand stores existentes com o Supabase.

### 📍 Abordagem Recomendada

Você tem 3 opções:

#### **Opção 1: Usar Supabase como Fonte Única (Recomendado)**
- Remover o `persist` middleware do Zustand
- Carregar dados do Supabase ao iniciar
- Atualizar Supabase whenever dados mudam
- **Vantagem**: Sincronização automática entre dispositivos ✅

#### **Opção 2: Sincronização Bidirecional (Média Complexidade)**
- Manter localStorage + Supabase
- Sincronizar quando há conexão
- Usar dados locais offline
- **Vantagem**: Funciona offline, sincroniza depois ✅

#### **Opção 3: Manter Ambos Separados (Não Recomendado)**
- localStorage continua local
- Supabase para backup/cloud
- **Desvantagem**: Dados desincronizados ❌

---

## 🎯 Exemplo - Integração do Task Store

### Passo 1: Atualizar o Task Store

```typescript
// src/stores/taskStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { tasksService } from '@/services/dataService';
import { toast } from 'sonner';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  
  // Ações
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
  
  // Queries
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  getOverdueTasks: () => Task[];
  getUpcomingTasks: (days: number) => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  // Buscar tarefas do Supabase
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const tasks = await tasksService.fetchTasks();
      set({ tasks });
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      set({ loading: false });
    }
  },

  // Adicionar tarefa
  addTask: async (task) => {
    try {
      const newTask = await tasksService.createTask({
        ...task,
        user_id: '', // será preenchido pelo serviço
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      // Atualizar store local
      set((state) => ({
        tasks: [...state.tasks, newTask],
      }));
      
      toast.success('Tarefa criada com sucesso');
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
    }
  },

  // Atualizar tarefa
  updateTask: async (id, updates) => {
    try {
      const updatedTask = await tasksService.updateTask(id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });
      
      // Atualizar store local
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      }));
      
      toast.success('Tarefa atualizada');
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  },

  // Deletar tarefa
  deleteTask: async (id) => {
    try {
      await tasksService.deleteTask(id);
      
      // Atualizar store local
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
      
      toast.success('Tarefa deletada');
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      toast.error('Erro ao deletar tarefa');
    }
  },

  // Queries (mesmas de antes)
  getTasksByStatus: (status) => {
    return get().tasks.filter((task) => task.status === status);
  },

  getTasksByPriority: (priority) => {
    return get().tasks.filter((task) => task.priority === priority);
  },

  getOverdueTasks: () => {
    return get().tasks.filter(
      (task) =>
        task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
    );
  },

  getUpcomingTasks: (days) => {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return get().tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) >= now &&
        new Date(task.dueDate) <= future &&
        task.status !== 'completed'
    );
  },
}));
```

### Passo 2: Carregar Tarefas ao Iniciar

```typescript
// src/pages/TasksPage.tsx
import { useEffect } from 'react';
import { useTaskStore } from '@/stores/taskStore';

export default function TasksPage() {
  const { tasks, loading, fetchTasks } = useTaskStore();

  // Carregar tarefas quando o componente monta
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
    return <div>Carregando tarefas...</div>;
  }

  return (
    <div>
      {/* Seu conteúdo aqui */}
    </div>
  );
}
```

### Passo 3: Usar as Ações Atualizadas

```typescript
// No seu componente
const { addTask } = useTaskStore();

// Criar tarefa (agora com Supabase)
await addTask({
  title: 'Nova tarefa',
  description: 'Descrição',
  status: 'pending',
  priority: 'high',
  dueDate: new Date().toISOString(),
});
```

---

## 📊 Similar para Outros Stores

Aplique o mesmo padrão para:
- `goalStore.ts` → use `goalsService`
- `financeStore.ts` → use `financesService`
- `habitStore.ts` → use `habitsService`
- `reminderStore.ts` → use `remindersService`
- `savingsStore.ts` → use `savingsService`

---

## 🔄 Sincronização em Tempo Real (Avançado)

Para sincronizar dados em tempo real entre abas:

```typescript
// src/stores/taskStore.ts - Adicione ao final do create:

// Observar mudanças em tempo real
export const subscribeToTaskUpdates = () => {
  return supabase
    .from('tasks')
    .on('*', (payload) => {
      const store = useTaskStore.getState();
      
      if (payload.eventType === 'INSERT') {
        store.tasks.push(payload.new);
      } else if (payload.eventType === 'UPDATE') {
        store.tasks = store.tasks.map((t) =>
          t.id === payload.new.id ? payload.new : t
        );
      } else if (payload.eventType === 'DELETE') {
        store.tasks = store.tasks.filter((t) => t.id !== payload.old.id);
      }
    })
    .subscribe();
};
```

---

## ☑️ Checklist de Integração

- [ ] Atualizar `taskStore.ts`
- [ ] Atualizar `goalStore.ts`
- [ ] Atualizar `financeStore.ts`
- [ ] Atualizar `habitStore.ts`
- [ ] Atualizar `reminderStore.ts`
- [ ] Atualizar `savingsStore.ts`
- [ ] Adicionar `fetchXxx()` aos componentes de página
- [ ] Remover `persist` middleware dos stores (opcional)
- [ ] Testar sincronização de dados

---

## 💡 Notas Importantes

1. **Tipos Podem Diferir**: Se seus tipos locais diferem do Supabase, ajuste conforme necessário
2. **Timestamps**: Use ISO strings para datas (Supabase padrão)
3. **IDs**: O Supabase gera UUIDs automaticamente, você não precisa gerar
4. **Performance**: Considere paginação para muitos dados
5. **Offline**: Para funcionar offline, mantenha o `persist` middleware

---

## 🎉 Resultado Final

Após esses passos:
- ✅ Dados sincronizados com Supabase
- ✅ Funcionam offline (se mantiver persist)
- ✅ Sincronizam quando reconectam
- ✅ Trabalham em múltiplos dispositivos
- ✅ Dados seguros com RLS

Pronto para começar a integração! 🚀
