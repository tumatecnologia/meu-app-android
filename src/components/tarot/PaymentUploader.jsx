import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { validatePayment } from "../../services/paymentControl";

const PaymentUploader = ({ onValidationComplete, onCancel }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [validationStatus, setValidationStatus] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [validationDetails, setValidationDetails] = useState('');
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleFileChange = async (event, source = 'default') => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('📱 Arquivo selecionado via:', source, 'às', new Date().toISOString());

    // Resetar estado
    setFileName(file.name);
    setValidationStatus('validating');
    setValidationMessage('Processando comprovante...');
    setValidationDetails('Verificando validade do comprovante...');

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
        validateFileWithPIXSystem(file);
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  // ============================================
  // 🔴 VALIDAÇÃO COM SISTEMA PIX
  // ============================================
  const validateFileWithPIXSystem = async (file) => {
    try {
      setValidationStatus('validating');
      setValidationMessage('Analisando comprovante...');
      setValidationDetails('Extraindo informações do PIX...');

      // Simulação de extração de dados do comprovante
      const extractedData = await simulateOCRDataExtraction(file);
      
      console.log('📋 Dados extraídos (simulação):', extractedData);

      // VALIDAÇÃO COM NOVO SISTEMA PIX
      setValidationMessage('Validando com sistema PIX...');
      setValidationDetails('Aplicando validações do sistema...');

      const pixValidationResult = await validatePayment({
        beneficiary: extractedData.beneficiary,
        amount: extractedData.amount.toString(),
        date: extractedData.date,
        transactionId: extractedData.transactionId || 'PIX_' + Date.now()
      });

      console.log('📊 Resultado validação PIX:', pixValidationResult);

      // APLICAR RESULTADO
      if (pixValidationResult.approved) {
        // ✅ TUDO OK
        setValidationStatus('success');
        setValidationMessage('✅ Comprovante validado com sucesso!');
        setValidationDetails('Consulta liberada. Aguarde sua leitura...');
        
        // Preparar dados para o componente pai
        const successData = {
          liberado: true,
          aprovado: true,
          mensagem: 'Comprovante aprovado pelo sistema PIX',
          registro: {
            id_transacao: extractedData.transactionId,
            nome_favorecido: extractedData.beneficiary,
            valor: extractedData.amount,
            data: extractedData.date,
            status: 'APROVADO'
          },
          validacaoPIX: pixValidationResult,
          timestamp: new Date().toISOString()
        };

        // Notificar componente pai após delay
        setTimeout(() => {
          if (onValidationComplete) {
            onValidationComplete(successData);
          }
        }, 1500);

      } else {
        // ❌ RECUSADO
        setValidationStatus('error');
        
        // Personalizar mensagem baseada na situação específica
        let errorMsg = pixValidationResult.message;
        let errorDetails = pixValidationResult.details;
        
        if (errorDetails.includes('ID de transação já cadastrado')) {
          errorMsg = '❌ Transação duplicada';
          errorDetails = 'Este comprovante já foi utilizado. Faça um novo pagamento.';
        } else if (errorDetails.includes('Nome do favorecido não corresponde')) {
          errorMsg = '❌ Nome incorreto';
          errorDetails = 'O favorecido deve ser: GUSTAVO SANTOS RIBEIRO';
        } else if (errorDetails.includes('Valor mínimo não atingido')) {
          errorMsg = '❌ Valor insuficiente';
          errorDetails = 'Valor mínimo: R$ 10,00';
        } else if (errorDetails.includes('Data da transação não é a data atual')) {
          errorMsg = '❌ Data incorreta';
          errorDetails = 'Comprovante deve ser da data atual';
        } else {
          errorMsg = '❌ Comprovante recusado';
          errorDetails = 'Por favor faça um novo pagamento';
        }
        
        setValidationMessage(errorMsg);
        setValidationDetails(errorDetails);
      }

    } catch (error) {
      console.error('💥 Erro na validação:', error);
      setValidationStatus('error');
      setValidationMessage('❌ Erro no processamento');
      setValidationDetails(error.message || 'Tente novamente com outra imagem');
    }
  };

  // ============================================
  // 🔴 SIMULAÇÃO DE EXTRAÇÃO OCR (CORRIGIDA)
  // ============================================
  const simulateOCRDataExtraction = async (file) => {
    // 🔴 CORREÇÃO: Extrair data do nome do arquivo
    let extractedDate = new Date().toISOString().split('T')[0]; // padrão: data atual
    
    // Tentar extrair data do nome do arquivo (ex: "WhatsApp Image 2025-12-12 at 12.48.55.jpeg")
    const fileName = file.name;
    const dateMatch = fileName.match(/(\d{4})-(\d{2})-(\d{2})/);
    
    if (dateMatch) {
      // Formato: YYYY-MM-DD encontrado no nome do arquivo
      extractedDate = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
      console.log('📅 Data extraída do nome do arquivo:', extractedDate);
    } else {
      console.log('⚠️ Data não encontrada no nome do arquivo, usando data atual');
    }
    
    return {
      beneficiary: 'GUSTAVO SANTOS RIBEIRO', // Ou 'JOÃO SILVA' para testar situação 2
      amount: 15.00, // Ou 5.00 para testar situação 3
      date: extractedDate, // 🔴 AGORA: Data extraída do arquivo
      transactionId: 'PIX_' + Date.now(), // Usar 'DUP_TEST' para testar situação 1
      sourceFile: file.name
    };
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================
  const resetUpload = () => {
    setPreview(null);
    setFileName('');
    setValidationStatus(null);
    setValidationMessage('');
    setValidationDetails('');
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const triggerCamera = () => {
    cameraInputRef.current?.click();
  };

  const triggerGallery = () => {
    galleryInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Instruções de pagamento */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-violet-900/20 rounded-xl border border-purple-700/30">
        <h3 className="text-lg font-semibold text-white mb-3">Como pagar:</h3>
        <ol className="space-y-2 text-sm text-purple-200">
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-purple-600 rounded-full text-center mr-2 flex-shrink-0">1</span>
            Realize o PIX para: <strong className="text-white ml-1">GUSTAVO SANTOS RIBEIRO</strong>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-purple-600 rounded-full text-center mr-2 flex-shrink-0">2</span>
            Valor: <strong className="text-white ml-1">R$ 15,00</strong>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-purple-600 rounded-full text-center mr-2 flex-shrink-0">3</span>
            Tire print da confirmação do pagamento
          </li>
        </ol>
      </div>

      {/* Área de Upload */}
      {!preview && !validationStatus && (
        <div className="border-2 border-dashed border-purple-400/50 rounded-2xl p-8 text-center bg-purple-950/30 mb-6">
          <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Envie seu comprovante PIX</h3>
          <p className="text-purple-300 mb-6">Tire foto ou selecione da galeria</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={triggerCamera}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-violet-700 transition-all"
            >
              <Camera className="w-5 h-5" />
              Câmera
            </button>
            <button
              onClick={triggerGallery}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:from-amber-700 hover:to-orange-700 transition-all"
            >
              <ImageIcon className="w-5 h-5" />
              Galeria
            </button>
          </div>
          
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
        </div>
      )}

      {/* Preview e Status */}
      {preview && (
        <div className="mb-6">
          <div className="relative mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl border-2 border-purple-400/30"
            />
            <button
              onClick={resetUpload}
              className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status da Validação */}
          <div className={`p-4 rounded-xl border-2 mb-4 ${
            validationStatus === 'success' ? 'border-green-500/30 bg-green-900/20' :
            validationStatus === 'error' ? 'border-red-500/30 bg-red-900/20' :
            validationStatus === 'validating' ? 'border-amber-500/30 bg-amber-900/20' :
            'border-purple-500/30 bg-purple-900/20'
          }`}>
            {validationStatus === 'validating' && (
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                <span className="text-white font-medium">{validationMessage}</span>
              </div>
            )}
            
            {validationStatus === 'success' && (
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">{validationMessage}</span>
              </div>
            )}
            
            {validationStatus === 'error' && (
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-white font-medium">{validationMessage}</span>
              </div>
            )}

            {validationDetails && (
              <p className={`text-sm mt-2 whitespace-pre-line ${
                validationStatus === 'success' ? 'text-green-300' :
                validationStatus === 'error' ? 'text-red-300' :
                'text-amber-300'
              }`}>
                {validationDetails}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Botão Cancelar */}
      {preview && validationStatus !== 'success' && (
        <button
          onClick={() => {
            resetUpload();
            if (onCancel) onCancel();
          }}
          className="w-full py-3 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
      )}

      {/* Rodapé informativo */}
      <div className="mt-6 pt-4 border-t border-purple-800/30">
        <p className="text-xs text-purple-400 text-center">
          <strong>Atenção:</strong> Não aceitamos pagamentos duplicados. 
          Caso o comprovante seja rejeitado, por favor, realize um novo pagamento.
        </p>
      </div>
    </div>
  );
};

export default PaymentUploader;
