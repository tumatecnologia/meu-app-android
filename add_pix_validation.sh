#!/bin/bash
FILE="src/components/tarot/PaymentUploader_CLEAN.jsx"

# Encontrar a linha após o console.log do resultado
LINE=$(grep -n "console.log('📊 Resultado completo:', resultado);" "$FILE" | cut -d: -f1)

if [ -n "$LINE" ]; then
  # Adicionar validação PIX simplificada
  sed -i "${LINE}a\\
      // VALIDAÇÃO PIX - VERIFICAÇÕES ADICIONAIS\\
      try {\\
        const ocrText = resultado.ocrText || resultado.textoExtraido || '';\\
        if (ocrText && ocrText.length > 10) {\\
          const pixValidation = await validatePaymentReceipt(ocrText);\\
          if (!pixValidation.isValid) {\\
            setValidationStatus('error');\\
            setValidationMessage('❌ Pagamento não aprovado');\\
            let errorMsg = 'PAGAMENTO REJEITADO:\\\\n';\\
            pixValidation.errors.forEach(error => {\\
              errorMsg += '• ' + error + '\\\\n';\\
            });\\
            setValidationDetails(errorMsg);\\
            return;\\
          }\\
          console.log('✅ Validação PIX aprovada');\\
        }\\
      } catch (pixError) {\\
        console.warn('Validação PIX ignorada:', pixError);\\
      }" "$FILE"
  
  echo "✅ Validação PIX adicionada com sucesso!"
fi
