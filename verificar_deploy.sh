#!/bin/bash
echo "🔍 VERIFICAÇÃO DO DEPLOY"
echo "========================"

REPO="tumatecnologia/meu-app-android"
URL="https://tumatecnologia.github.io/meu-app-android/"

echo "1. Repositório: $REPO"
echo "2. URL do site: $URL"

# Verificar última atualização no GitHub
echo -e "\n3. Último commit:"
git log --oneline -1

# Verificar se o site está acessível
echo -e "\n4. Testando conexão com o site..."
curl -s -I "$URL" | head -5

# Verificar GitHub Pages status
echo -e "\n5. Para verificar deploy no GitHub:"
echo "   • Acesse: https://github.com/$REPO/settings/pages"
echo "   • Verifique se 'Branch' está como 'gh-pages'"
echo "   • Status deve ser: ✅ 'Your site is published at $URL'"

echo -e "\n6. Links importantes:"
echo "   📱 Site: $URL"
echo "   📁 Repositório: https://github.com/$REPO"
echo "   ⚙️  Actions: https://github.com/$REPO/actions"
echo "   🚀 Pages: https://github.com/$REPO/settings/pages"

echo -e "\n✅ Deploy concluído! O site será atualizado em alguns minutos."
