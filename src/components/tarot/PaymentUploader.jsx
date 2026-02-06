import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import processarComprovante from "../../services/paymentControl.js";

const PaymentUploader = ({ onValidationComplete }) => {
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');
  const [details, setDetails] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mantendo seu preview de imagem
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    setStatus('validating');
    setMsg('Lendo comprovante...');
    setDetails('O robô está extraindo os dados da imagem...');

    try {
      // Chamada ao robô Tesseract que configuramos
      const resultado = await processarComprovante(file);

      if (resultado.valid) {
        setStatus('success');
        setMsg('✅ Pagamento Confirmado!');
        setDetails(`Valor: R$ ${resultado.amount}`);
        
        // Pequeno delay para o usuário ver o sucesso antes de liberar a leitura
        setTimeout(() => {
          if (onValidationComplete) onValidationComplete({
            valido: true,
            transactionId: resultado.transactionId
          });
        }, 2000);
      } else {
        setStatus('error');
        setMsg('❌ Recusado');
        setDetails(resultado.details || 'Dados não conferem.');
      }
    } catch (err) {
      setStatus('error');
      setMsg('Erro no processamento');
      setDetails('Não foi possível ler a imagem. Tente uma foto mais clara.');
    }
  };

  return (
    <div className="p-4 bg-purple-900/20 rounded-2xl border border-purple-400/30">
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current.click()} 
          className="cursor-pointer border-2 border-dashed border-purple-400 p-8 text-center rounded-xl hover:bg-purple-800/20 transition-all"
        >
          <Upload className="mx-auto mb-2 text-purple-400" />
          <p className="text-white font-medium">Anexar Comprovante PIX</p>
          <p className="text-xs text-purple-300 mt-2">JPG ou PNG (Mínimo R$ 10,00)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFile} 
            className="hidden" 
            accept="image/*" 
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img src={preview} alt="Comprovante" className="w-full h-48 object-contain rounded-lg bg-black border border-purple-500/30" />
            <button 
              onClick={() => { setPreview(null); setStatus('idle'); setDetails(''); }}
              className="absolute top-2 right-2 bg-red-600 p-1 rounded-full text-white shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className={`p-4 rounded-xl border ${
            status === 'success' ? 'bg-green-900/30 border-green-500/50 text-green-200' : 
            status === 'error' ? 'bg-red-900/30 border-red-500/50 text-red-200' : 
            'bg-amber-900/30 border-amber-500/50 text-amber-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {status === 'validating' && <Loader2 className="animate-spin w-4 h-4" />}
              <span className="font-bold">{msg}</span>
            </div>
            {details && <p className="text-xs opacity-80">{details}</p>}
          </div>

          {status === 'error' && (
            <button 
              onClick={() => { setPreview(null); setStatus('idle'); setDetails(''); }} 
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg"
            >
              Tentar com outro arquivo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentUploader;
