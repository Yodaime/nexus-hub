# Configuração Completa do Supabase - Nexus Hub

## ✅ Passos Concluídos

1. **Arquivo .env.local** - Criado com suas credenciais
2. **Schema do Banco de Dados** - Migrações SQL preparadas
3. **Serviços de Autenticação e Dados** - Implementados
4. **Páginas de Login e Registro** - Criadas
5. **Proteção de Rotas** - Configurada com ProtectedRoute
6. **Botão de Logout** - Adicionado ao sidebar

---

## 📋 Próximos Passos

### 1. **Executar o Script SQL no Supabase**

- Acesse [console.supabase.com](https://console.supabase.com)
- Abra seu projeto "Nexus Hub"
- Vá para **SQL Editor** (ou **SQL** no menu)
- Crie uma nova query
- Copie todo o conteúdo do arquivo: `supabase/migrations/01_create_tables.sql`
- Cole no editor e execute (clique em **Run** ou **Ctrl+Enter**)

✨ **Isso vai criar:**
- Tabela de Usuários
- Tabelas para Tarefas, Metas, Finanças, Hábitos, Lembretes e Economias
- Políticas de Segurança (Row Level Security - RLS)
- Índices para melhor performance

### 2. **Verificar no Supabase**

Após executar o SQL:
- Vá para **Database** → **Tables**
- Você deve ver todas as novas tabelas criadas
- Verifique que a segurança está ativa em cada tabela

### 3. **Configurar Autenticação no Supabase (Opcional)**

Se desejar customizar a autenticação:
- Vá para **Authentication** → **Providers**
- Email/Password já está ativado por padrão
- Você pode ativar OAuth (Google, GitHub, etc.) se quiser

### 4. **Testar a Aplicação**

```bash
# No terminal, da raiz do projeto:
npm run dev
# ou se usar bun:
bun run dev
```

- A aplicação abrirá em `http://localhost:5173`
- Você será redirecionado para `/login`
- Clique em "Registre-se" para criar uma conta
- Após registrar, você pode fazer login

### 5. **Verificar os Dados**

Após criar tarefas/metas/etc:
- No Supabase, vá para **Database** → **Tables** → **tasks** (por exemplo)
- Clique em **Browse** para ver os dados salvos
- Seus dados estarão sincronizados! ✅

---

## 🔒 Segurança

Todas as tabelas têm **Row Level Security (RLS)** ativado:
- Cada usuário só pode ver/editar seus próprios dados
- As senhas são gerenciadas de forma segura pelo Supabase Auth
- Não há credenciais sensíveis no frontend

---

## 📦 Dependências Necessárias

Seu projeto já tem as dependências necessárias ou elas serão instaladas automaticamente:
- `@supabase/supabase-js` - Cliente Supabase
- `react-router-dom` - Roteamento
- `sonner` - Notificações

---

## 🔄 Sincronização de Dados

Todos os dados são sincronizados automaticamente:
- **Tarefas** - `tasksService.createTask()`, `updateTask()`, `deleteTask()`
- **Metas** - `goalsService.createGoal()`, `updateGoal()`, `deleteGoal()`
- **Finanças** - `financesService.createFinance()`, `updateFinance()`, `deleteFinance()`
- **Hábitos** - `habitsService.createHabit()`, `updateHabit()`, `deleteHabit()`
- **Lembretes** - `remindersService.createReminder()`, `updateReminder()`, `deleteReminder()`
- **Economias** - `savingsService.createSaving()`, `updateSaving()`, `deleteSaving()`

---

## 🆘 Troubleshooting

### "Erro de conexão com Supabase"
- Verifique os valores em `.env.local`
- Certifique-se de que seu projeto Supabase está ativo

### "RLS policy violation"
- Verifique se o usuário está autenticado
- Certifique-se de que os dados pertencem ao usuário logado

### "Tabelas não aparecem"
- Recarregue a página do Supabase
- Verifique se o script SQL foi executado sem erros

---

## 📚 Estrutura dos Dados

### Users
- `id` (UUID) - ID do usuário (vinculado ao Auth)
- `email` (TEXT) - Email único
- `full_name` (TEXT) - Nome completo
- `created_at` - Data de criação

### Tasks
- `id` (UUID)
- `user_id` - Relacionado a Users
- `title` (TEXT)
- `description` (TEXT)
- `completed` (BOOLEAN)
- `priority` (TEXT) - 'low', 'medium', 'high'
- `due_date` (TIMESTAMP)
- `category` (TEXT)

### Goals, Finances, Habits, Reminders, Savings
Estrutura semelhante com campos específicos para cada tipo de dados.

---

## 💡 Dicas

1. **Backup**: Faça backup regular dos seus dados no Supabase
2. **Integração Futura**: Você pode adicionar mais funcionalidades (integração com calendário, notificações push, etc.)
3. **Performance**: Os índices já estão criados para consultas rápidas

---

## 🎉 Pronto!

Seu aplicativo Nexus Hub agora está totalmente integrado com Supabase! 🚀

Se tiver dúvidas durante a configuração, vou estar por aqui para ajudar!
