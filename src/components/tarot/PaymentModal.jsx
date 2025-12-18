import React, { useState } from 'react';
import { X, Clock, AlertCircle, CheckCircle, Upload, CreditCard, Smartphone, Camera } from 'lucide-react';
import PaymentUploader from './PaymentUploader';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [paymentStep, setPaymentStep] = useState('instructions'); // 'instructions', 'upload', 'success'
  
  if (!isOpen) return null;

  const handlePaymentSuccess = (data) => {
    console.log('✅ Pagamento validado:', data);
    setPaymentStep('success');
    if (onPaymentSuccess) {
      setTimeout(() => {
        onPaymentSuccess(data);
      }, 2000);
    }
  };

  const handleCancelUpload = () => {
    setPaymentStep('instructions');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-purple-700/30 shadow-2xl shadow-purple-900/30">
        
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 pb-4 bg-gray-900/90 backdrop-blur-sm border-b border-purple-800/30 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Pagamento via PIX</h2>
                <p className="text-sm text-purple-300">R$ 10,00 - Consulta de Tarô Completa</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {paymentStep === 'instructions' && (
            <>
              {/* QR Code e Chave PIX */}
              <div className="mb-8 p-4 bg-gradient-to-r from-purple-900/30 to-violet-900/20 rounded-xl border border-purple-700/30">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-purple-400" />
                      Dados para PIX
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-purple-300 mb-1">Nome do favorecido</p>
                        <p className="font-mono text-lg font-bold text-white bg-purple-900/30 p-2 rounded">
                          GUSTAVO SANTOS RIBEIRO
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-300 mb-1">Valor</p>
                        <p className="text-2xl font-bold text-white">R$ 10,00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instruções */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  Como pagar
                </h3>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </span>
                    <div>
                      <p className="text-white font-medium">Abra seu app de banco</p>
                      <p className="text-sm text-gray-400">Nubank, Inter, Itaú, etc.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </span>
                    <div>
                      <p className="text-white font-medium">Faça o PIX para os dados acima</p>
                      <p className="text-sm text-gray-400">Copie a chave PIX ou escaneie o QR Code</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </span>
                    <div>
                      <p className="text-white font-medium">Tire print da confirmação</p>
                      <p className="text-sm text-gray-400">Salve a imagem do comprovante</p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Botão para próxima etapa */}
              <button
                onClick={() => setPaymentStep('upload')}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all shadow-lg shadow-purple-900/30"
              >
                <div className="flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5" />
                  Enviar Comprovante
                </div>
              </button>
            </>
          )}

          {paymentStep === 'upload' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Envie seu comprovante</h3>
                <p className="text-gray-400">Tire uma foto ou selecione da galeria</p>
              </div>
              
              <PaymentUploader 
                onValidationComplete={handlePaymentSuccess}
                onCancel={handleCancelUpload}
              />
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Pagamento Confirmado!</h3>
                <p className="text-gray-300">Sua consulta foi liberada com sucesso.</p>
              </div>
              <div className="animate-pulse">
                <p className="text-purple-300">Preparando sua leitura...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-800/30 bg-gray-900/50 rounded-b-2xl">
          <p className="text-xs text-center text-purple-400">
            <strong>Atenção:</strong> Não aceitamos pagamentos duplicados. 
            Caso o comprovante seja rejeitado, por favor, realize um novo pagamento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
