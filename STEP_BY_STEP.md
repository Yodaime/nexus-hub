# 📖 Guia Passo a Passo Visual - Supabase Setup

## 🎯 Objetivo Final

```
┌─────────────────────────────────────────┐
│         Nexus Hub com Supabase          │
│                                         │
│  ✅ Login/Registro Funcionando          │
│  ✅ Dados Salvos em Nuvem               │
│  ✅ Múltiplos Usuários                  │
│  ✅ Sincronização Automática            │
└─────────────────────────────────────────┘
```

---

## 📂 Estrutura do que foi criado

```
nexus-hub/
├── 📄 .env.local                    ← Credenciais (já preenchidas)
│
├── 📂 supabase/
│   └── migrations/
│       └── 01_create_tables.sql     ← Script do banco (EXECUTAR NO SUPABASE)
│
├── 📂 src/
│   ├── 📂 services/
│   │   ├── authService.ts           ← Autenticação
│   │   └── dataService.ts           ← CRUD de dados
│   │
│   ├── 📂 pages/
│   │   ├── LoginPage.tsx            ← Página de login
│   │   └── RegisterPage.tsx         ← Página de registro
│   │
│   ├── 📂 components/
│   │   ├── ProtectedRoute.tsx       ← Proteção de rotas
│   │   └── layout/
│   │       └── AppSidebar.tsx       ← Atualizado com logout
│   │
│   └── 📂 hooks/
│       └── use-auth.ts              ← Hook de autenticação
│
├── 📄 SUPABASE_SETUP.md             ← Guia completo
├── 📄 SUPABASE_SUMMARY.md           ← Resumo rápido
├── 📄 STORE_INTEGRATION.md          ← Como integrar stores
├── 📄 CREDENTIALS.md                ← Referência de credenciais
└── 📄 validate-setup.sh             ← Script de validação
```

---

## 🚀 Passo 1 - Executar o SQL no Supabase

### Onde fazer

```
https://console.supabase.com
        ↓
[Abrir seu projeto]
        ↓
[SQL Editor]
        ↓
[Criar Nova Query]
```

### O que copiar

```
Arquivo: supabase/migrations/01_create_tables.sql

Contém:
├── CREATE TABLE users
├── CREATE TABLE tasks
├── CREATE TABLE goals
├── CREATE TABLE finances
├── CREATE TABLE habits
├── CREATE TABLE reminders
├── CREATE TABLE savings
├── CREATE INDEXES
└── CREATE RLS POLICIES
```

### Passos:

```
1. Abra seu navegador
   ↓
2. Acesse console.supabase.com
   ↓
3. Faça login com sua conta
   ↓
4. Selecione o projeto "Nexus Hub"
   ↓
5. Clique em "SQL Editor" (menu esquerdo)
   ↓
6. Clique em "+ New Query"
   ↓
7. Copie TODO o conteúdo de:
   supabase/migrations/01_create_tables.sql
   ↓
8. Cole no editor Supabase
   ↓
9. Clique em "Run" ou pressione Ctrl+Enter
   ↓
10. Espere a mensagem de sucesso ✅
```

### Verificar se funcionou

```
❓ Como saber que deu certo?

✅ Você verá: "Query executed successfully"
✅ Acesse: Database → Tables
✅ Verá 8 novas tabelas:
   - users
   - tasks
   - goals
   - finances
   - habits
   - habit_logs
   - reminders
   - savings

❌ Se der erro:
   - Leia a mensagem de erro
   - Verifique sintaxe SQL
   - Tente novamente
```

---

## 💻 Passo 2 - Testar Localmente

### Terminal

```bash
# Na pasta do projeto, execute:
cd /home/odair/Documentos/Arquivos\ externos/nexus-hub

# Instale dependências (opcional, se não tiver já)
npm install

# Inicie desenvolvimento
npm run dev
```

### No navegador

```
Abra: http://localhost:5173
      ↓
Você vê a página de LOGIN
      ↓
Clique em "Registre-se"
      ↓
Preencha o formulário:
├── Nome Completo: Seu Nome
├── Email: seu@email.com
└── Senha: senha123
      ↓
Clique em "Registrar"
      ↓
✅ Você deve ver: "Usuário registrado com sucesso!"
      ↓
Você é redirecionado para o APP
```

---

## 📊 Passo 3 - Verificar Dados no Supabase

### Localizar seus dados

```
Supabase Console
      ↓
Database
      ↓
Tables
      ↓
users    ← Clique para ver
```

