#!/bin/bash

# 🔧 Script de Diagnóstico - Nexus Hub Login

echo "🔍 Diagnosticando Sistema Nexus Hub..."
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Verificar .env.local
echo -e "${BLUE}1️⃣  Verificando Configuração Supabase...${NC}"
if [ -f ".env.local" ]; then
    if grep -q "VITE_SUPABASE_URL" .env.local && grep -q "VITE_SUPABASE_PUBLISHABLE_KEY" .env.local; then
        echo -e "${GREEN}✅ .env.local configurado${NC}"
    else
        echo -e "${RED}❌ .env.local incompleto${NC}"
        echo "   Variáveis necessárias:"
        echo "   - VITE_SUPABASE_URL"
        echo "   - VITE_SUPABASE_PUBLISHABLE_KEY"
    fi
else
    echo -e "${RED}❌ .env.local não encontrado${NC}"
fi
echo ""

# 2. Verificar arquivos
echo -e "${BLUE}2️⃣  Verificando Arquivos Críticos...${NC}"
FILES=(
    "src/services/authService.ts"
    "src/pages/LoginPage.tsx"
    "src/pages/RegisterPage.tsx"
    "src/hooks/use-auth.ts"
    "src/components/ProtectedRoute.tsx"
    "supabase/migrations/01_create_tables.sql"
    "SQL_SETUP_REQUIRED.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file FALTANDO${NC}"
    fi
done
echo ""

# 3. Verificar dependências
echo -e "${BLUE}3️⃣  Verificando Dependências...${NC}"
if grep -q '"@supabase/supabase-js"' package.json; then
    echo -e "${GREEN}✅ @supabase/supabase-js instalado${NC}"
else
    echo -e "${RED}❌ @supabase/supabase-js NÃO instalado${NC}"
    echo "   Execute: npm install"
fi

if grep -q '"react-router-dom"' package.json; then
    echo -e "${GREEN}✅ react-router-dom instalado${NC}"
else
    echo -e "${RED}❌ react-router-dom NÃO instalado${NC}"
fi

if grep -q '"sonner"' package.json; then
    echo -e "${GREEN}✅ sonner instalado${NC}"
else
    echo -e "${RED}❌ sonner NÃO instalado${NC}"
fi
echo ""

# 4. Instruções
echo -e "${YELLOW}📋 PRÓXIMOS PASSOS:${NC}"
echo ""
echo -e "${BLUE}Importante: SQL NÃO foi verificado!${NC}"
echo ""
echo "1️⃣  Execute o SQL em Supabase:"
echo "   Arquivo: supabase/migrations/01_create_tables.sql"
echo "   OU leia: SQL_SETUP_REQUIRED.md"
echo ""
echo "2️⃣  No Supabase Console:"
echo "   → SQL Editor"
echo "   → Create new query"
echo "   → Copie TODO o SQL"
echo "   → Execute (Ctrl+Enter)"
echo ""
echo "3️⃣  Teste o login:"
echo "   npm run dev"
echo "   Acesse: http://localhost:5173"
echo ""
echo "4️⃣  Se houver erro:"
echo "   Abra DevTools (F12) → Console"
echo "   E procure por mensagens de erro"
echo ""

echo -e "${GREEN}✨ Diagnóstico completo!${NC}"
echo ""
echo "💡 Dica: Se tudo acima estiver ✅ mas login ainda não funcionar,"
echo "   veja: FIX_LOGIN.md"
