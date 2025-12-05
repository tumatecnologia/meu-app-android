import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import PaymentControlService from '../../services/paymentControl';

const PaymentUploader = ({ onUploadSuccess, onUploadError, theme, amount = 10.00 }) => {
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const fileInputRef = useRef(null);

  // Função para gerar ID fixo baseado no arquivo (simulação)
  const gerarIdDoComprovante = (file) => {
    // Em produção, este ID viria do OCR do comprovante PIX
    // Para teste, vamos gerar um ID fixo baseado no nome e tamanho do arquivo
    const nomeHash = btoa(file.name + file.size + file.lastModified).substr(0, 20).replace(/[^a-zA-Z0-9]/g, '');
    return `pix_${nomeHash}`;
  };

  // Função para simular hora do comprovante baseado no nome do arquivo
  const detectarHoraDoComprovante = (filename) => {
    const agora = new Date();
    
    console.log('🔍 Analisando nome do arquivo para detectar hora:', filename);
    
    // Se o arquivo tem "19.49" no nome, simular comprovante das 19:49 (30min atrás)
    if (filename.includes('19.49') || filename.includes('19:49')) {
      console.log('⏰ DETECTADO: Arquivo parece ser das 19:49 (30 minutos atrás)');
      // Criar data de 30 minutos atrás
      const horaComprovante = new Date(agora.getTime() - 30 * 60 * 1000);
      const horaFormatada = horaComprovante.toLocaleTimeString('pt-BR', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      console.log('   Hora simulada:', horaFormatada);
      return horaFormatada;
    }
    
    // Se o arquivo tem "teste_antigo" ou parecido, simular 1 hora atrás
    if (filename.toLowerCase().includes('antigo') || filename.includes('old')) {
      console.log('⏰ DETECTADO: Arquivo antigo (1 hora atrás)');
      const horaComprovante = new Date(agora.getTime() - 60 * 60 * 1000);
      const horaFormatada = horaComprovante.toLocaleTimeString('pt-BR', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      console.log('   Hora simulada:', horaFormatada);
      return horaFormatada;
    }
    
    // Para arquivos normais, simular comprovante recente (≤ 3min)
    console.log('⏰ Arquivo normal - Simulando comprovante recente (≤ 3min)');
    const minutosAtras = Math.floor(Math.random() * 4); // 0-3 minutos
    const horaRecentemente = new Date(agora.getTime() - minutosAtras * 60 * 1000);
    const horaFormatada = horaRecentemente.toLocaleTimeString('pt-BR', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    console.log(`   Hora simulada: ${horaFormatada} (${minutosAtras} minutos atrás)`);
    return horaFormatada;
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setProcessando(true);
    setResultado(null);

    try {
      console.log('\n' + '='.repeat(60));
      console.log('🔄 INICIANDO VALIDAÇÃO DO COMPROVANTE');
      console.log('='.repeat(60));
      console.log('📄 Arquivo:', file.name);
      console.log('📏 Tamanho:', (file.size / 1024).toFixed(2), 'KB');
      console.log('📅 Modificado:', new Date(file.lastModified).toLocaleString('pt-BR'));
      
      // SIMULAR PROCESSAMENTO OCR
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerar dados simulados do comprovante
      const agora = new Date();
      const dataAtual = agora.toISOString().split('T')[0];
      
      // DETECTAR HORA DO COMPROVANTE BASEADO NO NOME DO ARQUIVO
      const horaComprovante = detectarHoraDoComprovante(file.name);
      
      console.log('\n📊 DADOS SIMULADOS DO COMPROVANTE:');
      console.log('📅 Data atual do sistema:', dataAtual);
      console.log('⏰ Hora atual do sistema:', agora.toLocaleTimeString('pt-BR', { hour12: false }));
      console.log('⏰ Hora simulada do comprovante:', horaComprovante);
      
      // Calcular diferença para debug
      const [horaComp, minutoComp] = horaComprovante.split(':').map(Number);
      const dataHoraComprovante = new Date();
      dataHoraComprovante.setHours(horaComp, minutoComp, 0, 0);
      const diferencaMinutos = (agora - dataHoraComprovante) / (1000 * 60);
      console.log(`⏱️  Diferença calculada: ${diferencaMinutos.toFixed(1)} minutos`);
      console.log(`🎯 Limite máximo: 6 minutos`);
      console.log(`📊 Status: ${diferencaMinutos <= 6 ? '✅ DENTRO DO LIMITE' : '❌ FORA DO LIMITE'}`);
      
      // GERAR ID FIXO BASEADO NO ARQUIVO
      const idTransacao = gerarIdDoComprovante(file);
      
      console.log('🔑 ID gerado para o arquivo:', idTransacao);
      
      const dadosComprovante = {
        data_comprovante: dataAtual,
        hora_comprovante: horaComprovante,
        nome_favorecido: 'Gustavo Santos Ribeiro',
        valor_pix: 10.00,
        id_transacao: idTransacao
      };
      
      console.log('\n📋 DADOS ENVIADOS PARA VALIDAÇÃO:');
      console.log('   Data:', dadosComprovante.data_comprovante);
      console.log('   Hora:', dadosComprovante.hora_comprovante);
      console.log('   Nome:', dadosComprovante.nome_favorecido);
      console.log('   Valor: R$', dadosComprovante.valor_pix);
      console.log('   ID:', dadosComprovante.id_transacao);
      
      // VALIDAR COMPROVANTE
      const validacao = await PaymentControlService.validarEProcessarComprovante(dadosComprovante, file.name);
      
      console.log('\n🎯 RESULTADO DA VALIDAÇÃO:');
      console.log('   Válido?', validacao.valido ? '✅ SIM' : '❌ NÃO');
      if (validacao.motivo) console.log('   Motivo:', validacao.motivo);
      
      setResultado(validacao);
      setProcessando(false);

      if (validacao.valido) {
        console.log('✅ COMPROVANTE VÁLIDO - Notificando sucesso');
        if (onUploadSuccess) {
          onUploadSuccess({
            liberado: true,
            registro: validacao.registro,
            dados: dadosComprovante,
            mensagem: validacao.mensagem
          });
        }
      } else {
        console.log('❌ COMPROVANTE INVÁLIDO - Notificando erro');
        if (onUploadError) {
          onUploadError(validacao.motivo || 'Comprovante não aprovado');
        }
      }

      console.log('='.repeat(60));
      console.log('✅ PROCESSAMENTO CONCLUÍDO');
      console.log('='.repeat(60));

    } catch (error) {
      console.error('\n❌ ERRO NO PROCESSAMENTO:', error);
      setProcessando(false);
      setResultado({
        valido: false,
        mensagem: 'Erro no processamento do comprovante'
      });
      if (onUploadError) onUploadError('Erro no processamento');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Área de Upload */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={processando}
        />
        
        <motion.button
          whileHover={{ scale: processando ? 1 : 1.02 }}
          whileTap={{ scale: processando ? 1 : 0.98 }}
          onClick={triggerFileInput}
          disabled={processando}
          className={`w-full p-12 rounded-2xl border-2 border-dashed transition-all ${
            processando
              ? 'border-amber-400/50 bg-amber-400/10 cursor-wait'
              : resultado?.valido
              ? 'border-green-500/50 bg-green-500/10 cursor-pointer'
              : 'border-purple-400/50 bg-white/5 hover:border-amber-400 hover:bg-white/10 cursor-pointer'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            {processando ? (
              <>
                <Loader2 className="w-16 h-16 text-amber-400 animate-spin" />
                <div className="text-center">
                  <p className="text-white font-medium text-lg">Validando comprovante...</p>
                  <p className="text-purple-300 text-sm mt-2">Verificando todas as condições</p>
                </div>
              </>
            ) : resultado?.valido ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-500" />
                <div className="text-center">
                  <p className="text-white font-medium text-lg">Pagamento confirmado!</p>
                  <p className="text-green-400 text-sm mt-2">Consulta liberada com sucesso</p>
                </div>
              </>
            ) : resultado?.valido === false ? (
              <>
                <XCircle className="w-16 h-16 text-red-500" />
                <div className="text-center">
                  <p className="text-white font-medium text-lg">Comprovante não aprovado</p>
                  <p className="text-red-400 text-sm mt-2">Verifique os dados e tente novamente</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-16 h-16 text-purple-400" />
                <div className="text-center">
                  <p className="text-white font-medium text-lg">Envie seu comprovante PIX</p>
                  <p className="text-purple-300 text-sm mt-2">Clique para selecionar o arquivo</p>
                  <div className="flex items-center justify-center gap-4 mt-3 text-xs text-purple-400">
                    <span>JPG, PNG ou PDF</span>
                    <span>•</span>
                    <span>Máx. 5MB</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.button>
      </div>

      {/* Mensagem de Resultado */}
      {resultado && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className={`rounded-xl p-5 text-center ${
            resultado.valido
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-3">
              {resultado.valido ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              <p className={`font-medium ${
                resultado.valido ? 'text-green-400' : 'text-red-400'
              }`}>
                {resultado.valido ? 'CONSULTA LIBERADA' : 'CONSULTA BLOQUEADA'}
              </p>
            </div>
            
            <p className="text-white text-sm mb-2">
              {resultado.mensagem}
            </p>
            
            {resultado.motivo && !resultado.valido && (
              <p className="text-red-300 text-xs">
                Motivo: {resultado.motivo}
              </p>
            )}
            
            {!resultado.valido && (
              <div className="mt-3 pt-3 border-t border-red-500/20">
                <button
                  onClick={triggerFileInput}
                  className="inline-flex items-center gap-2 text-red-300 hover:text-red-200 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  Tentar novamente com novo comprovante
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Instrução Básica */}
      <div className="text-center">
        <p className="text-purple-300 text-sm">
          Envie o comprovante do PIX de R$ 10,00 feito hoje
        </p>
        <p className="text-purple-400 text-xs mt-1">
          • Máximo 6 minutos desde o pagamento
          • Nome: Gustavo Santos Ribeiro ou Gustavo S Ribeiro
        </p>
      </div>
    </div>
  );
};

export default PaymentUploader;