### O que você verá

```
┌─────────────────────────────────────────┐
│ ID (UUID)  │ Email         │ Full Name   │
├─────────────────────────────────────────┤
│ abc123...  │ seu@email.com │ Seu Nome    │
└─────────────────────────────────────────┘
```

✅ Se seu usuário aparecer aqui, tudo funcionou!

---

## 🔄 Passo 4 - Integrar com Stores (Opcional)

Se quiser que seus dados sincronizem automaticamente:

```
Leia:    STORE_INTEGRATION.md
         ↓
Siga as instruções
         ↓
Atualizar stores:
├── taskStore.ts
├── goalStore.ts
├── financeStore.ts
├── habitStore.ts
├── reminderStore.ts
└── savingsStore.ts
         ↓
Teste criando dados
```

---

## ✨ Fluxo Completo de Uso

```
┌─────────────────────────────────────────┐
│      Usuário Abre a Aplicação           │
└────────────────┬────────────────────────┘
                 ↓
        ┌────────────────────┐
        │ Está autenticado?  │
        └────────┬───────────┘
                 │
        ┌────────┴─────────┐
        ↓                  ↓
      NÃO                SIM
        ↓                  ↓
    [LOGIN]           [APP PRINCIPAL]
        ↓                  ↓
   ┌─────────┐      ┌──────────────┐
   │Registrar│      │ Criar Tarefa │
   │ou Login │      │ Editar Tarefa│
   └────┬────┘      │Deletar Tarefa│
        │           └──────┬───────┘
        ↓                   ↓
    [Auth Service]   [Data Service]
        ↓                   ↓
    [Supabase Auth]  [Supabase DB]
        ↓                   ↓
   Sessão Criada    Dados Salvos
        ↓                   ↓
   [ACESSO]          [SINCRONIZADO]
```

---

## 🎯 Checklist Final

Marque conforme você completa:

```
Configuração
  ☐ .env.local criado e preenchido
  ☐ Arquivos criados (8 arquivos de código)
  ☐ Documentação criada (4 arquivos)

Execução
  ☐ Script SQL executado no Supabase
  ☐ Tabelas aparecem no Supabase
  ☐ npm run dev funcionando
  ☐ Página de login acessível

Teste
  ☐ Registrou um usuário
  ☐ Fez login com sucesso
  ☐ Viu o usuário no Supabase
  ☐ App principal carregou

Integração (Opcional)
  ☐ Leu STORE_INTEGRATION.md
  ☐ Entendeu como integrar
  ☐ Atualizou um store (testar)
  ☐ Criou dados e salvou

Deploy (Futuro)
  ☐ Ambos (dev e prod) funcionando
  ☐ Dados sincronizados
  ☐ Compartilhado com amigos
```

---

## 🆘 Problemas Comuns

### Problema: "Tabelas não encontradas"
```
❌ Causa: SQL não foi executado no Supabase
✅ Solução: Execute o SQL no Supabase Console
```

### Problema: "Erro: VITE_SUPABASE_URL não definida"
```
❌ Causa: .env.local não foi criado
✅ Solução: Verifique se .env.local existe na raiz
```

### Problema: "RLS policy violation"
```
❌ Causa: Usuário não está autenticado
✅ Solução: Faça login corretamente
```

### Problema: "Conexão recusada localhost:5173"
```
❌ Causa: npm run dev não foi executado
✅ Solução: Execute `npm run dev` no terminal
```

---

## 📞 Próximos Passos

Após tudo funcionar:

1. **Explorar o App**
   - Criar tarefas
   - Adicionar metas
   - Registrar finanças
   - etc...

2. **Integrar Stores**
   - Seguir STORE_INTEGRATION.md
   - Tornar sincronização automática

3. **Deploy**
   - Fazer build: `npm run build`
   - Deploy em Vercel, Netlify, etc

4. **Compartilhar**
   - Convite amigos
   - Eles criam contas
   - Dados independentes

---

## ✅ Você Está Pronto!

```
┌─────────────────────────────────────────┐
│  🎉 Supabase Configurado com Sucesso!  │
│                                         │
│  ✨ Autenticação: OK                    │
│  ✨ Banco de Dados: OK                  │
│  ✨ Segurança: OK                       │
│  ✨ Sincronização: Pronta               │
│                                         │
│        Seu app está pronto! 🚀          │
└─────────────────────────────────────────┘
```

## Dúvidas?

Qualquer problema, posso ajudar! 💪
