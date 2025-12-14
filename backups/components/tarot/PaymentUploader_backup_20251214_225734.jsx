import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const PaymentUploader = ({ onValidationComplete, onCancel }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [validationStatus, setValidationStatus] = useState(null); // null, 'validating', 'success', 'error'
  const [validationMessage, setValidationMessage] = useState('');
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Detectar dispositivo
  const isIOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  };

  const isAndroid = () => {
    return /Android/.test(navigator.userAgent);
  };

  const handleFileChange = async (event, source = 'default') => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('📱 Arquivo selecionado via:', source, 'Dispositivo:', isIOS() ? 'iOS' : (isAndroid() ? 'Android' : 'Desktop'));

    // Resetar estado
    setFileName(file.name);
    setValidationStatus('validating');
    setValidationMessage('Validando comprovante...');

    // Validações básicas
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setValidationStatus('error');
      setValidationMessage('❌ Formato não suportado. Use JPG, PNG ou WebP.');
      return;
    }

    if (file.size > maxSize) {
      setValidationStatus('error');
      setValidationMessage('❌ Imagem muito grande. Máximo 10MB.');
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      
      // Iniciar validação automática
      setTimeout(() => {
        validateFile(file);
      }, 500);
    };
    reader.readAsDataURL(file);

    // Resetar inputs
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const validateFile = async (file) => {
    try {
      console.log('🔍 Iniciando validação automática do comprovante...');
      
      // Mostrar mensagem de análise OCR
      setValidationMessage('Analisando imagem com OCR...');
      
      // Importar dinamicamente para evitar problemas de circular dependency
      const paymentControlModule = await import('../../services/paymentControl.js');
      const PaymentControlService = paymentControlModule.default;
      
      const resultado = await PaymentControlService.processarArquivo(file);
      console.log('📊 Resultado da validação:', resultado);
      
      if (resultado.valido) {
        setValidationStatus('success');
        setValidationMessage('✅ Pagamento validado com sucesso!');
        
        // Gerar ID único para o pagamento
        const paymentId = `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Notificar o componente pai
        if (onValidationComplete) {
          onValidationComplete({
            ...resultado,
            paymentId: paymentId,
            fileName: file.name,
            fileSize: file.size,
            validatedAt: new Date().toISOString()
          });
        }
      } else {
        setValidationStatus('error');
        setValidationMessage(`❌ ${resultado.mensagem}`);
      }
    } catch (error) {
      console.error('❌ Erro na validação:', error);
      setValidationStatus('error');
      setValidationMessage('❌ Erro ao processar comprovante. Tente novamente.');
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
  };

  return (
    <div className="space-y-4">
      {/* Preview da imagem */}
      {preview && (
        <div className="relative">
          <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden border border-purple-500/20">
            <img 
              src={preview} 
              alt="Preview do comprovante" 
              className="w-full h-48 object-contain"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/90 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-1 truncate">{fileName}</p>
        </div>
      )}

      {/* Status da validação */}
      {validationStatus && (
        <div className={`p-3 rounded-lg ${
          validationStatus === 'success' 
            ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30' 
            : validationStatus === 'error'
            ? 'bg-gradient-to-r from-red-900/20 to-rose-900/20 border border-red-500/30'
            : 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30'
        }`}>
          <div className="flex items-center gap-2">
            {validationStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
            {validationStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
            {validationStatus === 'validating' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
            <p className={`font-medium text-sm ${
              validationStatus === 'success' ? 'text-green-300' :
              validationStatus === 'error' ? 'text-red-300' :
              'text-blue-300'
            }`}>
              {validationMessage}
            </p>
          </div>
        </div>
      )}

      {/* Botões de upload (mostrar apenas se não houver preview) */}
      {!preview && (
        <>
          {/* Inputs ocultos */}
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

          {/* Botões de ação */}
          <div className="grid grid-cols-2 gap-3">
            {/* Botão Câmera */}
            <button
              onClick={openCamera}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Camera className="w-5 h-5" />
              Tirar Foto
            </button>

            {/* Botão Galeria */}
            <button
              onClick={openGallery}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/10"
            >
              <ImageIcon className="w-5 h-5" />
              Galeria
            </button>
          </div>

          {/* Área de arrastar e soltar */}
          <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
               onClick={openGallery}>
            <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="text-white font-medium mb-1">Arraste e solte o comprovante aqui</p>
            <p className="text-purple-300 text-sm">ou clique para selecionar</p>
            <p className="text-gray-400 text-xs mt-2">Formatos: JPG, PNG, WebP • Máx: 10MB</p>
          </div>
        </>
      )}

      {/* Botão Cancelar */}
      <button
        onClick={onCancel}
        className="w-full py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 font-medium rounded-lg border border-gray-700 transition-all active:scale-95"
      >
        Cancelar
      </button>
    </div>
  );
};

export default PaymentUploader;
