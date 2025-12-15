  const validateFile = async (file) => {
    try {
      console.log('🔍 Validando arquivo:', file.name);
      
      setValidationMessage('Verificando tempo do comprovante...');
      setValidationDetails('Analisando data/hora da transação...');
      
      // Importar dinamicamente
      const paymentControlModule = await import('../../services/paymentControl.js');
      const PaymentControlService = paymentControlModule.default;
      
      const resultado = await PaymentControlService.processarArquivo(file);
      console.log('📊 Resultado completo:', resultado);
      
      // EXTRATEXTO DO OCR (supondo que está em resultado.ocrText)
      const ocrText = resultado.ocrText || '';
      
      // AGORA VALIDAÇÕES PIX
      console.log('🔍 Iniciando validações PIX...');
      
      // 1. Validar usando o novo serviço
      const pixValidation = await validatePaymentReceipt(ocrText);
      console.log('✅ Validação PIX:', pixValidation);
      
      if (!pixValidation.isValid) {
        // PAGAMENTO INVÁLIDO - mostrar erros específicos
        setValidationStatus('error');
        setValidationMessage('❌ Pagamento não aprovado');
        
        let errorDetails = 'Motivos da rejeição:\n\n';
        pixValidation.errors.forEach(error => {
          errorDetails += `• ${error}\n`;
        });
        
        errorDetails += '\nRequisitos para aprovação:\n';
        errorDetails += '✓ Favorecido: GUSTAVO SANTOS RIBEIRO ou GUSTAVO S RIBEIRO\n';
        errorDetails += '✓ Valor mínimo: R$ 10,00\n';
        errorDetails += '✓ Comprovante recente (até 5 minutos)\n';
        errorDetails += '✓ ID de transação único\n';
        
        setValidationDetails(errorDetails);
        return;
      }
      
      // 2. Verificar tempo (validação adicional)
      if (resultado.valido && pixValidation.isValid) {
        setValidationStatus('success');
        setValidationMessage('✅ Pagamento validado!');
        
        let details = '✅ TODAS AS VALIDAÇÕES APROVADAS!\n\n';
        details += `✓ Favorecido: ${pixValidation.extractedData.beneficiary || 'Validado'}\n`;
        details += `✓ Valor: R$ ${pixValidation.extractedData.amount || 'Validado'}\n`;
        details += `✓ Data/Hora: Dentro do prazo (5 minutos)\n`;
        details += `✓ ID Transação: ${pixValidation.extractedData.transactionId || 'Validado'}\n`;
        
        if (resultado.tempoRestante !== undefined) {
          details += `\n⏰ Restam ${resultado.tempoRestante} minutos do prazo.`;
        }
        
        setValidationDetails(details);
        
        // Gerar ID único para o pagamento
        const paymentId = `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Salvar transação validada
        localStorage.setItem('lastValidPayment', JSON.stringify({
          paymentId,
          transactionId: pixValidation.extractedData.transactionId,
          amount: pixValidation.extractedData.amount,
          validatedAt: new Date().toISOString(),
          fileName: file.name
        }));
        
        // Notificar o componente pai
        if (onValidationComplete) {
          onValidationComplete({
            ...resultado,
            ...pixValidation,
            paymentId: paymentId,
            fileName: file.name,
            fileSize: file.size,
            validatedAt: new Date().toISOString()
          });
        }
      } else {
        // ERRO DE TEMPO
        if (resultado.motivo === 'TEMPO_EXCEDIDO') {
          setValidationStatus('error');
          setValidationMessage('🚨 COMPROVANTE EXPIRADO!');
          setTempoExcedido(resultado.tempoExcedido);
          
          let details = '⏰ COMPROVANTE FORA DO PRAZO (5 minutos)\n\n';
          details += '🔄 FAÇA UM NOVO PAGAMENTO E ENVIE EM ATÉ 5 MINUTOS\n';
          setValidationDetails(details);
        }
      }
      
    } catch (error) {
      console.error('❌ Erro na validação:', error);
      setValidationStatus('error');
      setValidationMessage('❌ Erro ao processar comprovante');
      setValidationDetails('Tente novamente com uma imagem mais nítida.');
    }
  };
