import { createWorker } from 'tesseract.js';

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
      
      if (!validacaoTemporal.valido) {
        return {
          valido: false,
          mensagem: `❌ ${validacaoTemporal.mensagem}`,
          motivo: 'TEMPO_EXCEDIDO',
          dados: resultado,
          confiancaOCR: confidence
        };
      }
      
      // VALIDAÇÃO DO VALOR
      if (!this.validarValor(resultado.valor)) {
        return {
          valido: false,
          mensagem: '❌ Valor insuficiente. Mínimo R$ 10,00.',
          dados: resultado,
          confiancaOCR: confidence
        };
      }
      
      // VALIDAÇÃO DO NOME
      if (!this.validarNome(resultado.nomeEncontrado)) {
        return {
          valido: false,
          mensagem: '❌ Nome do favorecido não encontrado ou incorreto.',
          dados: resultado,
          confiancaOCR: confidence
        };
      }
      
      // VALIDAÇÃO DA CONFIRMAÇÃO
      if (!resultado.confirmacao) {
        return {
          valido: false,
          mensagem: '❌ Confirmação de PIX não encontrada.',
          dados: resultado,
          confiancaOCR: confidence
        };
      }
      
      // ✅ TODAS VALIDAÇÕES PASSARAM
      return {
        valido: true,
        mensagem: '✅ Pagamento validado com sucesso!',
        dados: resultado,
        tempoRestante: validacaoTemporal.tempoRestante,
        confiancaOCR: confidence
      };
      
    } catch (error) {
      console.error('❌ Erro crítico:', error);
      return {
        valido: false,
        mensagem: '❌ Erro ao processar. Tente uma foto mais nítida ou use o otimizador.',
        dados: null
      };
    }
  }

  async preProcessarImagemAndroid(file) {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        // 🔴 REDIMENSIONAR PARA MELHOR PERFORMANCE
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200; // Android: tamanho menor para melhor OCR
        
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem
        ctx.drawImage(img, 0, 0, width, height);
        
        // 🔴 PROCESSAMENTO ESPECIAL PARA ANDROID
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // 1. AUMENTAR CONTRASTE SIGNIFICATIVAMENTE
        const contrast = 2.0; // Contraste muito alto para Android
        
        // 2. AUMENTAR BRILHO
        const brightness = 40; // Brilho aumentado
        
        // 3. Converter para escala de cinza com alto contraste
        for (let i = 0; i < data.length; i += 4) {
          // Escala de cinza
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          
          // Aplicar contraste extremo
          let adjusted = ((gray - 128) * contrast) + 128;
          
          // Aplicar brilho
          adjusted = adjusted + brightness;
          
          // Limitar valores
          adjusted = Math.min(255, Math.max(0, adjusted));
          
          // Binarização para preto e branco (ideal para OCR)
          const binary = adjusted > 160 ? 255 : 0;
          
          data[i] = data[i + 1] = data[i + 2] = binary;
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Converter para blob
        canvas.toBlob((blob) => {
          resolve(blob || file); // Fallback para arquivo original
        }, 'image/jpeg', 0.9);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  async tentarOCRAlternativo(file) {
    try {
      const worker = await createWorker('por');
      
      // Configuração ALTERNATIVA para Android
      await worker.setParameters({
        tessedit_pageseg_mode: '11', // Texto esparso
        tessedit_ocr_engine_mode: '2', // LSTM
        user_defined_dpi: '100',
        tessedit_char_blacklist: '|\\/[]{}()<>',
      });
      
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      return text;
    } catch (error) {
      console.log('⚠️ OCR alternativo falhou:', error);
      return null;
    }
  }

  analisarTexto(texto) {
    const textoLimpo = texto.toLowerCase().replace(/\s+/g, ' ');
    console.log('🔍 Analisando texto (limpo):', textoLimpo.substring(0, 300));
    
    const resultado = {
      valor: null,
      data: null,
      hora: null,
      dataHora: null,
      nomeEncontrado: false,
      confirmacao: false,
      textoEncontrado: []
    };

    // 🔴 BUSCAR VALOR (REGEX MAIS FLEXÍVEIS)
    const padroesValor = [
      /r\s*[$\s]*\s*(\d+[.,]\d{2})/gi,
      /valor\s*[^\d]*(\d+[.,]\d{2})/gi,
      /total\s*[^\d]*(\d+[.,]\d{2})/gi,
      /pago\s*[^\d]*(\d+[.,]\d{2})/gi,
      /(\d+[.,]\d{2})\s*reais/gi,
      /\s(\d+[.,]\d{2})\s/gi
    ];
    
    for (const padrao of padroesValor) {
      const matches = [...textoLimpo.matchAll(padrao)];
      for (const match of matches) {
        let valorStr = match[1] || match[0];
        valorStr = valorStr.replace(/[^\d,.]/g, '');
        const valor = parseFloat(valorStr.replace(',', '.'));
        if (!isNaN(valor)) {
          resultado.valor = valor;
          resultado.textoEncontrado.push(`Valor: R$ ${valor.toFixed(2)}`);
          break;
        }
      }
      if (resultado.valor) break;
    }

    // 🔴 BUSCAR DATA (MAIS FLEXÍVEL)
    const padroesData = [
      /(\d{1,2})[./-](\d{1,2})[./-](\d{4})/g,
      /(\d{1,2})[./-](\d{1,2})[./-](\d{2})/g,
      /(\d{4})[./-](\d{1,2})[./-](\d{1,2})/g,
      /(\d{1,2})\s*de\s*[a-zç]+\s*de\s*(\d{4})/gi
    ];
    
    for (const padrao of padroesData) {
      const match = textoLimpo.match(padrao);
      if (match) {
        let dia, mes, ano;
        
        if (match[3] && match[3].length === 4) {
          dia = match[1].padStart(2, '0');
          mes = match[2].padStart(2, '0');
          ano = match[3];
        } else if (match[3] && match[3].length === 2) {
          dia = match[1].padStart(2, '0');
          mes = match[2].padStart(2, '0');
          ano = '20' + match[3];
        } else if (match[1] && match[1].length === 4) {
          ano = match[1];
          mes = match[2].padStart(2, '0');
          dia = match[3].padStart(2, '0');
        }
        
        if (dia && mes && ano) {
          resultado.data = `${ano}-${mes}-${dia}`;
          resultado.textoEncontrado.push(`Data: ${dia}/${mes}/${ano}`);
          break;
        }
      }
    }

    // 🔴 BUSCAR HORA (MAIS FLEXÍVEL)
    const padroesHora = [
      /(\d{1,2})[:.](\d{2})(?:[:.](\d{2}))?/g,
      /(\d{1,2})[h]\s*(\d{1,2})/gi,
      /(\d{1,2})\s*horas\s*e\s*(\d{1,2})/gi,
      /às\s*(\d{1,2})[:.](\d{2})/gi
    ];
    
    for (const padrao of padroesHora) {
      const matches = [...textoLimpo.matchAll(padrao)];
      for (const match of matches) {
        let hora, minuto;
        
        if (match[1] && match[2] && !match[1].toLowerCase().includes('h')) {
          hora = match[1].padStart(2, '0');
          minuto = match[2].padStart(2, '0');
        } else if (match[1] && match[2] && match[1].toLowerCase().includes('h')) {
          hora = match[1].toLowerCase().replace('h', '').trim().padStart(2, '0');
          minuto = match[2].padStart(2, '0');
        }
        
        if (hora && minuto && parseInt(hora) < 24 && parseInt(minuto) < 60) {
          resultado.hora = `${hora}:${minuto}`;
          resultado.textoEncontrado.push(`Hora: ${hora}:${minuto}`);
          
          if (resultado.data) {
            resultado.dataHora = `${resultado.data}T${hora}:${minuto}:00`;
          } else {
            // Se não tem data, usa data atual
            const hoje = new Date().toISOString().split('T')[0];
            resultado.dataHora = `${hoje}T${hora}:${minuto}:00`;
          }
          break;
        }
      }
      if (resultado.hora) break;
    }

    // 🔴 VERIFICAR NOME (BUSCA PARCIAL)
    for (const nome of this.nomesAceitos) {
      // Remover espaços extras para busca mais flexível
      const nomeBusca = nome.replace(/\s+/g, '\\s*');
      const regex = new RegExp(nomeBusca, 'gi');
      if (regex.test(textoLimpo)) {
        resultado.nomeEncontrado = true;
        resultado.textoEncontrado.push(`Nome: ${nome.toUpperCase()}`);
        break;
      }
    }

    // 🔴 VERIFICAR CONFIRMAÇÃO (TERMOS MAIS AMPLOS)
    const confirmacoes = [
      'pix\\s+realizado',
      'pix\\s+enviado',
      'pix\\s+efetuado',
      'pix\\s+conclu[íi]do',
      'transfer[êe]ncia\\s+realizada',
      'pagamento\\s+realizado',
      'confirma[çc][ãa]o\\s+de\\s+pagamento',
      'comprovante\\s+de\\s+pagamento',
      'sucesso',
      'confirmado',
      'aprovado'
    ];
    
    for (const conf of confirmacoes) {
      const regex = new RegExp(conf, 'gi');
      if (regex.test(textoLimpo)) {
        resultado.confirmacao = true;
        resultado.textoEncontrado.push('Confirmação: OK');
        break;
      }
    }

    return resultado;
  }

  validarValor(valor) {
    return valor !== null && valor >= this.valorMinimo;
  }

  validarNome(nomeEncontrado) {
    return nomeEncontrado === true;
  }

  validarTemporalmenteCorreto(dataHora, horaComprovante) {
    console.log('⏰ VALIDAÇÃO TEMPORAL CORRIGIDA');
    console.log('📅 DataHora:', dataHora);
    console.log('🕒 Hora comprovante:', horaComprovante);
    console.log('🕒 Agora:', new Date().toISOString());
    
    // Se não tem dataHora mas tem hora, criar dataHora com data atual
    if (!dataHora && horaComprovante) {
      const hoje = new Date().toISOString().split('T')[0];
      dataHora = `${hoje}T${horaComprovante}:00`;
      console.log('📅 DataHora construída:', dataHora);
    }
    
    if (!dataHora) {
      return {
        valido: false,
        mensagem: 'Data/hora não encontrada no comprovante.'
      };
    }
    
    try {
      const dataComprovante = new Date(dataHora);
      const agora = new Date();
      
      if (isNaN(dataComprovante.getTime())) {
        return {
          valido: false,
          mensagem: 'Data/hora inválida no comprovante.'
        };
      }
      
      // 🔴 CORREÇÃO CRÍTICA: Cálculo CORRETO da diferença
      // Queremos: quanto tempo PASSADO desde o comprovante
      const diferencaMs = agora - dataComprovante; // POSITIVO se comprovante no passado
      const diferencaSegundos = Math.floor(diferencaMs / 1000);
      const diferencaMinutos = Math.floor(diferencaSegundos / 60);
      
      console.log(`⏱️ Diferença calculada: ${diferencaSegundos} segundos (${diferencaMinutos} minutos)`);
      
      // 🔴 VALIDAÇÃO CORRETA:
      // 1. Comprovante não pode estar no FUTURO (hora errada no dispositivo)
      if (diferencaSegundos < 0) {
        return {
          valido: false,
          mensagem: 'Hora do comprovante está no futuro. Verifique o relógio.'
        };
      }
      
      // 2. Comprovante não pode ter mais de 5 minutos
      if (diferencaSegundos > this.toleranciaSegundos) {
        const minutosExcedidos = Math.ceil((diferencaSegundos - this.toleranciaSegundos) / 60);
        return {
          valido: false,
          mensagem: `Comprovante expirado há ${minutosExcedidos} minuto(s). Faça novo pagamento.`
        };
      }
      
      // ✅ DENTRO DO PRAZO
      const segundosRestantes = this.toleranciaSegundos - diferencaSegundos;
      const minutosRestantes = Math.floor(segundosRestantes / 60);
      
      return {
        valido: true,
        mensagem: `Dentro do prazo (${minutosRestantes} min restantes)`,
        tempoRestante: minutosRestantes,
        segundosRestantes: segundosRestantes
      };
      
    } catch (error) {
      console.error('❌ Erro validação temporal:', error);
      return {
        valido: false,
        mensagem: 'Erro ao validar data/hora.'
      };
    }
  }

  async terminar() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export default new PaymentControlService();
