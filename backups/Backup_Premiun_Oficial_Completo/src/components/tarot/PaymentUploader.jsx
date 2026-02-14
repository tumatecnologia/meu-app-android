import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import PaymentControlService from '../../services/paymentControl.js';

const PaymentUploader = ({ onValidationComplete, onCancel }) => {
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setProcessando(true);
    setResultado(null);

    try {
      const res = await PaymentControlService.processarArquivo(file);
      setResultado(res);
      setProcessando(false);

      if (res.valido) {
        if (onValidationComplete) {
          onValidationComplete(res);
        }
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      setProcessando(false);
      setResultado({
        valido: false,
        motivo: 'Erro ao processar o arquivo. Tente novamente.'
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*,application/pdf"
        className="hidden"
      />

      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <Upload className="w-6 h-6 text-purple-400" />
          Comprovante de Pagamento
        </h2>

        <div
          onClick={() => !processando && fileInputRef.current?.click()}
          className={`
            relative group cursor-pointer
            p-8 border-2 border-dashed rounded-xl
            transition-all duration-300
            ${processando ? 'border-amber-500/50 bg-amber-500/5' : 
              resultado?.valido ? 'border-green-500/50 bg-green-500/5' :
              'border-purple-500/30 hover:border-purple-500/60 bg-purple-500/5'}
          `}
        >
          {processando ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
              <p className="text-amber-200 font-medium italic">Analisando comprovante...</p>
            </div>
          ) : resultado?.valido ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="text-green-200 font-bold">Comprovante Validado!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-purple-400" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-medium">Clique para selecionar</p>
                <p className="text-xs text-gray-400 italic">PNG, JPG ou PDF</p>
              </div>
            </div>
          )}
        </div>

        {resultado && !resultado.valido && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200 text-left">{resultado.motivo}</p>
          </div>
        )}

        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white text-sm transition-colors underline underline-offset-4"
        >
          Voltar para instruções
        </button>
      </div>
    </div>
  );
};

export default PaymentUploader;
