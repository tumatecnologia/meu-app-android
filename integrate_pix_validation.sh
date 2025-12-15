#!/bin/bash
FILE="src/components/tarot/PaymentUploader.jsx"

# Encontrar onde adicionar a validação PIX (após o resultado do OCR)
LINE=$(grep -n "console.log('📊 Resultado completo:', resultado);" "$FILE" | cut -d: -f1)

if [ -n "$LINE" ]; then
  echo "Adicionando validação PIX após linha $LINE..."
  
  # Criar o código para inserir
  cat > /tmp/pix_integration.js << 'PIXCODE'
  
      // ========== VALIDAÇÃO PIX ==========
      try {
        // Extrair texto do OCR do resultado
        const ocrText = resultado.ocrText || resultado.textoExtraido || '';
        
        if (ocrText && ocrText.trim().length > 20) {
          console.log('🔍 Validando regras PIX...');
          const pixValidation = await validatePaymentReceipt(ocrText);
          
          if (!pixValidation.isValid) {
            // REJEITAR - não atende às regras PIX
            setValidationStatus('error');
            setValidationMessage('❌ Pagamento não aprovado');
            
            let errorDetails = 'PAGAMENTO REJEITADO:\n\n';
            pixValidation.errors.forEach((error, index) => {
              errorDetails += \`\${index + 1}. \${error}\n\`;
            });
            
            errorDetails += '\n📋 REQUISITOS PARA APROVAÇÃO:\n';
            errorDetails += '• Favorecido: GUSTAVO SANTOS RIBEIRO ou GUSTAVO S RIBEIRO\n';
            errorDetails += '• Valor mínimo: R$ 10,00\n';
            errorDetails += '• Comprovante enviado em até 5 minutos\n';
            errorDetails += '• ID de transação único\n';
            
            setValidationDetails(errorDetails);
            return; // Para aqui - não continua
          }
          
          // Se PIX válido, adicionar info aos detalhes
          console.log('✅ Validação PIX aprovada:', pixValidation.extractedData);
          
          // Salvar dados da transação
          localStorage.setItem('ultimaTransacaoPix', JSON.stringify({
            transactionId: pixValidation.extractedData.transactionId,
            amount: pixValidation.extractedData.amount,
            validatedAt: new Date().toISOString()
          }));
        }
      } catch (pixError) {
        console.warn('Erro na validação PIX:', pixError);
        // Continua com validação normal se der erro
      }
      // ========== FIM VALIDAÇÃO PIX ==========
PIXCODE
  
  # Inserir o código
  awk -v n=$LINE -v code="$(cat /tmp/pix_integration.js)" 'NR==n{print; print code; next}1' "$FILE" > "$FILE.tmp"
  mv "$FILE.tmp" "$FILE"
  
  echo "✅ Validação PIX integrada!"
else
  echo "❌ Não encontrou a linha alvo"
fi
