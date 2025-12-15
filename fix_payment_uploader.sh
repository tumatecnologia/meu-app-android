#!/bin/bash
FILE="src/components/tarot/PaymentUploader.jsx"

# 1. Adicionar a importação no topo (após as outras importações)
sed -i '2aimport { validatePaymentReceipt } from "../../services/paymentControl";' $FILE

# 2. Encontrar onde adicionar as validações PIX
# Vamos adicionar após o console.log do resultado OCR
LINE=$(grep -n "console.log('📊 Resultado completo:', resultado);" $FILE | cut -d: -f1)

if [ -n "$LINE" ]; then
  # Criar patch para inserir após essa linha
  cat > /tmp/pix_patch.txt << 'PATCH'
      
      // ===== VALIDAÇÕES PIX =====
      try {
        // Extrair texto do OCR
        const ocrText = resultado.ocrText || resultado.textoExtraido || '';
        
        if (ocrText && ocrText.trim().length > 20) {
          console.log('🔍 Validando dados PIX...');
          
          const pixValidation = await validatePaymentReceipt(ocrText);
          console.log('✅ Resultado validação PIX:', pixValidation);
          
          if (!pixValidation.isValid) {
            // PAGAMENTO REJEITADO
            setValidationStatus('error');
            setValidationMessage('❌ Pagamento não aprovado');
            
            let errorDetails = '🚫 PAGAMENTO REJEITADO:\n\n';
            pixValidation.errors.forEach((error, index) => {
              errorDetails += \`\${index + 1}. \${error}\n\`;
            });
            
            errorDetails += '\n📋 REQUISITOS PARA APROVAÇÃO:\n';
            errorDetails += '✅ Favorecido: GUSTAVO SANTOS RIBEIRO ou GUSTAVO S RIBEIRO\n';
            errorDetails += '✅ Valor mínimo: R$ 10,00\n';
            errorDetails += '✅ Comprovante enviado em até 5 minutos\n';
            errorDetails += '✅ ID de transação único (não repetido)\n\n';
            errorDetails += '🔄 SOLUÇÃO: Faça um novo pagamento atendendo todos os requisitos acima.';
            
            setValidationDetails(errorDetails);
            return;
          }
          
          // PAGAMENTO PIX VÁLIDO - salvar dados
          console.log('✅ Pagamento PIX validado!');
          
          // Salvar transação
          localStorage.setItem('ultimoPagamentoValido', JSON.stringify({
            transactionId: pixValidation.extractedData.transactionId,
            amount: pixValidation.extractedData.amount,
            validatedAt: new Date().toISOString(),
            fileName: file.name
          }));
          
          // Adicionar info PIX aos detalhes se for sucesso
          if (resultado.valido) {
            let currentDetails = validationDetails || '';
            currentDetails += '\n\n✅ VALIDAÇÃO PIX APROVADA\n';
            currentDetails += \`• Favorecido: \${pixValidation.extractedData.beneficiary || 'Validado'}\n\`;
            currentDetails += \`• Valor: R$ \${pixValidation.extractedData.amount?.toFixed(2) || 'Validado'}\n\`;
            currentDetails += \`• ID: \${pixValidation.extractedData.transactionId || 'Gerado'}\n\`;
            setValidationDetails(currentDetails);
          }
        }
      } catch (pixError) {
        console.warn('⚠️ Erro na validação PIX:', pixError);
        // Continua com validação normal
      }
      // ===== FIM VALIDAÇÕES PIX =====
PATCH

  # Inserir o patch
  awk -v n=$LINE -v patch="$(cat /tmp/pix_patch.txt)" 'NR==n{print; print patch; next}1' $FILE > $FILE.tmp
  mv $FILE.tmp $FILE
  
  echo "✅ Validações PIX adicionadas com sucesso!"
else
  echo "❌ Não encontrou a linha alvo"
fi
