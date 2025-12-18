#!/bin/bash

echo "🔍 VERIFICAÇÃO COMPLETA DOS VALORES"
echo "==================================="

# Lista de arquivos para verificar
declare -a files=(
    "src/components/tarot/PaymentUploader.jsx"
    "src/components/tarot/PaymentModal.jsx"
    "src/services/paymentControl.js"
    "src/services/pixValidator.js"
    "src/components/PixTest.jsx"
    "src/pages/PixTestPage.jsx"
)

echo ""
echo "📊 STATUS DOS ARQUIVOS:"
echo "-----------------------"

erros=0
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -n "📄 $file: "
        
        # Verificar se tem 15.00
        if grep -q "15\.00\|15,00\|'15'\\|\"15\"" "$file"; then
            echo "❌ AINDA TEM R\$ 15,00"
            erros=$((erros+1))
            grep "15\.00\|15,00\|'15'\\|\"15\"" "$file" | head -2
        else
            echo "✅ OK"
        fi
        
        # Mostrar valor atual
        echo "   Valor atual:"
        grep -n "10\.00\|10,00\|'10'\\|\"10\"\\|valorMinimo\\|R\\$ 10" "$file" 2>/dev/null | head -2 || echo "   (não encontrado)"
        echo ""
    fi
done

echo ""
echo "📊 RESULTADO:"
echo "------------"
if [ $erros -eq 0 ]; then
    echo "🎉 TODOS OS VALORES ESTÃO CORRETOS! (R\$ 10,00)"
    echo "✅ Sistema PIX pronto com valor mínimo R\$ 10,00"
else
    echo "⚠️  Ainda existem $erros arquivos com R\$ 15,00"
    echo "🔧 Execute novamente o script de correção"
fi

echo ""
echo "🔍 VERIFICAÇÃO RÁPIDA:"
echo "---------------------"
echo "1. PaymentUploader.jsx: $(grep -q "10\.00" src/components/tarot/PaymentUploader.jsx && echo "✅ 10.00" || echo "❌ 15.00")"
echo "2. pixValidator.js: $(grep -q "valorMinimo.*10" src/services/pixValidator.js 2>/dev/null && echo "✅ R\$ 10,00" || echo "❌ não encontrado")"
echo "3. PaymentModal.jsx: $(grep -q "R\\$ 10" src/components/tarot/PaymentModal.jsx && echo "✅ R\$ 10,00" || echo "❌ R\$ 15,00")"
