import { motion } from 'framer-motion';
import { X, Copy, CheckCircle2, Sparkles, Shield, Clock, Home, Loader2, AlertCircle, Zap, Ban } from 'lucide-react';
import PaymentUploader from './PaymentUploader';
import { useState, useEffect } from 'react';

const PaymentModal = ({ isOpen, onClose, onPaymentConfirmed, theme, onBackToHome }) => {
  const [paymentValidated, setPaymentValidated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const pixKey = `12996764694`;
  const amount = 10.00;

  useEffect(() => {
    if (isOpen && !startTime) {
      setStartTime(new Date());
    }
    
    if (!isOpen) {
      setPaymentValidated(false);
      setIsProcessing(false);
      setErrorMessage('');
      setCopied(false);
      setValidationResult(null);
      setTimeLeft(5 * 60);
      setStartTime(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || paymentValidated) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          
          // Se o tempo acabou, mostrar alerta
          if (!paymentValidated) {
            setErrorMessage('⏰ TEMPO ESGOTADO! Feche e abra novamente para novo pagamento.');
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen, paymentValidated]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
      
      setTimeout(() => {
        if (onPaymentConfirmed) {
          onPaymentConfirmed(result.paymentId);
        }
      }, 2000);
    } else {
      // Se for erro de tempo, mensagem especial
      if (result.motivo === 'TEMPO_EXCEDIDO' || result.mensagem?.includes('EXPIRADO')) {
        setErrorMessage('🚨 TEMPO EXCEDIDO! Faça um NOVO pagamento.');
      } else {
        setErrorMessage(result.mensagem);
      }
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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-2 md:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl w-full max-w-md my-auto md:my-0 overflow-hidden border border-purple-500/20 shadow-2xl"
      >
        {/* Cabeçalho com timer URGENTE */}
        <div className="p-4 md:p-6 border-b border-white/5 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">Leitura do Tarô</h2>
                <p className="text-xs md:text-sm text-purple-300">{formatTheme(theme)}</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Timer CRÍTICO */}
          <div className={`mb-3 p-3 rounded-xl border ${
            timeLeft > 180 ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30' :
            timeLeft > 60 ? 'bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border-amber-500/30' :
            'bg-gradient-to-r from-red-900/30 to-rose-900/30 border-red-500/40 animate-pulse'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {timeLeft > 180 ? <Clock className="w-4 h-4 text-green-400" /> :
                 timeLeft > 60 ? <Clock className="w-4 h-4 text-amber-400" /> :
                 <Ban className="w-4 h-4 text-red-400 animate-pulse" />}
                <span className={`font-bold text-sm ${
                  timeLeft > 180 ? 'text-green-300' :
                  timeLeft > 60 ? 'text-amber-300' :
                  'text-red-300'
                }`}>
                </span>
              </div>
              <div className={`px-3 py-1 rounded-full font-mono font-bold text-lg ${
                timeLeft > 180 ? 'bg-green-900/50 text-green-300' :
                timeLeft > 60 ? 'bg-amber-900/50 text-amber-300' :
                'bg-red-900/50 text-red-300 animate-pulse'
              }`}>
                {formatTime(timeLeft)}
              </div>
            </div>
            <p className="text-gray-300 text-xs mt-1">
            </p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-250px)]">
          {/* Alerta de tempo ABSOLUTO */}
          <div className="mb-4 p-3 bg-gradient-to-r from-red-900/20 to-rose-900/20 rounded-xl border border-red-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Ban className="w-4 h-4 text-red-400" />
              <p className="text-red-300 font-bold text-sm">REGRA ABSOLUTA:</p>
            </div>
            <p className="text-red-200 text-xs">
              • Comprovante com <span className="font-bold">MAIS DE 5 MINUTOS = REJEITADO</span>
            </p>
            <p className="text-red-200 text-xs">
              • Se rejeitado: <span className="font-bold">NOVO PAGAMENTO OBRIGATÓRIO</span>
            </p>
          </div>

          {/* Instruções */}
          <div className="mb-4 md:mb-6">
            <h3 className="text-amber-300 text-sm font-semibold flex items-center gap-1 mb-2">
              <Shield className="w-4 h-4" />
              COMO PAGAR (RÁPIDO!)
            </h3>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-3 md:p-4 border border-white/5">
              <p className="text-gray-300 text-xs md:text-sm mb-3">
                1. Faça PIX de <span className="text-amber-300 font-bold">R$ {amount.toFixed(2)} ou mais</span> para:
              </p>
              
              {/* Chave PIX */}
              <div className="mb-3 md:mb-4">
                <p className="text-purple-300 text-xs mb-1">Chave PIX (Celular)</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(pixKey)}
                    className="flex-1 bg-gradient-to-r from-purple-900/50 to-pink-900/50 hover:from-purple-800/50 hover:to-pink-800/50 rounded-lg p-3 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <code className="text-white font-mono text-xs md:text-sm tracking-wider break-all">
                        {pixKey}
                      </code>
                      <div className={`p-1 rounded ${copied ? 'bg-green-500/20' : 'bg-white/10'} group-hover:bg-white/20 transition-colors ml-2 flex-shrink-0`}>
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

              <p className="text-gray-300 text-xs md:text-sm">
              </p>
              <p className="text-gray-400 text-xs mt-1">
              </p>
            </div>
          </div>

          {/* Upload do Comprovante */}
          <div>
            <h3 className="text-sm md:text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
            </h3>
            
            {/* Mensagem de erro */}
            {errorMessage && (
              <div className="mb-3 md:mb-4 p-3 bg-gradient-to-r from-red-900/30 to-rose-900/30 rounded-lg border border-red-500/40">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-red-300 font-medium text-xs md:text-sm">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Componente de Upload */}
            {!paymentValidated && !isProcessing && (
              <PaymentUploader
                onValidationComplete={handleValidationComplete}
                onCancel={handleCancel}
              />
            )}

            {/* Pagamento validado */}
            {paymentValidated && (
              <div className="mt-4 md:mt-6 p-4 md:p-6 text-center bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/30">
                <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-green-400 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">✅ Pagamento Validado!</h3>
                <p className="text-green-300 text-sm md:text-base mb-3 md:mb-4">Dentro do prazo! Consulta liberada.</p>
                <div className="flex items-center justify-center gap-1">
                  <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                  <p className="text-green-400/70 text-xs md:text-sm">Fechando automaticamente...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-3 md:p-4 border-t border-white/5 bg-gradient-to-r from-gray-900/50 to-gray-950/50 sticky bottom-0">
          <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs text-gray-400">
            <Ban className="w-3 h-3 text-red-400" />
            <span className="text-center font-semibold">5 MINUTOS MÁXIMO • REJEIÇÃO AUTOMÁTICA APÓS • NOVO PAGAMENTO OBRIGATÓRIO</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
