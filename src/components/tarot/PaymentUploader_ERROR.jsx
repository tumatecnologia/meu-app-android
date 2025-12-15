import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Info, Clock, Zap, Ban } from 'lucide-react';
import { validatePaymentReceipt } from "../../services/paymentControl";

const PaymentUploader = ({ onValidationComplete, onCancel }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [validationStatus, setValidationStatus] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [validationDetails, setValidationDetails] = useState('');
  const [tempoExcedido, setTempoExcedido] = useState(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleFileChange = async (event, source = 'default') => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('📱 Arquivo selecionado via:', source, 'às', new Date().toISOString());

    // Resetar estado
    setFileName(file.name);
    setValidationStatus('validating');
    setValidationMessage('Validando TEMPO do comprovante...');
    setValidationDetails('Verificando se foi enviado em até 5 minutos...');
    setTempoExcedido(null);

    // Validações básicas
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setValidationStatus('error');
      setValidationMessage('❌ Formato não suportado');
      return;
    }

    if (file.size > maxSize) {
      setValidationStatus('error');
      setValidationMessage('❌ Imagem muito grande');
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setTimeout(() => {
        validateFile(file);
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  const validateFile = async (file) => {
    try {
      console.log('🔍 Validando arquivo:', file.name);
      
      setValidationMessage('Verificando tempo do comprovante...');
      setValidationDetails('Analisando data/hora da transação...');
      
      // Importar dinamicamente o serviço OCR atual
      const paymentControlModule = await import('../../services/paymentControl.js');
      const PaymentControlService = paymentControlModule.default;
      
      const resultado = await PaymentControlService.processarArquivo(file);
      console.log('📊 Resultado OCR:', resultado);
      
      // Extrair texto do OCR (ajuste conforme sua implementação)
      const ocrText = resultado.ocrText || resultado.textoExtraido || '';
      
      // ========== VALIDAÇÕES PIX ==========
      if (ocrText && ocrText.trim().length > 20) {
        console.log('🔍 Iniciando validações PIX...');
        
        try {
          const pixValidation = await validatePaymentReceipt(ocrText);
          console.log('✅ Resultado validação PIX:', pixValidation);
          
          if (!pixValidation.isValid) {
            // PAGAMENTO REJEITADO PELAS REGRAS PIX
            setValidationStatus('error');
            setValidationMessage('❌ Pagamento não aprovado');
            
            let errorDetails = '🚫 PAGAMENTO REJEITADO:\n\n';
            pixValidation.errors.forEach((error, index) => {
              errorDetails += `${index + 1}. ${error}\n`;
            });
            
            errorDetails += '\n📋 REQUISITOS PARA APROVAÇÃO:\n';
            errorDetails += '✅ Favorecido: GUSTAVO SANTOS RIBEIRO ou GUSTAVO S RIBEIRO\n';
            errorDetails += '✅ Valor mínimo: R$ 10,00\n';
            errorDetails += '✅ Comprovante enviado em até 5 minutos\n';
            errorDetails += '✅ ID de transação único (não repetido)\n\n';
            errorDetails += '🔄 SOLUÇÃO: Faça um novo pagamento atendendo todos os requisitos acima.';
            
            setValidationDetails(errorDetails);
            return; // Para a execução aqui
          }
          
          // PAGAMENTO PIX VÁLIDO!
          console.log('✅ Pagamento PIX validado com sucesso!');
          
          // Se o OCR também validou, mostrar tudo
          if (resultado.valido) {
            setValidationStatus('success');
            setValidationMessage('✅ Pagamento validado!');
            
            let details = '🎉 TODAS AS VALIDAÇÕES APROVADAS!\n\n';
            details += '📋 VALIDAÇÃO PIX:\n';
            details += `✓ Favorecido: ${pixValidation.extractedData.beneficiary || 'Validado'}\n`;
            details += `✓ Valor: R$ ${pixValidation.extractedData.amount?.toFixed(2) || 'Validado'}\n`;
            details += `✓ ID Transação: ${pixValidation.extractedData.transactionId || 'Gerado'}\n`;
            details += `✓ Data/Hora: Dentro do prazo (5 minutos)\n\n`;
            
            if (resultado.dados?.textoEncontrado) {
              details += '📄 INFORMAÇÕES DO COMPROVANTE:\n';
              resultado.dados.textoEncontrado.forEach(item => {
                details += `• ${item}\n`;
              });
            }
            
            if (resultado.tempoRestante !== undefined) {
              details += `\n⏰ Restam ${resultado.tempoRestante} minutos do prazo total.`;
            }
            
            setValidationDetails(details);
            
            // Salvar transação no localStorage
            localStorage.setItem('ultimoPagamentoValido', JSON.stringify({
              transactionId: pixValidation.extractedData.transactionId,
              amount: pixValidation.extractedData.amount,
              validatedAt: new Date().toISOString(),
              fileName: file.name
            }));
            
            // Gerar ID único
            const paymentId = `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Liberar consulta após 2 segundos
            setTimeout(() => {
              if (onValidationComplete) {
                onValidationComplete({
                  ...resultado,
                  ...pixValidation,
                  paymentId,
                  fileName: file.name,
                  fileSize: file.size,
                  validatedAt: new Date().toISOString()
                });
              }
            }, 2000);
          }
          
        } catch (pixError) {
          console.warn('⚠️ Erro específico na validação PIX:', pixError);
          // Continua com validação normal se der erro
        }
      }
      // ========== FIM VALIDAÇÕES PIX ==========
      
      // Se não tem texto OCR suficiente ou validação PIX não foi executada,
      // continua com validação normal (seu código atual)
      if (resultado.valido && !validationStatus) {
        setValidationStatus('success');
        setValidationMessage('✅ Pagamento validado!');
        
        let details = '✅ COMPROVANTE DENTRO DO PRAZO!\n\n';
        if (resultado.dados?.textoEncontrado) {
          resultado.dados.textoEncontrado.forEach(item => {
            details += `✓ ${item}\n`;
          });
        }
        
        if (resultado.tempoRestante !== undefined) {
          details += `\n⏰ Restam apenas ${resultado.tempoRestante} minutos do prazo total.`;
        }
        
        setValidationDetails(details);
        
        const paymentId = `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        if (onValidationComplete) {
          onValidationComplete({
            ...resultado,
            paymentId: paymentId,
            fileName: file.name,
            fileSize: file.size,
            validatedAt: new Date().toISOString()
          });
        }
      } else if (!resultado.valido && !validationStatus) {
        // Tratar erro de tempo (seu código atual)
        if (resultado.motivo === 'TEMPO_EXCEDIDO' || resultado.mensagem?.includes('EXPIRADO')) {
          setValidationStatus('error');
          setValidationMessage('🚨 COMPROVANTE EXPIRADO!');
          setTempoExcedido(resultado.tempoExcedido);
          
          let details = '⏰ ⚠️ COMPROVANTE FORA DO PRAZO (5 minutos)\n\n';
          details += '🔄 FAÇA UM NOVO PAGAMENTO E ENVIE EM ATÉ 5 MINUTOS\n';
          setValidationDetails(details);
        } else {
          setValidationStatus('error');
          setValidationMessage('❌ Atenção: Dados incompletos');
          
          if (resultado.dados?.textoEncontrado) {
            let details = 'Encontramos no seu comprovante:\n\n';
            resultado.dados.textoEncontrado.forEach(item => {
              details += `✅ ${item}\n`;
            });
            
            const faltando = [];
            if (!resultado.dados.valor) faltando.push('• Valor pago (R$ 10,00 ou mais)');
            if (!resultado.dados.confirmacao) faltando.push('• Confirmação "PIX realizado"');
            if (!resultado.dados.dataHora) faltando.push('• Data e hora da transação');
            
            if (faltando.length > 0) {
              details += '\n⚠️ Faltando para validação:\n';
              faltando.forEach(item => {
                details += `   ${item}\n`;
              });
            }
            
            details += '\n📸 Dicas para Android:\n';
            details += '   • Aumente o brilho da tela\n';
            details += '   • Tire foto em ambiente claro\n';
            details += '   • Envie em ATÉ 5 MINUTOS\n';
            
            setValidationDetails(details);
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Erro na validação:', error);
      setValidationStatus('error');
      setValidationMessage('❌ Erro ao processar comprovante');
      setValidationDetails('Tente novamente com uma imagem mais nítida.');
    }
  };

  // O restante do seu componente (render, etc.) permanece igual...
  // Copie da linha 150 até o final do seu arquivo original
  
            setValidationDetails(details);
          } else {
            setValidationDetails(resultado.mensagem || 'Não foi possível ler o comprovante.');
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro na validação:', error);
      setValidationStatus('error');
      setValidationMessage('❌ Erro no processamento');
      setValidationDetails('Tente novamente com uma imagem mais nítida.');
    }
  };

  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const openGallery = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  const removeFile = () => {
    setPreview(null);
    setFileName('');
    setValidationStatus(null);
    setValidationMessage('');
    setValidationDetails('');
    setTempoExcedido(null);
  };

  const formatDetails = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* ALERTA DE TEMPO CRÍTICO */}
      <div className="bg-gradient-to-r from-red-900/30 to-rose-900/30 rounded-xl p-3 border border-red-500/40">
        <div className="flex items-center gap-2 mb-1">
          <Ban className="w-5 h-5 text-red-400 animate-pulse" />
          <p className="text-red-300 font-bold text-sm">🚨 REGRA INQUEBRÁVEL:</p>
        </div>
        <p className="text-red-200 text-xs font-semibold">
          • NÃO ACEITAMOS comprovantes com mais de 5 MINUTOS
        </p>
        <p className="text-red-200 text-xs">
          • Se passar de 5 minutos: <span className="font-bold">NOVO PAGAMENTO OBRIGATÓRIO</span>
        </p>
      </div>

      {/* Preview da imagem */}
      {preview && (
        <div className="relative">
          <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden border border-purple-500/20">
            <img 
              src={preview} 
              alt="Preview do comprovante" 
              className="w-full h-32 md:h-48 object-contain"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 p-1.5 md:p-2 bg-black/70 hover:bg-black/90 rounded-full transition-colors"
            >
              <X className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-1 truncate">{fileName}</p>
        </div>
      )}

      {/* Status da validação */}
      {validationStatus && (
        <div className={`p-3 md:p-4 rounded-lg ${
          validationStatus === 'success' 
            ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30' 
            : validationStatus === 'error'
            ? tempoExcedido 
              ? 'bg-gradient-to-r from-red-900/30 to-rose-900/30 border border-red-500/40 animate-pulse'
              : 'bg-gradient-to-r from-red-900/20 to-rose-900/20 border border-red-500/30'
            : 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30'
        }`}>
          <div className="flex items-start gap-2">
            {validationStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />}
            {validationStatus === 'error' && tempoExcedido && <Ban className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />}
            {validationStatus === 'error' && !tempoExcedido && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
            {validationStatus === 'validating' && <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0 mt-0.5" />}
            <div className="flex-1">
              <p className={`font-bold text-sm md:text-base mb-1 ${
                validationStatus === 'success' ? 'text-green-300' :
                validationStatus === 'error' ? (tempoExcedido ? 'text-red-300' : 'text-red-300') :
                'text-blue-300'
              }`}>
                {validationMessage}
              </p>
              {validationDetails && (
                <div className="mt-2 p-2 bg-black/30 rounded">
                  <div className="flex items-start gap-1 mb-1">
                    <Info className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-xs md:text-sm whitespace-pre-line">
                      {formatDetails(validationDetails)}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Mostrar tempo excedido em segundos */}
              {tempoExcedido && (
                <div className="mt-3 p-2 bg-red-900/40 rounded border border-red-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-400" />
                      <span className="text-red-300 text-sm font-semibold">
                        Excedido por:
                      </span>
                    </div>
                    <div className="text-red-400 font-bold">
                      {Math.ceil(tempoExcedido / 60)} minutos
                    </div>
                  </div>
                  <p className="text-red-300 text-xs mt-1">
                    ({tempoExcedido} segundos além do limite)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botões de upload */}
      {!preview && (
        <>
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileChange(e, 'camera')}
            className="hidden"
          />
          <input
            type="file"
            ref={galleryInputRef}
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'gallery')}
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <button
              onClick={openCamera}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-2.5 md:py-3 px-3 md:px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-sm md:text-base"
            >
              <Camera className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden xs:inline">Tirar Foto</span>
              <span className="xs:hidden">Câmera</span>
            </button>

            <button
              onClick={openGallery}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-2.5 md:py-3 px-3 md:px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-sm md:text-base border border-white/10"
            >
              <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden xs:inline">Galeria</span>
              <span className="xs:hidden">Arquivo</span>
            </button>
          </div>

          {/* Instruções CRÍTICAS sobre tempo */}
          <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl p-3 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <p className="text-amber-300 font-bold text-sm">CRONÔMETRO LIGADO!</p>
            </div>
            <ul className="text-amber-200 text-xs space-y-1">
              <li className="flex items-start gap-1">
                <span className="text-red-400 font-bold">⏱️</span>
                <span><strong>5 MINUTOS</strong> após pagar → Envie IMEDIATAMENTE</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-red-400 font-bold">🚫</span>
                <span><strong>5 MINUTOS + 1 SEGUNDO</strong> → COMPROVANTE REJEITADO</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-red-400 font-bold">🔄</span>
                <span>Se rejeitado: <strong>NOVO PAGAMENTO OBRIGATÓRIO</strong></span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-green-400 font-bold">✅</span>
                <span>Sugestão: Pagar → Tirar print → Enviar TUDO EM 2 MINUTOS</span>
              </li>
            </ul>
          </div>
        </>
      )}

      {/* Botão Cancelar */}
      <button
        onClick={onCancel}
        className="w-full py-2.5 md:py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 font-medium rounded-lg border border-gray-700 transition-all active:scale-95 text-sm md:text-base"
      >
        Cancelar
      </button>
    </div>
  );
};

export default PaymentUploader;
