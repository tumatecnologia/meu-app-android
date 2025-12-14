import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, CheckCircle2, Sparkles, Shield, Clock, Home } from 'lucide-react';
import PaymentUploader from './PaymentUploader';

const PaymentModal = ({ isOpen, onClose, onPaymentConfirmed, theme, onBackToHome }) => {
  const [copied, setCopied] = useState(false);
  const [paymentValidated, setPaymentValidated] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const pixKey = `12996764694`;
  const amount = 10.00;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUploadSuccess = async (uploadData) => {
    console.log('📨 Dados recebidos do upload:', uploadData);
    
    setProcessing(true);
    setErrorMessage('');
    
    try {
      // VERIFICAR SE FOI REALMENTE LIBERADO
      if (!uploadData.liberado) {
        console.log('❌ Upload não liberado:', uploadData.mensagem);
        setErrorMessage(uploadData.mensagem || 'Comprovante não aprovado');
        setProcessing(false);
        return;
      }
      
      console.log('✅ Comprovante validado - Processando...');
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPaymentValidated(true);
      console.log('✅ Pagamento validado - Chamando onPaymentConfirmed');
      
      // Chamar callback para liberar a leitura
      // Passar um ID único para a consulta
      const paymentId = uploadData.registro?.id_transacao || `payment_${Date.now()}`;
      onPaymentConfirmed(paymentId);
      
    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      setErrorMessage('Erro no processamento. Tente novamente.');
      setProcessing(false);
    }
  };

  const handleUploadError = (error) => {
    console.error('❌ Erro no upload:', error);
    setErrorMessage(error || 'Erro ao processar comprovante');
  };

  if (!isOpen) return null;

  // Função para formatar o tema
  const formatTheme = (theme) => {
    const themeMap = {
      'amor': 'Amor',
      'carreira': 'Carreira',
      'financas': 'Finanças',
      'espiritualidade': 'Espiritualidade',
      'saude': 'Saúde',
      'traicao': 'Traição',
      'casamento': 'Casamento',
      'viagem': 'Viagem',
      'noivado': 'Noivado',
      'conselho': 'Conselho',
      'justica': 'Justiça'
    };
    return themeMap[theme] || theme;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-950 to-violet-900 border-2 border-amber-400/30 rounded-2xl p-6 max-w-md w-full shadow-2xl my-8"
      >
        {/* Cabeçalho */}
        <div className="text-center mb-5">
          <div className="inline-block p-2 bg-amber-400/20 rounded-full mb-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-1">
            Pagamento via PIX
          </h2>
          
          <div className="inline-flex items-center gap-2 bg-amber-500/20 px-3 py-1 rounded-full mb-3">
            <span className="text-amber-300 font-bold text-lg">R$ {amount.toFixed(2)}</span>
            <span className="text-purple-300">•</span>
            <span className="text-purple-200 text-sm">{formatTheme(theme)}</span>
          </div>
          
          <p className="text-purple-300 text-xs">
            Use a chave PIX abaixo para realizar o pagamento
          </p>
        </div>

        {/* Informações do Pagamento */}
        <div className="bg-gradient-to-br from-purple-800/30 to-violet-800/30 rounded-xl p-4 mb-5">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-purple-300 text-xs mb-1">Valor</p>
              <p className="text-white font-bold text-lg">R$ {amount.toFixed(2)}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-purple-300 text-xs mb-1">Tema</p>
              <p className="text-white font-medium text-sm">{formatTheme(theme)}</p>
            </div>
          </div>
          
          {/* Chave PIX */}
          <div className="bg-black/30 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-amber-300 text-sm font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Chave PIX (Celular)
              </h3>
              <button
                onClick={() => copyToClipboard(pixKey)}
                className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-1 rounded transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-2 h-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-2 h-2" />
                    Copiar
                  </>
                )}
              </button>
            </div>
            <code className="text-white font-mono text-sm tracking-wider break-all">
              {pixKey}
            </code>
            <p className="text-purple-300 text-xs mt-2">
              Copie e cole no seu banco
            </p>
          </div>
        </div>

        {/* Uploader de Comprovante */}
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Envie seu comprovante
          </h3>
          
          <PaymentUploader
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            theme={theme}
            amount={amount}
          />
        </div>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-xl p-4 text-center">
              <p className="text-red-300 font-medium text-sm">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Processando Pagamento */}
        {processing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
              <p className="text-white font-medium text-sm mb-1">
                {paymentValidated ? 'Pagamento confirmado!' : 'Validando comprovante...'}
              </p>
              <p className="text-green-300 text-xs">
                {paymentValidated 
                  ? 'Liberando sua leitura...' 
                  : 'Aguarde a validação do sistema'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Botões */}
        <div className="space-y-3">
          {!processing ? (
            <>
              <button
                onClick={onClose}
                className="w-full bg-white/10 hover:bg-white/20 text-purple-200 py-2.5 rounded-lg transition-colors font-medium text-sm"
              >
                Cancelar
              </button>
              
              <button
                onClick={onBackToHome}
                className="w-full bg-purple-700/50 hover:bg-purple-700/70 text-white py-2.5 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Voltar para o início
              </button>
            </>
          ) : null}
        </div>

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-purple-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
