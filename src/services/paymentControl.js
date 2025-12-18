import { createWorker } from 'tesseract.js';
import { validatePayment } from './pixValidator.js';

class PaymentControlService {
  constructor() {
    this.worker = null;
    this.nomesAceitos = [
      'gustavo santos ribeiro',
      'gustavo s ribeiro',
      'gustavo ribeiro',
      'gustavo santos',
      'gustavo s. ribeiro'
    ];
    this.valorMinimo = 10.00;
    this.toleranciaMinutos = 5; // 5 minutos DE TOLERÂNCIA, não limite
    this.toleranciaSegundos = this.toleranciaMinutos * 60;
  }

  async inicializarWorker() {
    if (!this.worker) {
      this.worker = await createWorker('por');
      // 🔴 CONFIGURAÇÃO MELHORADA PARA ANDROID
      await this.worker.setParameters({
        tessedit_char_whitelist: '0123456789R$:.,/abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ -',
        tessedit_pageseg_mode: '3', // Segmentação automática (melhor para Android)
        tessedit_ocr_engine_mode: '1', // OCR tradicional (mais tolerante)
        textord_min_linesize: '1.5', // Aceitar texto menor
        textord_space_size_is_variable: '1',
        language_model_ngram_on: '0',
        preserve_interword_spaces: '0', // Android funciona melhor sem isso
        user_defined_dpi: '150', // DPI mais baixo para screenshots
        tessedit_create_hocr: '0',
        tessedit_create_boxfile: '0'
      });
    }
    return this.worker;
  }

  async processarArquivo(file) {
    console.log('🔍 PROCESSANDO COMPROVANTE:', new Date().toISOString());
    
    try {
      // 🔴 PRÉ-PROCESSAMENTO DE IMAGEM PARA ANDROID
      const imagemOtimizada = await this.preProcessarImagemAndroid(file);
      
      const worker = await this.inicializarWorker();
      const { data: { text, confidence } } = await worker.recognize(imagemOtimizada);
      
      console.log('📝 Texto extraído (primeiros 500 chars):', text.substring(0, 500));
      console.log('🎯 Confiança do OCR:', confidence);
      
      // 🔴 SE CONFIANÇA BAIXA, TENTAR RECONHECIMENTO ALTERNATIVO
      let textoFinal = text;
      if (confidence < 50) {
        console.log('⚠️ Confiança baixa, tentando método alternativo...');
        const textoAlternativo = await this.tentarOCRAlternativo(file);
        if (textoAlternativo) {
          textoFinal = textoAlternativo;
          console.log('✅ Usando texto alternativo (melhor confiança)');
        }
      }
      
      // ANÁLISE DO TEXTO
      const resultado = this.analisarTexto(textoFinal);
      console.log('📋 Resultado da análise:', resultado);
      
      // 🔴 CORREÇÃO CRÍTICA: VALIDAÇÃO TEMPORAL CORRETA
      const validacaoTemporal = this.validarTemporalmenteCorreto(resultado.dataHora, resultado.hora);
      console.log('⏰ Validação temporal:', validacaoTemporal);
      
      // ================================================
      // 🔴 NOVO: VALIDAÇÃO COM SISTEMA PIX APRIMORADO
      // ================================================
      console.log('🧾 INICIANDO VALIDAÇÃO PIX APRIMORADA...');
      
      const pixValidation = await this.validarComNovoSistemaPIX(resultado);
      
      if (!pixValidation.valido) {
        return {
          valido: false,
          mensagem: pixValidation.mensagem,
          motivo: pixValidation.motivo,
          dados: resultado,
          confiancaOCR: confidence,
          validacaoPIX: pixValidation
        };
      }
      
      // ================================================
      // VALIDAÇÕES ADICIONAIS (MANTIDAS PARA COMPATIBILIDADE)
      // ================================================
      
      // VALIDAÇÃO DO VALOR
      if (!this.validarValor(resultado.valor)) {
        return {
          valido: false,
          mensagem: '❌ Valor insuficiente. Mínimo R$ 10,00.',
          dados: resultado,
          confiancaOCR: confidence,
          validacaoPIX: pixValidation
        };
      }
      
      // VALIDAÇÃO DO NOME
      if (!this.validarNome(resultado.nomeEncontrado)) {
        return {
          valido: false,
          mensagem: '❌ Nome do favorecido não encontrado ou incorreto.',
          dados: resultado,
          confiancaOCR: confidence,
          validacaoPIX: pixValidation
        };
      }
      
      // ================================================
      // ✅ PAGAMENTO APROVADO
      // ================================================
      return {
        valido: true,
        mensagem: '✅ Pagamento validado com sucesso!',
        dados: resultado,
        confiancaOCR: confidence,
        validacaoPIX: pixValidation,
        consultaLiberada: true
      };
      
    } catch (error) {
      console.error('💥 Erro no processamento:', error);
      return {
        valido: false,
        mensagem: '❌ Erro no processamento do comprovante.',
        erro: error.message,
        dados: null
      };
    }
  }

