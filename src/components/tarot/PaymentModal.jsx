import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, X, Copy, Check, Home } from 'lucide-react';
import PaymentUploader from './PaymentUploader';

const PaymentModal = ({ isOpen, onClose, onPaymentConfirmed, onBackToHome, theme, onNewPayment }) => {
  const [stage, setStage] = useState('instructions');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleValidationComplete = (data) => {
    console.log('✅ Pagamento validado:', data);
    setStage('success');
    onPaymentConfirmed && setTimeout(() => {
      onPaymentConfirmed(data);
    }, 2000);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('12996764694');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNewPayment = () => {
    console.log("🔄 Novo pagamento - voltando para seleção de tema");
    if (onNewThemeSelection) {
      onNewThemeSelection();
    } else if (onClose) {
      onClose();
    }
  };

  const handleCancelToHome = () => {
    // Fechar modal e ir para Home
    onClose();
    // Usar window.location para garantir que vai para Home
    window.location.href = '/meu-app-android/';
  };

  const renderInstructions = () => (
    <>
      <div className="mb-8 p-4 bg-gradient-to-r from-purple-900/30 to-violet-900/20 rounded-xl border border-purple-700/30">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-400" />
          Dados para PIX
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-purple-300 mb-1">Chave PIX (Telefone)</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/30 border border-purple-600/30 rounded-lg p-3">
                <p className="font-mono text-xl font-bold text-white text-center">
                  12996764694
                </p>
              </div>
              <button
                onClick={handleCopyPix}
                className={`p-3 rounded-lg transition-all ${copied ? 'bg-green-600' : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700'}`}
                title="Copiar chave PIX"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Copy className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-400 mt-1 animate-pulse">
                ✅ Chave copiada para a área de transferência!
              </p>
            )}
          </div>

          <div>
            <p className="text-sm text-purple-300 mb-1">Nome do favorecido</p>
            <div className="bg-purple-900/30 p-3 rounded-lg">
              <p className="font-bold text-white text-center">
                GUSTAVO SANTOS RIBEIRO
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-purple-300 mb-1">Valor da consulta</p>
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-4">
              <p className="text-3xl font-bold text-white text-center">
                R$ 10,00
              </p>
              <p className="text-xs text-amber-300 text-center mt-1">
                ⚠️ Valor mínimo: R$ 10,00 | Valor abaixo será recusado
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-amber-400">📋</span>
          Como pagar
        </h3>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              1
            </span>
            <div>
              <p className="text-white font-medium">Abra seu app de banco</p>
              <p className="text-sm text-gray-400">Nubank, Inter, Itaú, Bradesco, etc.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </span>
            <div>
              <p className="text-white font-medium">Vá em "Pagar com PIX"</p>
              <p className="text-sm text-gray-400">Selecione a opção de pagar via chave</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              3
            </span>
            <div>
              <p className="text-white font-medium">Cole a chave: <strong className="font-mono">12996764694</strong></p>
              <p className="text-sm text-gray-400">Confirme o nome: GUSTAVO SANTOS RIBEIRO</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              4
            </span>
            <div>
              <p className="text-white font-medium">Digite o valor: <strong>R$ 10,00</strong></p>
              <p className="text-sm text-gray-400">Valor mínimo para liberar a consulta</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              5
            </span>
            <div>
              <p className="text-white font-medium">Confirme o pagamento</p>
              <p className="text-sm text-gray-400">Salve o comprovante para enviar abaixo</p>
            </div>
          </li>
        </ol>
      </div>

      <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <p className="text-sm text-amber-200 flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span><strong>Importante:</strong> Após realizar o pagamento, volte aqui para enviar o comprovante</span>
        </p>
      </div>

      <button
        onClick={() => setStage('upload')}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
      >
        <span className="text-lg">📱</span>
        Já paguei - Enviar Comprovante
      </button>
    </>
  );

  const renderUpload = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Envie seu comprovante</h3>
        <p className="text-gray-400">Tire uma foto ou selecione da galeria</p>
      </div>
      <PaymentUploader 
        onValidationComplete={handleValidationComplete}
        onCancel={handleCancelToHome}
        onNewPayment={onNewPayment}
      />
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Pagamento Confirmado!</h3>
        <p className="text-gray-300">Sua consulta foi liberada com sucesso.</p>
      </div>
      <div className="animate-pulse">
        <p className="text-purple-300">Preparando sua leitura...</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-purple-700/30 shadow-2xl shadow-purple-900/30"
      >
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
              onClick={handleCancelToHome}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Voltar para Home"
            >
              <Home className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {stage === 'instructions' && renderInstructions()}
          {stage === 'upload' && renderUpload()}
          {stage === 'success' && renderSuccess()}
        </div>

        <div className="p-4 border-t border-purple-800/30 bg-gray-900/50 rounded-b-2xl">
          <p className="text-xs text-center text-purple-400">
            <strong>Atenção:</strong> Não aceitamos pagamentos duplicados. 
            Caso o comprovante seja rejeitado, por favor, realize um novo pagamento.
          </p>
          <div className="mt-2 text-center">
            <p className="text-xs text-amber-300">
              💰 Valor mínimo: R$ 10,00 | 📅 Data: Hoje | 👤 Favorecido: GUSTAVO SANTOS RIBEIRO
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
