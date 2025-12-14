import { motion } from 'framer-motion';
import { X, Copy, CheckCircle2, Sparkles, Shield, Clock, Home, Loader2, AlertCircle } from 'lucide-react';
import PaymentUploader from './PaymentUploader';
import { useState, useEffect } from 'react';

const PaymentModal = ({ isOpen, onClose, onPaymentConfirmed, theme, onBackToHome }) => {
  const [paymentValidated, setPaymentValidated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const pixKey = `12996764694`;
  const amount = 10.00; // Valor mínimo aceito

  useEffect(() => {
    if (!isOpen) {
      // Resetar estado quando o modal fechar
      setPaymentValidated(false);
      setIsProcessing(false);
      setErrorMessage('');
      setCopied(false);
      setValidationResult(null);
    }
  }, [isOpen]);

  const formatTheme = (theme) => {
    const themes = {
      'love': 'Amor & Relacionamentos',
      'career': 'Carreira & Profissão',
      'finance': 'Finanças & Prosperidade',
      'health': 'Saúde & Bem-estar',
      'family': 'Família & Lar',
      'spirituality': 'Espiritualidade & Crescimento',
      'friendship': 'Amizades & Conexões',
      'studies': 'Estudos & Conhecimento',
      'travel': 'Viagens & Aventuras',
      'projects': 'Projetos & Metas',
      'general': 'Geral & Reflexão'
    };
    return themes[theme] || 'Consulta Geral';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleValidationComplete = (result) => {
    console.log('✅ Resultado da validação:', result);
    setValidationResult(result);
    
    if (result.valido) {
      setPaymentValidated(true);
      setErrorMessage('');
      
      // Liberar a consulta automaticamente após 2 segundos
      setTimeout(() => {
        if (onPaymentConfirmed) {
          onPaymentConfirmed(result.paymentId);
        }
      }, 2000);
    } else {
      setErrorMessage(result.mensagem);
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl w-full max-w-md overflow-hidden border border-purple-500/20 shadow-2xl"
      >
        {/* Cabeçalho */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Leitura do Tarô</h2>
                <p className="text-sm text-purple-300">{formatTheme(theme)}</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Título e valor */}
          <div className="text-center mb-5">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-amber-300 font-bold text-lg">Mínimo R$ {amount.toFixed(2)}</span>
              <span className="text-purple-300">•</span>
              <span className="text-purple-200 text-sm">{formatTheme(theme)}</span>
            </div>
            <p className="text-purple-300 text-xs">
              Envie qualquer valor igual ou superior ao mínimo
            </p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Informações do Pagamento */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-500/20">
              <p className="text-purple-300 text-xs mb-1">Valor mínimo</p>
              <p className="text-white font-bold text-lg">R$ {amount.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-500/20">
              <p className="text-purple-300 text-xs mb-1">Tema</p>
              <p className="text-white font-medium text-sm">{formatTheme(theme)}</p>
            </div>
          </div>

          {/* Instruções */}
          <div className="mb-6">
            <h3 className="text-amber-300 text-sm font-semibold flex items-center gap-1 mb-2">
              <Shield className="w-4 h-4" />
              Como realizar o pagamento
            </h3>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-white/5">
              <p className="text-gray-300 text-sm mb-3">
                1. Faça um PIX de <span className="text-amber-300 font-semibold">R$ {amount.toFixed(2)} ou mais</span> para:
              </p>
              
              {/* Chave PIX */}
              <div className="mb-4">
                <p className="text-purple-300 text-xs mb-1">Chave PIX (Celular)</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(pixKey)}
                    className="flex-1 bg-gradient-to-r from-purple-900/50 to-pink-900/50 hover:from-purple-800/50 hover:to-pink-800/50 rounded-lg p-3 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <code className="text-white font-mono text-sm tracking-wider break-all">
                        {pixKey}
                      </code>
                      <div className={`p-1 rounded ${copied ? 'bg-green-500/20' : 'bg-white/10'} group-hover:bg-white/20 transition-colors`}>
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>
                </div>
                <p className="text-purple-300 text-xs mt-2">
                  Nome: <span className="text-white">Gustavo Santos Ribeiro</span>
                </p>
              </div>

              <p className="text-gray-300 text-sm">
                2. Tire um print da <span className="text-amber-300">confirmação do pagamento</span> no app do seu banco
              </p>
            </div>
          </div>

          {/* Upload do Comprovante */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Envie seu comprovante
            </h3>
            
            {/* Mensagem de erro */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-gradient-to-r from-red-900/20 to-rose-900/20 rounded-lg border border-red-500/30">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-red-300 font-medium text-sm">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Componente de Upload com validação automática */}
            {!paymentValidated && !isProcessing && (
              <PaymentUploader
                onValidationComplete={handleValidationComplete}
                onCancel={handleCancel}
              />
            )}

            {/* Processando (loading) */}
            {isProcessing && (
              <div className="mt-6 p-8 text-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-purple-300 font-medium">Processando pagamento...</p>
                <p className="text-purple-400/70 text-sm mt-1">Aguarde enquanto validamos seu comprovante</p>
              </div>
            )}

            {/* Pagamento validado com sucesso */}
            {paymentValidated && (
              <div className="mt-6 p-6 text-center bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/30">
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">✅ Pagamento Validado!</h3>
                <p className="text-green-300 mb-4">Sua consulta foi liberada com sucesso!</p>
                <div className="flex items-center justify-center gap-1">
                  <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                  <p className="text-green-400/70 text-sm">Fechando automaticamente...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-white/5 bg-gradient-to-r from-gray-900/50 to-gray-950/50">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield className="w-3 h-3" />
            <span>Sistema seguro • Validação automática • 10 minutos de tolerância</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
