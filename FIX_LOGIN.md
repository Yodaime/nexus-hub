# 🔧 Troubleshooting - Login Não Funciona

## ✅ O Que Foi Corrigido

Implementei 3 correções importantes:

1. **Hook `use-auth.ts`** - Agora detecta melhor o estado de autenticação
2. **Service `authService.ts`** - Retorna usuário mesmo se não estiver na tabela
3. **Páginas de login/registro** - Agora aguardam sessão ser estabelecida

---

## 🧪 Teste o Login Agora

### Passo 1: Limpar Cache/Cookies (IMPORTANTE)
- Abra DevTools: F12
- Vá para **Application** → **Cookies**
- Delete todos os cookies do site
- Recarregue a página

### Passo 2: Fazer Login
```
Email: admin@nexushub.com
Senha: Admin@123456
```

### Passo 3: Verificar Console
- Abra DevTools: F12
- Vá para **Console**
- Procure por erros (mensagens em vermelho)
- Se houver erro, anote e me passe

---

## 🐛 Se Ainda Não Funcionar

### Opção 1: Criar Novo Usuário
Se o admin não funcionar, crie outro:

1. Abra: https://console.supabase.com
2. Authentication → Users → Create new user
3. Use:
   - Email: `teste@teste.com`
   - Senha: `Teste@123456`
   - ✅ Marque "Auto confirm user"

4. Tente logar com essas credenciais

### Opção 2: Verificar Console do Navegador
Abra DevTools (F12) → Console e procure por:

```
❌ "unauthorized" ou "invalid credentials"
   → Usuário não existe ou senha errada

❌ "Failed to fetch"
   → Problema de conexão com Supabase

❌ "VITE_SUPABASE_URL is not defined"
   → .env.local não está correto

❌ "Table 'users' not found"
   → SQL do Supabase não foi executado
```

### Opção 3: Debugar Supabase
No console do navegador (F12), execute:

```javascript
import { supabase } from '@/integrations/supabase/client';

// Verificar sessão atual
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Sessão:', session);
})();

// Testar login
(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@nexushub.com',
    password: 'Admin@123456'
  });
  console.log('Login result:', { data, error });
})();
```

---

## 🔑 Checklist

- [ ] Limpar cache/cookies
- [ ] Recarregar página
- [ ] Tentar login com admin@nexushub.com
- [ ] Se erro, verificar DevTools Console
- [ ] Se ainda erro, criar novo usuário
- [ ] Testar com novo usuário

---

## 📋 Se o erro for "usuario nao encontrado"

Significa que o usuário não foi criado no Supabase. Faça isso:

1. **No Supabase Console**:
   - Authentication → Users
   - "Create new user"
   - Email: `admin@nexushub.com`
   - Password: `Admin@123456`
   - ✅ Marque "Auto confirm user"
   - Clique "Create user"

2. **No SQL Editor** (opcional):
   ```sql
   INSERT INTO public.users (id, email, full_name) 
   SELECT id, email, 'Administrador'
   FROM auth.users 
   WHERE email = 'admin@nexushub.com'
   ON CONFLICT DO NOTHING;
   ```

3. **Tente logar novamente**

---

## 📝 Se Ainda Tiver Erro

Execute no console (F12) e me passe a saída:

```javascript
// Verificar credenciais
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('KEY:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

// Testar conexão
await supabase.auth.signInWithPassword({
  email: 'admin@nexushub.com',
  password: 'Admin@123456'
}).then(r => console.log('Login:', r));
```

---

## ✨ Resultado Esperado

Após logar com sucesso:
- ✅ Você vê a página inicial (tarefas)
- ✅ Sidebar aparece com botão "Sair"
- ✅ Pode criar dados

---

## 🚀 Próximo Passo

Depois que o login funcionar:
- [ ] Testar criar uma tarefa
- [ ] Verificar no Supabase se salvou
- [ ] Integrar seus stores
- [ ] Deploy

---

**Tente agora e me conte o resultado! 💪**
