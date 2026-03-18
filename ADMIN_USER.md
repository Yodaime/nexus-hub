# 👤 Usuário Administrador - Nexus Hub

## 🔐 Credenciais de Acesso

Para acessar o Nexus Hub como administrador, use estas credenciais:

### Usuário Admin
```
Email:    admin@nexushub.com
Senha:    Admin@123456
```

---

## 📋 Como Criar o Usuário Administrador

### Opção 1: Via Supabase Console (Manual) ⭐ Recomendado

1. Abra: https://console.supabase.com
2. Selecione seu projeto
3. Vá para **Authentication** (menu esquerdo)
4. Clique em **Users**
5. Clique em **"Create new user"** (botão azul)
6. Preencha:
   - **Email**: `admin@nexushub.com`
   - **Password**: `Admin@123456` (mude depois de logar)
   - **Auto confirm user**: ✅ Marque essa opção
7. Clique **Create user**

✅ Pronto! Usuário criado!

---

### Opção 2: Via Script SQL (Automático)

Execute este SQL no Supabase SQL Editor:

```sql
-- IMPORTANTE: Execute isso APÓS criar o usuário via Console
-- Isso adiciona dados do admin na tabela users

INSERT INTO public.users (
  id,
  email,
  full_name,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@nexushub.com',
  'Administrador',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
```

---

## 🚀 Como Logar

1. Abra: http://localhost:5173
2. Clique em **"Faça login"**
3. Preencha:
   - **Email**: `admin@nexushub.com`
   - **Senha**: `Admin@123456`
4. Clique em **"Entrar"**

✅ Você agora tem acesso a todo o app!

---

## 🔑 O que o Admin pode fazer

- ✅ Criar, editar, deletar tarefas
- ✅ Criar, editar, deletar metas
- ✅ Registrar finanças
- ✅ Gerenciar hábitos
- ✅ Criar lembretes
- ✅ Gerenciar economias
- ✅ Fazer logout

---

## 🔐 Segurança

### ⚠️ IMPORTANTE

1. **Após logar, altere a senha**:
   - Clique no perfil (menu top right)
   - Selecione "Alterar Senha"
   - Use uma senha forte

2. **Guarde a senha com segurança**
   - Não compartilhe com ninguém
   - Não coloque em código

3. **Dados Protegidos**:
   - Cada usuário vê apenas seus dados
   - Admin com essa conta vê seus dados
   - Outros usuários não conseguem ver dados do admin

---

## 📊 Estrutura de Dados

Após logar com admin, você pode:

### Criar Tarefas
- Título, descrição
- Prioridade (low/medium/high)
- Data de vencimento
- Status (pending/in-progress/completed)

### Criar Metas
- Título, descrição
- Data alvo
- Progresso
- Status (active/paused/completed)

### Registrar Finanças
- Título, valor
- Tipo (income/expense)
- Categoria
- Data

### Etc...

---

## 🔄 Testar o Setup

### Passo 1: Logar como Admin
```
http://localhost:5173
Email: admin@nexushub.com
Senha: Admin@123456
```

### Passo 2: Criar Dados de Teste
- Crie uma tarefa
- Crie uma meta
- Registre uma despesa

### Passo 3: Verificar no Supabase
```
Supabase Console
→ Database → Tables → tasks
→ Browse
→ Procure seus dados
```

✅ Se aparecer: Tudo funcional!

---

## 🆘 Problemas

### "Email já existe"
- Significa que o usuário já foi criado
- Use email diferente ou delete e recrie

### "Erro ao fazer login"
- Verifique email/senha
- Certifique-se que Supabase está online
- Verifique `.env.local`

### "RLS policy violation"
- Usuário não está autenticado
- Ou email está errado

---

## 📝 Próximas Contas (Outros Usuários)

Para criar mais usuários:

1. Repita o processo pela Supabase Console
2. Ou compartilhe o app e eles se registram normalmente

Cada usuário verá apenas seus dados (isolamento completo).

---

## 🔑 Resumo de Credenciais

| Campo | Valor |
|-------|-------|
| URL do App | http://localhost:5173 |
| Email | admin@nexushub.com |
| Senha | Admin@123456 |
| Supabase URL | https://eowayigbpqnwfswwikdc.supabase.co |

---

## ✅ Checklist

- [ ] Criar usuário no Supabase Console
- [ ] Fazer login com admin@nexushub.com
- [ ] Acessar o app com sucesso
- [ ] Criar dados de teste
- [ ] Verificar dados no Supabase
- [ ] Alterar senha do admin
- [ ] Testar com outro usuário (opcional)

---

**Pronto para logar! 🚀**

Acesse: http://localhost:5173 (após `npm run dev`)
