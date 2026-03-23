# ⚠️ AÇÃO IMEDIATA NECESSÁRIA - Banco de Dados

## 🔴 PROBLEMA IDENTIFICADO

O SQL das tabelas **NÃO foi executado** no Supabase. Sem as tabelas, você não consegue fazer login!

```
❌ Sem SQL executado
   → Tabela "users" não existe
   → Erro: "relation \"public.users\" does not exist"
   → Login falha
```

---

## ✅ SOLUçÃO - 3 passos (5 minutos)

### Passo 1️⃣: Abrir Supabase Console

- Abra: https://console.supabase.com
- Login com sua conta
- **Selecione o projeto**: "Nexus Hub" ou o nome do seu projeto

### Passo 2️⃣: Executar o SQL

**Local no Supabase Console:**
```
SQL Editor (menu esquerdo)
    ↓
"Create new query" (botão)
    ↓
[Colar SQL aqui]
    ↓
"Run" ou Ctrl+Enter
```

**Copie TODO este SQL:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extending auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finances table
CREATE TABLE IF NOT EXISTS public.finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habits table
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT DEFAULT 'daily',
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habit logs table
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  reminder_date TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Savings table
CREATE TABLE IF NOT EXISTS public.savings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  target_date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_finances_user_id ON public.finances(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_user_id ON public.savings(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON public.habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON public.habit_logs(user_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for tasks
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for goals
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON public.goals;
CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for finances
DROP POLICY IF EXISTS "Users can view own finances" ON public.finances;
DROP POLICY IF EXISTS "Users can insert own finances" ON public.finances;
DROP POLICY IF EXISTS "Users can update own finances" ON public.finances;
DROP POLICY IF EXISTS "Users can delete own finances" ON public.finances;
CREATE POLICY "Users can view own finances" ON public.finances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own finances" ON public.finances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own finances" ON public.finances FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own finances" ON public.finances FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for habits
DROP POLICY IF EXISTS "Users can view own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can insert own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete own habits" ON public.habits;
CREATE POLICY "Users can view own habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reminders
DROP POLICY IF EXISTS "Users can view own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can insert own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can update own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can delete own reminders" ON public.reminders;
CREATE POLICY "Users can view own reminders" ON public.reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reminders" ON public.reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reminders" ON public.reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reminders" ON public.reminders FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for savings
DROP POLICY IF EXISTS "Users can view own savings" ON public.savings;
DROP POLICY IF EXISTS "Users can insert own savings" ON public.savings;
DROP POLICY IF EXISTS "Users can update own savings" ON public.savings;
DROP POLICY IF EXISTS "Users can delete own savings" ON public.savings;
CREATE POLICY "Users can view own savings" ON public.savings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own savings" ON public.savings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own savings" ON public.savings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own savings" ON public.savings FOR DELETE USING (auth.uid() = user_id);
```

**Você deve ver mensagens como:**
```
✅ Query succeeded
✅ Rows: 0
```

✨ **Pronto! Banco de dados criado!**

### Passo 3️⃣: Verificar Tabelas

No Supabase Console:
```
Database (menu)
    ↓
Tables (submenu)
```

**Você deve ver:**
- ✅ `users`
- ✅ `tasks`
- ✅ `goals`
- ✅ `finances`
- ✅ `habits`
- ✅ `habit_logs`
- ✅ `reminders`
- ✅ `savings`

Se ver todas, perfeito! Agora o login funcionará.

---

## 🧪 Testar o Login

### Agora você pode:

1. **Registrar uma nova conta:**
   - URL: http://localhost:5173
   - Clique em "Registre-se"
   - Email: `teste@teste.com`
   - Senha: `Teste@123456`
   - Nome: `Usuário de Teste`

2. **Fazer Login:**
   - Email: `teste@teste.com`
   - Senha: `Teste@123456`

3. **Verificar os Dados:**
   - Volte para Supabase Console
   - Database → Tables → users → Browse
   - Você deve ver seu usuário cadastrado ✅

---

## 🔑 Credenciais Admin (Opcional)

Se quiser criar um usuário admin já configurado:

1. No Supabase Console: **Authentication** → **Users**
2. Clique em **"Create new user"**
3. Preencha:
   - **Email**: `admin@nexushub.com`
   - **Password**: `Admin@123456`
   - **Auto confirm user**: ✅ Marque
4. Clique em **Create user**

Agora você pode logar com essas credenciais.

---

## ❌ Se Ainda Não Funcionar

### Verificar Console do Navegador (F12)

```javascript
// Abra DevTools (F12) → Console
// Cole e execute este código:

import { supabase } from '@/integrations/supabase/client';

// Testa conexão
(async () => {
  const { data: tables, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);
    
  console.log('Teste de conexão:', { data: tables, error });
})();
```

**Possíveis Erros:**

| Erro | Solução |
|------|---------|
| "relation \"public.users\" does not exist" | ❌ SQL não foi executado. Volte ao Passo 2 |
| "42P01" (relation not found) | ❌ SQL não foi executado |
| "invalid JSON in Authorization header" | ❌ Refresh a página (Ctrl+Shift+R) |
| Funciona! ✅ | SQL foi executado com sucesso! |

---

## 📋 Checklist Final

- [ ] Abri console.supabase.com
- [ ] Abri SQL Editor
- [ ] Copiei TODO o SQL
- [ ] Executei o SQL (Run/Ctrl+Enter)
- [ ] Vi "Query succeeded"
- [ ] Verifiquei 8 tabelas em Database → Tables
- [ ] Recarreguei a página do app (Ctrl+Shift+R)
- [ ] Testei Registrar
- [ ] Testei Fazer Login
- [ ] Vi meu usuário em Supabase → users

✅ **Tudo pronto! Seu login agora funciona!** 🎉

---

## 💡 Dica

Se tiver dúvida de qual SQL copiar, o arquivo completo está em:
```
supabase/migrations/01_create_tables.sql
```
