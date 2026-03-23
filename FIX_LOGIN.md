# 🔧 Troubleshooting - Login Não Funciona

## ⚠️ PROBLEMA PRINCIPAL IDENTIFICADO

**O SQL das tabelas não foi executado no Supabase!**

Sem o SQL, a tabela `public.users` não existe e o login falha.

### ✅ SOLUÇÃO RÁPIDA:
Veja o arquivo: **`SQL_SETUP_REQUIRED.md`** (instruções passo a passo)

---

## 🧪 Checklist de Diagnóstico

### 1️⃣ Verificar se SQL foi Executado

Abra DevTools(F12) → **Console** e execute:

```javascript
// Testa se tabela users existe
(async () => {
  const { data, error } = await supabase
    .from('users')
    .select('count')
    .limit(1);
  
  if (error) {
    console.error('❌ ERRO - Tabela não existe:', error.message);
    console.log('🔧 SOLUÇÃO: Execute o SQL em SQL_SETUP_REQUIRED.md');
  } else {
    console.log('✅ Tabela existe!');
  }
})();
```

**Resultado esperado:**
```
✅ Tabela existe!
```

Se vir erro como `"relation \"public.users\" does not exist"`:
- Execute o SQL do arquivo `SQL_SETUP_REQUIRED.md`

### 2️⃣ Limpar Cache/Cookies

- F12 → **Application** → **Storage** → **Clear site data**
- Ou: **Cookies** → Delete todos
- Recarregue: **Ctrl+Shift+R** (hard refresh)

### 3️⃣ Tentar Registrar Nova Conta

1. Acesse: http://localhost:5173
2. Clique: **"Registre-se"**
3. Preencha:
   - Email: `teste@teste.com`
   - Senha: `Teste@123456`
   - Nome: `Usuário Teste`
4. Clique: **Registrar**

Abra o console (F12) e procure por mensagens:

```
✅ "Usuário registrado com sucesso!" → Funcionou!
❌ "Banco de dados não está configurado" → Execute o SQL
❌ "does not exist" → Execute o SQL
```

### 4️⃣ Tentar Fazer Login

1. Clique: **"Faça login"**
2. Preencha:
   - Email: `teste@teste.com`
   - Senha: `Teste@123456`
3. Clique: **Entrar**

Procure por mensagens no console (F12):
```
✅ "Login realizado com sucesso!" → Funcionou!
❌ "Email ou senha incorretos" → Credenciais erradas
❌ "Usuário não encontrado" → Registre-se primeiro
```

---

## 🔍 Logs Detalhados do Console

O sistema agora mostra logs detalhados:

```
🔑 Tentando fazer login com: teste@teste.com
...
✅ Login realizado com sucesso!
```

**Se vir erro:**
1. Anote a mensagem de erro exata
2. Consulte a tabela abaixo

---

## 📋 Tabela de Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `"relation \"public.users\" does not exist"` | SQL não executado | Execute `SQL_SETUP_REQUIRED.md` |
| `"42P01"` | Tabela não existe | Execute `SQL_SETUP_REQUIRED.md` |
| `"Email ou senha incorretos"` | Credenciais erradas | Verifique email e senha |
| `"Usuário não encontrado"` | Usuário não registrado | Registre-se primeiro |
| `"invalid JSON in Authorization header"` | Token inválido | Refresh: Ctrl+Shift+R |
| `"VITE_SUPABASE_URL is not defined"` | .env.local erro | Verifique `.env.local` |
| `"Failed to fetch"` | Sem conexão Supabase | Verifique internet/URL Supabase |
| `"undefined is not a function"` | Supabase cliente erro | Recarregue a página |

---

## ✅ Se Tudo Estiver Funcionando

Você verá no console:

```
🔄 Inicializando autenticação...
✅ Usuário encontrado: seu@email.com
🔔 Auth state changed: SIGNED_IN
```

Ou para novo usuário:
```
🔑 Tentando fazer login com: novo@email.com
✅ Login realizado com sucesso!
```

---

## 📍 Checklist Final

- [ ] Executei o SQL em `SQL_SETUP_REQUIRED.md`
- [ ] Verifiquei tabela `users` no Supabase
- [ ] Limpei cache/cookies (Ctrl+Shift+R)
- [ ] Testei registrar nova conta
- [ ] Testei fazer login
- [ ] Console mostra mensagens de sucesso (✅)

---

## 🆘 Ainda Não Funciona?

1. **Abra DevTools**: F12
2. **Vá para Console**: Tab "Console"
3. **Procure por mensagens de erro** (em vermelho)
4. **Copie a mensagem de erro exata**
5. **Consulte a tabela acima** ou arquivo `SQL_SETUP_REQUIRED.md`

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
