import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check, MessageSquare } from 'lucide-react';
import PaymentUploader from './PaymentUploader';

export default function PaymentModal({ isOpen, onClose, onPaymentConfirmed }) {
  const [stage, setStage] = useState('instructions');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyPix = () => {
    navigator.clipboard.writeText('12996764694');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Esta função PRECISA ser chamada pelo PaymentUploader
  const handleFinalSuccess = (data) => {
    console.log("Sucesso recebido no Modal");
    setStage('success');
    setTimeout(() => {
      onPaymentConfirmed(data);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg my-auto">
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Pagamento PIX</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
          </div>

          {stage === 'instructions' && (
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-4 border border-white/10 text-center">
                <p className="text-xs text-gray-400 uppercase mb-2 font-bold">Chave PIX (Telefone)</p>
                <div className="flex items-center gap-2 mb-2">
                  <p className="flex-1 font-mono text-xl font-bold text-white">12996764694</p>
                  <button onClick={handleCopyPix} className={`p-2 rounded-lg ${copied ? 'bg-green-600' : 'bg-purple-600'}`}>
                    {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                  </button>
                </div>
                <p className="text-sm text-gray-400">GUSTAVO SANTOS RIBEIRO</p>
              </div>
              <button onClick={() => setStage('upload')} className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg">📱 JÁ PAGUEI - ENVIAR COMPROVANTE</button>
            </div>
          )}

          {stage === 'upload' && (
            <PaymentUploader 
              onValidationComplete={handleFinalSuccess} 
              onCancel={() => setStage('instructions')} 
            />
          )}

          {stage === 'success' && (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-white">Pagamento Aprovado!</h3>
              <p className="text-gray-400">Abrindo seu Oráculo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
