import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, RefreshCw, Home } from 'lucide-react';
import { validatePayment } from "../../services/pixValidator.js";

// Função para gerar hash simples de uma string
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).substring(0, 8);
};


const PaymentUploader = ({ onValidationComplete, onCancel, onNewPayment }) => {
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
    console.log('📄 Nome do arquivo:', file.name);

    // Resetar estado
    setFileName(file.name);
    setValidationStatus('validating');
    setValidationMessage('Processando comprovante...');
    setValidationDetails('Verificando validade do comprovante...');
    setTempoExcedido(null);

    // Validações básicas
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setValidationStatus('error');
      setValidationMessage('❌ Formato não suportado');
      setValidationDetails('Use apenas imagens JPG, PNG ou WebP');
      return;
    }

    if (file.size > maxSize) {
      setValidationStatus('error');
      setValidationMessage('❌ Imagem muito grande');
      setValidationDetails('Tamanho máximo: 10MB');
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
  // VALIDAÇÃO COM SISTEMA PIX
  // ============================================
  const validateFileWithPIXSystem = async (file) => {
    try {
      setValidationStatus('validating');
      setValidationMessage('Analisando comprovante...');
      setValidationDetails('Extraindo informações do PIX...');

      // Extrair dados do comprovante
      const extractedData = await simulateOCRDataExtraction(file);
      
      console.log('📋 Dados extraídos do comprovante:', extractedData);

      // Validar com sistema PIX
      setValidationMessage('Validando com sistema PIX...');
      setValidationDetails('Aplicando as 5 situações de validação...');

      const pixValidationResult = await validatePayment({
        transactionId: extractedData.transactionId,
        amount: extractedData.amount,
        payeeName: extractedData.beneficiary,
        paymentDate: extractedData.date
      });

      console.log('📊 Resultado validação PIX:', pixValidationResult);

      // Aplicar resultado
      if (pixValidationResult.approved) {
        // ✅ SITUAÇÃO 5: TUDO OK
        setValidationStatus('success');
        setValidationMessage('✅ Comprovante validado com sucesso!');
        setValidationDetails('Consulta liberada. Aguarde sua leitura...');
        
        // Preparar dados para liberar a consulta
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
          console.log('🚀 Liberando consulta...', successData);
          if (onValidationComplete) {
            onValidationComplete(successData);
          }
        }, 1500);

      } else {
        // ❌ SITUAÇÕES 1-4: RECUSADO
        setValidationStatus('error');
        
        // Personalizar mensagem baseada na situação específica
        let errorMsg = pixValidationResult.message;
        let errorDetails = pixValidationResult.details;
        
        setValidationMessage(errorMsg);
        setValidationDetails(errorDetails);
        
        // Adicionar instruções para o usuário
        setTimeout(() => {
          setValidationDetails(prev => prev + '\n\n🔧 Corrija o problema e envie um novo comprovante.');
        }, 1000);
      }

    } catch (error) {
      console.error('💥 Erro na validação:', error);
      setValidationStatus('error');
      setValidationMessage('❌ Erro no processamento');
      setValidationDetails(`Detalhes: ${error.message}\n\nTente novamente com outra imagem.`);
    }
  };

  // ============================================
  // SIMULAÇÃO DE EXTRAÇÃO OCR (CORRIGIDA)
  // ============================================
  const simulateOCRDataExtraction = async (file) => {
    console.log('📅 Extraindo dados do arquivo:', file.name);
    
    // VALOR MÍNIMO CORRETO: R$ 10,00
    const valorMinimo = 10.00;
    
    // CORREÇÃO: Extrair data do nome do arquivo
    let extractedDate = new Date().toISOString().split('T')[0];
    
    // Tentar extrair data do nome do arquivo
    const fileName = file.name;
    const dateMatch = fileName.match(/(\d{4})-(\d{2})-(\d{2})/);
    
    if (dateMatch) {
      // Formato: YYYY-MM-DD encontrado no nome do arquivo
      extractedDate = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
      console.log('📅 Data extraída do nome do arquivo:', extractedDate);
    } else {
      console.log('⚠️ Data não encontrada no nome do arquivo, usando data atual');
    }
    
    // Para testes: usar nome errado se arquivo contiver "erro_nome"
  // Para testes: usar valor errado se arquivo contiver "erro_valor"
  // ======================================================
  // CORREÇÃO: EXTRAIR VALOR DO NOME DO ARQUIVO
  // ======================================================
  let amount = 10.00; // Valor padrão inicial
  
  // Tentar extrair valor do nome do arquivo
  // Exemplos: "pix_10.50.jpg", "comprovante_15,00.png", "valor_7.99.pdf"
  const valorMatch = fileName.match(/([0-9]+[,.][0-9]{2})/);
  if (valorMatch) {
    // Converter para número (substituir vírgula por ponto)
    const valorStr = valorMatch[0].replace(",", ".");
    amount = parseFloat(valorStr);
    console.log(`💰 Valor extraído do nome: R$ ${amount.toFixed(2)}`);
  } else if (fileName.toLowerCase().includes("erro_valor")) {
    amount = 5.00; // Para testes explícitos de erro
    console.log(`🧪 Teste de valor insuficiente: R$ ${amount.toFixed(2)}`);
  }
    // Hash ROBUSTO: nome + tamanho + MINUTO ATUAL (agrupa uploads próximos)
    const fileHash = simpleHash(fileName + '_SIZE_' + file.size + '_MIN_' + Math.floor(timestamp / 60000));
    console.log('✅ Hash gerado:', fileHash, 'Minuto:', Math.floor(timestamp / 60000));
    const transactionId = fileName.toLowerCase().includes('duplicado') 
      ? 'DUP_TEST_123'
      : 'PIX_' + fileHash;
    
    return {
      beneficiary: beneficiary,
      amount: amount,
      date: extractedDate, // DATA EXTRAÍDA DO ARQUIVO
      transactionId: transactionId,
      sourceFile: file.name
    };
  };

  // ============================================
  // FUNÇÕES AUXILIARES
  // ============================================
  const resetUpload = () => {
    setPreview(null);
    setFileName('');
    setValidationStatus(null);
    setValidationMessage('');
    setValidationDetails('');
    setTempoExcedido(null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const triggerCamera = () => {
    cameraInputRef.current?.click();
  };

  const triggerGallery = () => {
    galleryInputRef.current?.click();
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================
  return (
    <div className="w-full">
      {/* Área de Upload */}
      {!preview && !validationStatus && (
        <div className="border-2 border-dashed border-purple-400/50 rounded-2xl p-8 text-center bg-purple-950/30 mb-6">
          <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Envie seu comprovante PIX</h3>
          <p className="text-purple-300 mb-4">Valor mínimo: <strong className="text-amber-300">R$ 10,00</strong></p>
          <p className="text-purple-300 mb-6">Favorecido: <strong className="text-green-300">GUSTAVO SANTOS RIBEIRO</strong></p>
          
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

      {/* Botões de ação */}
      {preview && validationStatus !== 'success' && (
        <div className="space-y-3">
          <button
            onClick={() => {
              resetUpload();
              if (onCancel) onCancel();
            }}
            className="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 rounded-xl font-medium hover:from-gray-800 hover:to-gray-900 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Voltar para Home (Página Inicial)
          </button>
          
          <button
            onClick={() => {
              resetUpload();
              if (onNewPayment) onNewPayment();
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium hover:from-amber-700 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Novo Pagamento (Escolher Outro Tema)
          </button>
          
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-xs text-center text-red-300">
              ⚠️ Se o comprovante foi recusado, verifique:
              <br/>• Data do pagamento (deve ser hoje)
              <br/>• Valor mínimo (R$ 10,00) 
              <br/>• Nome do favorecido (GUSTAVO SANTOS RIBEIRO)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentUploader;
