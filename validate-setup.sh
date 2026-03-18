#!/bin/bash

# Script de validação - Execute para confirmar que tudo está certo

echo "🔍 Validando Configuração do Supabase..."
echo ""

# Verificar .env.local
echo "1️⃣  Verificando .env.local..."
if [ -f ".env.local" ]; then
    echo "   ✅ Arquivo .env.local existe"
    if grep -q "VITE_SUPABASE_URL" .env.local; then
        echo "   ✅ VITE_SUPABASE_URL está configurada"
    else
        echo "   ❌ VITE_SUPABASE_URL não encontrada"
    fi
    if grep -q "VITE_SUPABASE_PUBLISHABLE_KEY" .env.local; then
        echo "   ✅ VITE_SUPABASE_PUBLISHABLE_KEY está configurada"
    else
        echo "   ❌ VITE_SUPABASE_PUBLISHABLE_KEY não encontrada"
    fi
else
    echo "   ❌ Arquivo .env.local não encontrado"
fi
echo ""

# Verificar arquivos necessários
echo "2️⃣  Verificando arquivos criados..."
files=(
    "src/services/authService.ts"
    "src/services/dataService.ts"
    "src/pages/LoginPage.tsx"
    "src/pages/RegisterPage.tsx"
    "src/components/ProtectedRoute.tsx"
    "src/hooks/use-auth.ts"
    "supabase/migrations/01_create_tables.sql"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file não encontrado"
    fi
done
echo ""

# Verificar node_modules
echo "3️⃣  Verificando dependências..."
if [ -d "node_modules/@supabase/supabase-js" ]; then
    echo "   ✅ @supabase/supabase-js instalado"
else
    echo "   ⚠️  @supabase/supabase-js NÃO instalado - execute: npm install"
fi

if [ -d "node_modules/react-router-dom" ]; then
    echo "   ✅ react-router-dom instalado"
else
    echo "   ⚠️  react-router-dom NÃO instalado - execute: npm install"
fi

if [ -d "node_modules/sonner" ]; then
    echo "   ✅ sonner instalado"
else
    echo "   ⚠️  sonner NÃO instalado - execute: npm install"
fi
echo ""

# Verificar documentação
echo "4️⃣  Verificando documentação..."
docs=(
    "SUPABASE_SETUP.md"
    "SUPABASE_SUMMARY.md"
    "STORE_INTEGRATION.md"
    "CREDENTIALS.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "   ✅ $doc"
    else
        echo "   ❌ $doc não encontrado"
    fi
done
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ Próximas etapas:"
echo ""
echo "1. Execute o SQL no Supabase:"
echo "   → Abra: https://console.supabase.com"
echo "   → SQL Editor → Nova Query"
echo "   → Copie conteúdo: supabase/migrations/01_create_tables.sql"
echo "   → Execute (Ctrl+Enter)"
echo ""
echo "2. Inicie a aplicação:"
echo "   → npm run dev"
echo ""
echo "3. Teste o login:"
echo "   → Abra: http://localhost:5173"
echo "   → Clique em 'Registre-se'"
echo "   → Crie uma conta de teste"
echo "   → Faça login"
echo ""
echo "4. Verifique no Supabase:"
echo "   → Database → Tables → users"
echo "   → Você deve ver seu usuário"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
