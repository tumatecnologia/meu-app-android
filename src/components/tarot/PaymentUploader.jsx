import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import PaymentControlService from '../../services/paymentControl.js';

const PaymentUploader = ({ onUploadSuccess, onUploadError }) => {
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setProcessando(true);
    setResultado(null);

    try {
      console.log('🔄 PROCESSANDO:', file.name);
      
      const resultado = await PaymentControlService.processarArquivo(file);
      
      setResultado(resultado);
      setProcessando(false);

      if (resultado.valido) {
        console.log('✅ SUCESSO - Liberando consulta');
        if (onUploadSuccess) {
          onUploadSuccess({
            liberado: true,
            registro: resultado.registro,
            mensagem: resultado.mensagem
          });
        }
      } else {
        console.log('❌ ERRO - Bloqueando consulta');
        if (onUploadError) {
          onUploadError(resultado.motivo || 'Comprovante inválido');
        }
      }

    } catch (error) {
      console.error('💥 ERRO CRÍTICO:', error);
      setProcessando(false);
      setResultado({ valido: false, motivo: 'Erro no sistema' });
      if (onUploadError) onUploadError('Erro no sistema');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xs mx-auto p-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        disabled={processando}
      />
      
      <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 backdrop-blur-sm rounded-xl border border-purple-500/20 p-3 shadow-md">
        
        {/* Header ultra-compacto */}
        <div className="text-center mb-3">
          <h2 className="text-lg font-bold text-white mb-1">
            📱 Comprovante
          </h2>
          <p className="text-purple-200 text-[11px]">
            Tire foto ou selecione o arquivo
          </p>
        </div>

        {/* Área de Upload ultra-compacta */}
        <div 
          onClick={triggerFileInput}
          className={`relative rounded-lg border border-dashed transition-all duration-150
            ${processando 
              ? 'border-amber-500/40 bg-amber-500/5 cursor-wait' 
              : resultado?.valido 
                ? 'border-green-500/40 bg-green-500/5 cursor-default'
                : 'border-purple-400/60 hover:border-purple-300 hover:bg-purple-500/5 cursor-pointer'
            }
            p-3
            min-h-[100px]
            flex flex-col items-center justify-center`}
          disabled={processando}
        >
          {processando ? (
            <div className="flex flex-col items-center space-y-1">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-white text-sm">Processando...</p>
            </div>
          ) : resultado?.valido ? (
            <div className="flex flex-col items-center space-y-1">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <p className="text-white text-sm font-bold">✅ APROVADO</p>
            </div>
          ) : resultado?.valido === false ? (
            <div className="flex flex-col items-center space-y-1">
              <XCircle className="w-8 h-8 text-red-500" />
              <p className="text-white text-sm font-bold">❌ REPROVADO</p>
              <p className="text-red-400 text-[10px] text-center px-1">
                {resultado.motivo || 'Comprovante inválido'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-2 rounded-full bg-purple-500/15">
                <Upload className="w-6 h-6 text-purple-300" />
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-bold">
                  CLIQUE AQUI
                </p>
                <p className="text-purple-300 text-[10px]">
                  para enviar
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Preview da Imagem ultra-compacto */}
        {preview && !processando && !resultado?.valido && (
          <div className="mt-2 rounded overflow-hidden border border-purple-500/15 bg-black/5">
            <div className="p-1 bg-purple-900/15">
              <span className="text-white text-[10px] font-medium">Prévia:</span>
            </div>
            <div className="p-1">
              <img 
                src={preview} 
                alt="Preview"
                className="w-full h-auto max-h-[80px] object-contain rounded-sm"
              />
            </div>
          </div>
        )}

        {/* Instruções ultra-compactas */}
        <div className="mt-3 bg-black/10 rounded p-2 border border-amber-500/5">
          <h3 className="text-xs font-bold text-amber-300 mb-1">
            ⚠️ Importante
          </h3>
          <ul className="space-y-0.5">
            <li className="flex items-start">
              <span className="text-amber-400 text-[10px] mt-0.5 mr-1">•</span>
              <span className="text-white text-[10px]">R$ 10,00 exatos</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-400 text-[10px] mt-0.5 mr-1">•</span>
              <span className="text-white text-[10px]">Data de hoje</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-400 text-[10px] mt-0.5 mr-1">•</span>
              <span className="text-white text-[10px]">Para: Gustavo</span>
            </li>
          </ul>
        </div>

        {/* Botão de ação ultra-compacto */}
        {!processando && !resultado?.valido && (
          <button
            onClick={triggerFileInput}
            className="w-full mt-2 py-1.5 px-3 rounded-md bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-xs transition-all active:scale-95"
          >
            📁 Selecionar
          </button>
        )}

        {/* Mensagem de erro ultra-compacta */}
        {resultado && !resultado.valido && (
          <div className="mt-2 p-2 bg-red-500/5 border border-red-500/15 rounded-md">
            <div className="flex items-start">
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5 mr-1" />
              <div>
                <p className="text-red-400 text-xs font-bold">
                  Não aprovado
                </p>
                <p className="text-red-300 text-[10px]">
                  {resultado.motivo || 'Verifique os dados'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instrução final minimalista */}
        <div className="mt-2 pt-2 border-t border-white/5">
          <p className="text-purple-300 text-[10px] text-center">
            PIX de R$ 10,00 para Gustavo
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentUploader;
