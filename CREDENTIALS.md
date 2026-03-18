# 🔐 Credenciais Supabase - Referência Rápida

## Suas Informações

| Campo | Valor |
|-------|-------|
| **URL do Projeto** | `https://eowayigbpqnwfswwikdc.supabase.co` |
| **Chave Pública** | `sb_publishable_esjO_zHdUq1fICP8B87fSA_6PlbDxyv` |
| **Tipo de Autenticação** | Email + Senha |

## Links Úteis

- 🌐 [Painel Supabase](https://console.supabase.com)
- 📚 [Documentação Supabase](https://supabase.com/docs)
- 🔑 [Gerenciar Chaves API](https://console.supabase.com/project/_/settings/api)

## Checklist de Configuração

- [ ] Acessar Supabase com suas credenciais
- [ ] Executar SQL do arquivo `supabase/migrations/01_create_tables.sql`
- [ ] Verificar tabelas no Database → Tables
- [ ] Testar aplicação com `npm run dev`
- [ ] Registrar uma conta de teste
- [ ] Criar alguns dados testes
- [ ] Verificar dados no Supabase

## Primeiros Passos

### 1. Executar SQL (OBRIGATÓRIO)

```sql
-- Copie todo o conteúdo de:
-- supabase/migrations/01_create_tables.sql
-- E execute no SQL Editor do Supabase
```

### 2. Iniciar App Localmente

```bash
npm run dev
```

### 3. Registro e Login

- Clique em "Registre-se"
- Use um email de teste
- Crie uma senha
- Faça login

### 4. Verificar no Supabase

- Vá para Database → Tables → users
- Você deve ver seu usuário lá ✅

## Estrutura de Tabelas

```
users
  ├── id (UUID)
  ├── email (TEXT)
  ├── full_name (TEXT)
  └── created_at (TIMESTAMP)

tasks
  ├── id (UUID)
  ├── user_id (FK)
  ├── title (TEXT)
  ├── completed (BOOLEAN)
  └── ...

goals, finances, habits, reminders, savings
  └── Estrutura similar
```

## Segurança - RLS Ativado ✅

Todas as tabelas têm Row Level Security:
- Cada usuário só vê seus dados
- Sem exceções
- Automático via Supabase

## Dúvidas Frequentes

**P: Onde coloco meus dados de acesso?**  
R: Já estão em `.env.local`

**P: Posso compartilhar `.env.local`?**  
R: NÃO! Adicione ao `.gitignore`

**P: Como resetar o banco?**  
R: No Supabase, vá para Database → Backups ou delete as tabelas e rode SQL novamente

**P: Como adicionar mais usuários?**  
R: Registrem contas normalmente pelo app

---

## 🚀 Pronto!

Tudo está configurado. Agora é só executar o SQL e começar a usar! 🎉
