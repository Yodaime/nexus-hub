# ⚡ Cheat Sheet - Supabase Nexus Hub

Referência rápida de comandos e recursos.

---

## 🖥️ Comandos Terminal

```bash
# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build

# Testar
npm test

# Linting
npm run lint

# Validar setup (se está no Linux/Mac)
chmod +x validate-setup.sh
./validate-setup.sh
```

---

## 🔐 Autenticação - Imports

```typescript
// ✅ Usar AUTH
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/use-auth';

// ✅ Usar DADOS
import { tasksService } from '@/services/dataService';
// + goalsService, financesService, habitsService, 
//   remindersService, savingsService
```

---

## 🔐 Autenticação - Funções

```typescript
// Registrar
await authService.signup(email, password, fullName);

// Login
await authService.login(email, password);

// Logout
await authService.logout();

// Usuário atual
const user = await authService.getCurrentUser();

// Recuperar senha
await authService.resetPassword(email);

// Observar mudanças
authService.onAuthStateChange((user) => {
  console.log('Usuário:', user);
});
```

---

## 🎣 Hook de Autenticação

```typescript
// No seu componente
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Não autenticado</div>;
  
  return <div>Olá, {user.email}</div>;
}
```

---

## 📊 CRUD - Tasks

```typescript
import { tasksService } from '@/services/dataService';

// Buscar todas
const tasks = await tasksService.fetchTasks();

// Criar
const newTask = await tasksService.createTask({
  title: 'Nova tarefa',
  description: 'Descrição',
  completed: false,
  priority: 'high',
  due_date: new Date().toISOString(),
  user_id: '',
  created_at: '',
  updated_at: ''
});

// Atualizar
await tasksService.updateTask(taskId, {
  completed: true,
  title: 'Atualizado'
});

// Deletar
await tasksService.deleteTask(taskId);
```

---

## 📊 CRUD - Goals

```typescript
import { goalsService } from '@/services/dataService';

await goalsService.fetchGoals();
await goalsService.createGoal({ /* ... */ });
await goalsService.updateGoal(id, { /* ... */ });
await goalsService.deleteGoal(id);
```

---

## 💰 CRUD - Finances

```typescript
import { financesService } from '@/services/dataService';

await financesService.fetchFinances();
await financesService.createFinance({ /* ... */ });
await financesService.updateFinance(id, { /* ... */ });
await financesService.deleteFinance(id);
```

---

## 🔄 CRUD - Outros

```typescript
import { 
  habitsService,
  remindersService,
  savingsService 
} from '@/services/dataService';

// Similar para todos
await habitsService.fetchHabits();
await habitsService.createHabit({ /* ... */ });

await remindersService.fetchReminders();
await remindersService.createReminder({ /* ... */ });

await savingsService.fetchSavings();
await savingsService.createSaving({ /* ... */ });
```

---

## 🛡️ Proteção de Rotas

```typescript
// No App.tsx, envolva rotas que precisam auth:
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route
  path="/"
  element={
    <ProtectedRoute>
      <TasksPage />
    </ProtectedRoute>
  }
/>

// Não autenticado? Redirecionado para /login automaticamente
```

---

## 🔐 Supabase Cliente

```typescript
import { supabase } from '@/integrations/supabase/client';

// Query direta (avançado)
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId);

// Listener em tempo real
supabase
  .from('tasks')
  .on('*', (payload) => {
    console.log('Mudança:', payload);
  })
  .subscribe();
```

---

## 📁 Estrutura de Pastas

```
src/
├── services/
│   ├── authService.ts        (Autenticação)
│   └── dataService.ts        (Dados)
├── pages/
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── components/
│   ├── ProtectedRoute.tsx
│   └── layout/
│       └── AppSidebar.tsx
├── hooks/
│   └── use-auth.ts
└── integrations/
    └── supabase/
        ├── client.ts         (Cliente)
        └── types.ts          (Tipos)
```

---

## 📚 Documentação Rápida