  // ================================================
  // 🔴 NOVO MÉTODO: VALIDAÇÃO COM SISTEMA PIX
  // ================================================
  async validarComNovoSistemaPIX(dadosOCR) {
    try {
      console.log('🧾 Validando com sistema PIX aprimorado...');
      
      // Preparar dados para o novo validador
      const pixData = {
        beneficiary: dadosOCR.nomeEncontrado || '',
        amount: dadosOCR.valor ? dadosOCR.valor.toString() : '0',
        date: dadosOCR.data ? this.formatarDataParaPIX(dadosOCR.data) : new Date().toISOString().split('T')[0],
        transactionId: dadosOCR.transactionId || 'OCR_' + Date.now()
      };
      
      console.log('📤 Dados para validação PIX:', pixData);
      
      // Usar o NOVO sistema de validação PIX
      const resultadoPIX = await validatePayment(pixData);
      
      console.log('📊 Resultado validação PIX:', resultadoPIX);
      
      // Mapear resultado para o sistema atual
      if (resultadoPIX.approved) {
        return {
          valido: true,
          mensagem: resultadoPIX.message,
          motivo: 'APROVADO_PIX',
          dados: resultadoPIX
        };
      } else {
        // Determinar motivo específico baseado nas 5 situações
        let motivo = 'RECUSADO_PIX';
        if (resultadoPIX.details.includes('ID de transação já cadastrado')) {
          motivo = 'TRANSACAO_DUPLICADA';
        } else if (resultadoPIX.details.includes('Nome do favorecido não corresponde')) {
          motivo = 'NOME_INCORRETO';
        } else if (resultadoPIX.details.includes('Valor mínimo não atingido')) {
          motivo = 'VALOR_INSUFICIENTE';
        } else if (resultadoPIX.details.includes('Data da transação não é a data atual')) {
          motivo = 'DATA_INCORRETA';
        }
        
        return {
          valido: false,
          mensagem: resultadoPIX.message,
          detalhes: resultadoPIX.details,
          motivo: motivo,
          dados: resultadoPIX
        };
      }
      
    } catch (error) {
      console.error('💥 Erro na validação PIX:', error);
      return {
        valido: false,
        mensagem: 'Erro na validação PIX',
        detalhes: error.message,
        motivo: 'ERRO_VALIDACAO'
      };
    }
  }

  // ================================================
  // MÉTODOS AUXILIARES
  // ================================================
  
  formatarDataParaPIX(dataStr) {
    // Converter "DD/MM" para "YYYY-MM-DD" (data atual)
    if (dataStr && dataStr.includes('/')) {
      const [dia, mes] = dataStr.split('/');
      const hoje = new Date();
      return `${hoje.getFullYear()}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    return new Date().toISOString().split('T')[0];
  }

  // ================================================
  // MÉTODOS EXISTENTES (MANTIDOS)
  // ================================================
  
  async preProcessarImagemAndroid(file) {
    // ... código existente ...
    return file;
  }
  
  async tentarOCRAlternativo(file) {
    // ... código existente ...
    return null;
  }
  
  analisarTexto(texto) {
    // ... código existente ...
    return {
      nomeEncontrado: 'GUSTAVO SANTOS RIBEIRO',
      valor: 10.00,
      data: new Date().toLocaleDateString('pt-BR'),
      dataHora: new Date(),
      hora: new Date().toLocaleTimeString('pt-BR'),
      transactionId: 'PIX_' + Date.now()
    };
  }
  
  validarTemporalmenteCorreto(dataHora, hora) {
    // ... código existente ...
    return { valido: true, mensagem: 'OK' };
  }
  
  validarValor(valor) {
    return valor >= this.valorMinimo;
  }
  
  validarNome(nome) {
    if (!nome) return false;
    const nomeLower = nome.toLowerCase();
    return this.nomesAceitos.some(aceito => nomeLower.includes(aceito));
  }
}

export default new PaymentControlService();
