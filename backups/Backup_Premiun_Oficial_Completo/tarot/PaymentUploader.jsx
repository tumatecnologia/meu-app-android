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

    const reader = new FileReader();
    reader.onloadend = () => { setPreview(reader.result); };
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
      setProcessando(false);
      setResultado({ valido: false, motivo: 'Erro no sistema' });
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto p-2">
      {/* CORREÇÃO AQUI: accept explícito para image/* e application/pdf sem o capture */}
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*,application/pdf" 
        onChange={handleFileSelect} 
        className="hidden" 
        disabled={processando} 
      />
      
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 shadow-md text-center">
        <h2 className="text-lg font-bold text-white mb-4">📱 Enviar Comprovante</h2>
        
        <div onClick={() => !processando && fileInputRef.current?.click()} className={`p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${processando ? 'border-amber-500 bg-amber-500/10' : 'border-purple-500/50 hover:bg-purple-500/10'}`}>
          {processando ? (
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          ) : resultado?.valido ? (
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
          ) : (
            <Upload className="w-10 h-10 text-purple-300 mx-auto" />
          )}
          <p className="text-white text-sm mt-2 font-bold">
            {processando ? 'Validando...' : resultado?.valido ? 'APROVADO!' : 'CLIQUE PARA ENVIAR'}
          </p>
        </div>

        {resultado && !resultado.valido && (
          <p className="text-red-400 text-xs mt-2 font-bold">{resultado.motivo}</p>
        )}

        <button onClick={onCancel} className="mt-4 text-gray-400 text-xs hover:text-white underline">Voltar para instruções</button>
      </div>
    </div>
  );
};

export default PaymentUploader;