| O que | Arquivo |
|------|---------|
| Comece aqui | START_HERE.md |
| Resumo | SUPABASE_SUMMARY.md |
| Passo a passo | STEP_BY_STEP.md |
| Completo | SUPABASE_SETUP.md |
| Testes | QUICK_TEST.md |
| Integrar | STORE_INTEGRATION.md |
| Técnico | IMPLEMENTATION_SUMMARY.md |
| Credenciais | CREDENTIALS.md |

---

## 🌐 URLs Importantes

```
App Local:    http://localhost:5173
Supabase:     https://console.supabase.com
Docs:         https://supabase.com/docs
Status:       https://status.supabase.com
```

---

## 🚨 Status HTTP Errors Comuns

```
400 Bad Request    → Verifique dados enviados
401 Unauthorized   → Faca login
403 Forbidden      → RLS policy violation
404 Not Found      → Tabela/coluna não existe
500 Server Error   → Erro no Supabase
```

---

## 🐛 Debug

```bash
# Ver logs no navegador
# F12 → Console

# No código
console.log('Debug:', data);

# Verificar estado de auth
import { supabase } from '@/integrations/supabase/client';
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);
```

---

## 🔑 Variáveis de Ambiente

```env
# .env.local (nunca commitar!)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=seu-chave-publica
```

---

## ✅ Checklist Rápido

- [ ] SQL executado no Supabase
- [ ] App roda sem erros (`npm run dev`)
- [ ] Login funciona
- [ ] Criar dados funciona
- [ ] Dados aparecem no Supabase
- [ ] Logout funciona
- [ ] Redirecionamento para login OK

---

## 💡 Tips & Tricks

```typescript
// Mostrar erro bonito
import { toast } from 'sonner';
toast.error('Erro ao criar tarefa');
toast.success('Tarefa criada!');

// Componente loading
const { loading } = useAuth();
if (loading) return <LoadingSpinner />;

// Aguardar promise
try {
  await tasksService.createTask(data);
} catch (error) {
  console.error(error);
}

// Type safe queries
const { data } = await supabase
  .from('tasks')
  .select('*')
  .returns<Task[]>();
```

---

## 🔄 Fluxo Típico

```
1. User chega no app
   ↓
2. ProtectedRoute verifica auth
   ↓
3. Se não autenticado → /login
   ↓
4. User faz login/registro
   ↓
5. authService autentica
   ↓
6. Se OK → acesso ao app
   ↓
7. User cria dados
   ↓
8. dataService salva em Supabase
   ↓
9. RLS verifica permissões
   ↓
10. Dados salvos ✅
```

---

## 📊 Tipos TypeScript

```typescript
import { 
  Task, Goal, Finance, Habit, 
  Reminder, Saving, AuthUser 
} from '@/services/dataService';

const task: Task = {
  id: '123',
  user_id: 'abc',
  title: 'Exemplo',
  completed: false,
  // ...
};
```

---

## 🎯 Task Store Integration (Preview)

```typescript
// src/stores/taskStore.ts
import { tasksService } from '@/services/dataService';

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  
  fetchTasks: async () => {
    const tasks = await tasksService.fetchTasks();
    set({ tasks });
  },
  
  addTask: async (task) => {
    const newTask = await tasksService.createTask(task);
    set(state => ({ tasks: [...state.tasks, newTask] }));
  },
  
  // ... resto similar
}));
```

---

## 📱 Responsive

Já implementado com Tailwind:
```typescript
// Mobile-first design
className="hidden lg:flex"  // Esconde em mobile
className="lg:relative"     // Relative em desktop
```

---

## 🚀 Deployment

```bash
# Build
npm run build

# Resultado em: dist/

# Deploy em Vercel/Netlify/etc
# (Use variáveis de ambiente no deploy)
```

---

## 🎓 Recursos

- Supabase: https://supabase.com/docs
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/
- Tailwind: https://tailwindcss.com/docs

---

## ⏱️ Tempo de Setup

```
1. SQL:        5 min
2. Test:       5 min
3. Local app:  5 min
4. Validate:   5 min
─────────────────────
Total:        20 min ✅
```

---

**Divirta-se! 🎉**

Mais em: DOCS.md
