import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, XCircle, FileText, AlertCircle, Loader2 } from 'lucide-react';
import PaymentControlService from '../../services/paymentControl';

const PaymentUploader = ({ onUploadSuccess, onUploadError, theme, amount = 10.00 }) => {
  const [uploading, setUploading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setValidationResult(null);
    setFileInfo(null);

    try {
      // 1. Validar comprovante
      const validation = await PaymentControlService.validatePaymentProof(file);
      
      setValidationResult(validation);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2), // MB
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleDateString('pt-BR')
      });

      if (!validation.valid) {
        setUploading(false);
        if (onUploadError) onUploadError(validation.error);
        return;
      }

      // 2. Simular upload (em produção, enviar para servidor)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Registrar no PaymentControl
      const paymentRecord = await PaymentControlService.createPaymentControl({
        hash_arquivo: validation.hash,
        nome_arquivo: file.name,
        id_transacao: `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'ativo'
      });

      // 4. Notificar sucesso
      setUploading(false);
      if (onUploadSuccess) {
        onUploadSuccess({
          paymentRecord,
          file,
          validation
        });
      }

    } catch (error) {
      console.error('Erro no upload:', error);
      setUploading(false);
      setValidationResult({
        valid: false,
        error: error.message || 'Erro ao processar arquivo'
      });
      if (onUploadError) onUploadError(error.message);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Área de Upload */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <motion.button
          whileHover={{ scale: uploading ? 1 : 1.02 }}
          whileTap={{ scale: uploading ? 1 : 0.98 }}
          onClick={triggerFileInput}
          disabled={uploading}
          className={`w-full p-8 rounded-2xl border-2 border-dashed transition-all ${
            uploading
              ? 'border-amber-400/50 bg-amber-400/10 cursor-wait'
              : validationResult?.valid
              ? 'border-green-500/50 bg-green-500/10 hover:border-green-500 hover:bg-green-500/20 cursor-pointer'
              : 'border-purple-400/50 bg-white/5 hover:border-amber-400 hover:bg-white/10 cursor-pointer'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
                <div className="text-center">
                  <p className="text-white font-medium">Validando comprovante...</p>
                  <p className="text-purple-300 text-sm mt-1">Por favor, aguarde</p>
                </div>
              </>
            ) : validationResult?.valid ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-500" />
                <div className="text-center">
                  <p className="text-white font-medium">Comprovante válido!</p>
                  <p className="text-green-400 text-sm mt-1">Clique para enviar outro</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-purple-400" />
                <div className="text-center">
                  <p className="text-white font-medium text-lg">
                    Envie o comprovante do PIX
                  </p>
                  <p className="text-purple-300 text-sm mt-2">
                    Clique aqui ou arraste o arquivo
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-3 text-xs text-purple-400">
                    <span>JPG, PNG ou PDF</span>
                    <span>•</span>
                    <span>Máx. 5MB</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.button>
      </div>

      {/* Informações do Pagamento */}
      <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          Informações do Pagamento
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-purple-300 text-sm">Valor:</p>
            <p className="text-white font-bold text-xl">R$ {amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-purple-300 text-sm">Tema:</p>
            <p className="text-white font-medium capitalize">
              {theme === 'amor' ? 'Amor' :
               theme === 'carreira' ? 'Carreira' :
               theme === 'financas' ? 'Finanças' :
               theme === 'espiritualidade' ? 'Espiritualidade' :
               theme === 'saude' ? 'Saúde' :
               theme === 'traicao' ? 'Traição' :
               theme === 'casamento' ? 'Casamento' :
               theme === 'viagem' ? 'Viagem' :
               theme === 'noivado' ? 'Noivado' :
               theme === 'conselho' ? 'Conselho' :
               theme === 'justica' ? 'Justiça' : theme}
            </p>
          </div>
          <div>
            <p className="text-purple-300 text-sm">Status:</p>
            <p className={`font-medium ${
              validationResult?.valid ? 'text-green-400' : 'text-amber-400'
            }`}>
              {validationResult?.valid ? '✅ Válido' : '⏳ Aguardando'}
            </p>
          </div>
          <div>
            <p className="text-purple-300 text-sm">Formato:</p>
            <p className="text-white">JPG, PNG, PDF</p>
          </div>
        </div>
      </div>

      {/* Informações do Arquivo (se enviado) */}
      {fileInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="overflow-hidden"
        >
          <div className={`rounded-xl p-5 ${
            validationResult?.valid
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <div className="flex items-start gap-3">
              {validationResult?.valid ? (
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              )}
              
              <div className="flex-1">
                <h5 className="font-medium text-white mb-2">
                  {validationResult?.valid ? 'Arquivo válido' : 'Problema no arquivo'}
                </h5>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Nome:</span>
                    <span className="text-white font-mono truncate max-w-[200px]">
                      {fileInfo.name}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-purple-300">Tamanho:</span>
                    <span className="text-white">{fileInfo.size} MB</span>
                  </div>
                  
                  {validationResult?.error && (
                    <div className="mt-3 p-3 bg-red-500/20 rounded-lg">
                      <p className="text-red-300 text-sm">{validationResult.error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instruções Simplificadas */}
      <div className="mt-6 pt-6 border-t border-purple-400/30">
        <h5 className="text-white font-medium mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          Instrução importante:
        </h5>
        <ul className="space-y-2 text-sm text-purple-300">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span>Após validação, sua leitura será liberada</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentUploader;
