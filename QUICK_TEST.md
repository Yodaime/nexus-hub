# 🧪 Teste Rápido - Validar Supabase

Execute esses testes para confirmar que tudo está funcionando.

## ✅ Teste 1: Verificar Arquivos

```bash
# Na pasta do projeto, execute:
chmod +x validate-setup.sh
./validate-setup.sh
```

Você verá ✅ para cada item correto.

---

## ✅ Teste 2: Verificar Conexão com Supabase

Entre no browser Console e execute:

```javascript
// Abra DevTools (F12) → Console
// Cole e execute o código abaixo:

import { supabase } from '@/integrations/supabase/client';

// Testar conexão
(async () => {
  try {
    const { data, error } = await supabase.from('users').select('count()', { count: 'exact' });
    if (error) throw error;
    console.log('✅ Conexão com Supabase OK');
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
})();
```

---

## ✅ Teste 3: Testar Autenticação

Com a app rodando (`npm run dev`):

### Passo 1: Registrar

1. Abra http://localhost:5173
2. Clique em "Registre-se"
3. Preencha:
   - Nome: "Teste User"
   - Email: "teste@example.com"
   - Senha: "senha123456"
4. Clique em "Registrar"

**Esperado**: Mensagem de sucesso e redireção para o app

### Passo 2: Fazer Login

1. Você deve estar no app principais agora
2. Clique no botão de usuario/perfil
3. Clique em "Sair" (logout)
4. Você deve ser redirecionado para /login

**Esperado**: Logout funcional

### Passo 3: Fazer Login Novamente

1. Preencha email e senha
2. Clique em "Entrar"

**Esperado**: Acesso ao app concedido

---

## ✅ Teste 4: Verificar Dados no Supabase

1. Abra https://console.supabase.com
2. Selecione seu projeto
3. Vá para **Database → Tables → users**
4. Clique em **Browse**

**Esperado**: Você verá seu usuário registrado:
```
ID: (UUID)
email: teste@example.com
full_name: Teste User
created_at: (data/hora)
```

---

## ✅ Teste 5: Testar Data Service (Avançado)

Abra DevTools Console e execute:

```javascript
// Testar criar tarefa
import { tasksService } from '@/services/dataService';

(async () => {
  try {
    const newTask = await tasksService.createTask({
      title: 'Teste Tarefa',
      description: 'Tarefa de teste',
      completed: false,
      priority: 'high',
      due_date: new Date().toISOString(),
      user_id: '', // será preenchido automaticamente
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    
    console.log('✅ Tarefa criada:', newTask);
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
})();
```

**Esperado**: ✅ Tarefa criada com sucesso

---

## 🔍 Checklist de Testes

```
Teste         Status        Ação
────────────────────────────────────────────
1. Arquivos       ☐           validate-setup.sh
2. Conexão        ☐           Supabase conectado?
3. Registro       ☐           Usuário criado?
4. Login          ☐           Acesso concedido?
5. Logout         ☐           Saiu e redirecionou?
6. Dados DB       ☐           Viu no Supabase?
7. Data Service   ☐           API funcionando?
```

---

## 🐛 Se Algo Não Funcionar

### Teste 1 Falhar

```
❌ Arquivos não encontrados

Solução:
1. Verifique se você está na pasta correta
2. Confirme que os arquivos foram criados
3. Se não, precisa regenerá-los
```

### Teste 2 Falhar

```
❌ Conexão com Supabase falhou

Solução:
1. Verifique .env.local
2. Confirme VITE_SUPABASE_URL
3. Confirme VITE_SUPABASE_PUBLISHABLE_KEY
4. Reinicie o servidor: npm run dev
```

### Teste 3 Falhar (Registro)

```
❌ Erro ao registrar

Solução:
1. Verifique error message no toast
2. Email já existe?
3. Senha muito fraca?
4. Supabase Auth habilitado?
```

### Teste 4 Falhar

```
❌ Usuário não aparece no Supabase

Solução:
1. Execute o SQL novamente
2. Tabela 'users' existe?
3. Policies ativadas?
4. Permissões corretas?
```

### Teste 5 Falhar

```
❌ Erro ao criar tarefa via API

Solução:
1. Você está logado?
2. Tabela 'tasks' existe?
3. User ID correto?
4. RLS policies OK?
```

---

## ⏱️ Tempo Estimado

- ✅ Teste 1: 30 segundos
- ✅ Teste 2: 1 minuto
- ✅ Teste 3: 3 minutos
- ✅ Teste 4: 2 minutos
- ✅ Teste 5: 1 minuto

**Total**: ~7 minutos para validar tudo

---

## 🎯 Resultado Esperado

Após passar todos os testes:

```
✅ Autenticação funcionando
✅ Banco de dados criado
✅ Dados sendo salvos
✅ Usuários isolados
✅ App pronto para uso
```

---

## 📞 Próximos Passos Após Testes

1. ✅ Tudo passou?
   → Parabéns! Seu Supabase está pronto
   → Continue para integração de stores

2. ❌ Algo falhou?
   → Verifique a seção "Se algo não funcionar"
   → Procure a solução específica
   → Tente novamente

---

## 📚 Troubleshooting Detalhado

### "TypeError: Cannot read property 'from' of undefined"

Causa: `supabase` não foi importado corretamente

Solução:
```typescript
// ✅ Correto
import { supabase } from '@/integrations/supabase/client';

// ❌ Errado
import supabase from '@/integrations/supabase/client';
```

---

### "RLS policy violation"

Causa: Usuário não autenticado ou não tem permissão

Solução:
1. Confirme se está logado
2. Verifique RLS policies no Supabase
3. Certifique-se que user_id está correto

---

### "network_error: Failed to fetch"

Causa: Problema de conexão com Supabase

Solução:
1. Verifique internet
2. Verifique VITE_SUPABASE_URL está correta
3. Verifique status de Supabase em: https://status.supabase.com

---

## ✨ Tudo OK?

Se todos os testes passaram, parabéns! 🎉

Você pode agora:
- ✅ Integrar os stores (veja STORE_INTEGRATION.md)
- ✅ Começar a usar o app
- ✅ Adicionar mais funcionalidades
- ✅ Deploy em produção

---

Sucesso! 🚀
