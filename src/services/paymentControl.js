// src/services/paymentControl.js
// Sistema flexível com OCR - VALIDAÇÃO ATUALIZADA (Data/Hora atual do sistema)

import PaymentOCRService from './paymentOCRService.js';

class PaymentControlService {
  
  // ========== FUNÇÃO PRINCIPAL DE VALIDAÇÃO DE DATA/HORA ==========
  static validateDateTime(dateString, timeString) {
    console.log('📅⏰ [VALIDAÇÃO] Validando data e hora do comprovante...');
    console.log(`   Data do comprovante: "${dateString}"`);
    console.log(`   Hora do comprovante: "${timeString}"`);
    
    try {
      if (!dateString || !timeString) {
        console.log('❌ Data ou hora não fornecida');
        return false;
      }
      
      const agora = new Date();
      console.log(`   Hora atual do sistema: ${agora.toLocaleString('pt-BR')}`);
      
      // 1. CONVERTER DATA DO COMPROVANTE
      let dia, mes, ano;
      
      // Caso 1: Formato "DD/MM" ou "DD/MM/AAAA"
      if (dateString.includes('/')) {
        const partes = dateString.split('/');
        dia = parseInt(partes[0]);
        mes = parseInt(partes[1]) - 1; // JavaScript: Janeiro = 0
        
        if (partes.length >= 3) {
          ano = parseInt(partes[2]);
          // Se ano tem 2 dígitos, assume século 21
          if (ano < 100) ano += 2000;
        } else {
          // Apenas DD/MM, assume ano atual
          ano = agora.getFullYear();
        }
      }
      // Caso 2: Formato "08 Dez" ou "08 Dezembro"
      else {
        const partes = dateString.split(' ');
        if (partes.length >= 2) {
          dia = parseInt(partes[0]);
          const mesTexto = partes[1].toLowerCase().substring(0, 3);
          
          const monthMap = {
            'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3,
            'mai': 4, 'jun': 5, 'jul': 6, 'ago': 7,
            'set': 8, 'out': 9, 'nov': 10, 'dez': 11
          };
          
          mes = monthMap[mesTexto] !== undefined ? monthMap[mesTexto] : 11; // Dezembro como padrão
          ano = agora.getFullYear();
        } else {
          console.log('❌ Formato de data inválido');
          return false;
        }
      }
      
      // 2. CONVERTER HORA DO COMPROVANTE
      let hora, minuto;
      const horaLimpa = timeString.replace('h', ':').replace('H', ':');
      const horaPartes = horaLimpa.split(':');
      
      if (horaPartes.length >= 2) {
        hora = parseInt(horaPartes[0]);
        minuto = parseInt(horaPartes[1]);
      } else {
        console.log('❌ Formato de hora inválido');
        return false;
      }
      
      // 3. CRIAR OBJETO DATE DO COMPROVANTE
      const dataHoraComprovante = new Date(ano, mes, dia, hora, minuto, 0, 0);
      console.log(`   Data/hora do comprovante: ${dataHoraComprovante.toLocaleString('pt-BR')}`);
      
      // 4. CALCULAR DIFERENÇA EM MILISSEGUNDOS
      const diferencaMs = agora.getTime() - dataHoraComprovante.getTime();
      const diferencaMinutos = diferencaMs / (1000 * 60);
      
      console.log(`   Diferença: ${diferencaMinutos.toFixed(1)} minutos`);
      
      // 5. VALIDAR: diferença máxima de 10 minutos (comprovante deve ser do PASSADO, não do futuro)
      // Aceita comprovantes emitidos ATÉ 10 minutos atrás
      const valido = diferencaMinutos >= 0 && diferencaMinutos <= 10;
      
      if (valido) {
        console.log(`✅ DATA/HORA VÁLIDA! Comprovante emitido há ${diferencaMinutos.toFixed(1)} minutos`);
      } else {
        if (diferencaMinutos < 0) {
          console.log(`❌ DATA/HORA INVÁLIDA! Comprovante é do FUTURO (${Math.abs(diferencaMinutos).toFixed(1)} minutos adiantado)`);
        } else {
          console.log(`❌ DATA/HORA INVÁLIDA! Comprovante tem ${diferencaMinutos.toFixed(1)} minutos (máximo: 10 minutos)`);
        }
      }
      
      return valido;
      
    } catch (error) {
      console.error('❌ Erro na validação de data/hora:', error);
      return false;
    }
  }
  
  // ========== VALIDAÇÃO DE NOME ==========
  static isValidBeneficiary(name) {
    if (!name) return false;
    
    // Remover quebras de linha
    const cleanName = name.replace(/\n/g, ' ').trim().toLowerCase();
    
    // ACEITA DUAS FORMAS:
    // 1. Gustavo Santos Ribeiro (completo)
    // 2. Gustavo S Ribeiro (abreviado)
    const isValid = (
      cleanName.includes('gustavo') && 
      cleanName.includes('ribeiro') &&
      (cleanName.includes('santos') || cleanName.includes(' s ') || cleanName.includes(' s. '))
    );
    
    console.log(`👤 [NOME] Validando: "${name}" -> "${cleanName}" (${isValid ? '✅' : '❌'})`);
    return isValid;
  }
  
  // ========== VALIDAÇÃO DE VALOR ==========
  static isValidAmount(amount) {
    console.log('💰 [VALOR] Validando valor...');
    
    if (amount === undefined || amount === null) {
      console.log('❌ VALOR NULO OU INDEFINIDO');
      return false;
    }
    
    // VALOR MÍNIMO ACEITO: R$ 10,00
    const VALOR_MINIMO = 10.00;
    const TOLERANCIA = 0.009; // Menos de 1 centavo
    
    console.log(`💰 Valor mínimo aceito: R$ ${VALOR_MINIMO.toFixed(2)}`);
    console.log(`💰 Valor recebido: R$ ${amount.toFixed(2)}`);
    
    // Verificar se o valor é IGUAL ou MAIOR que R$ 10,00
    const valido = amount >= (VALOR_MINIMO - TOLERANCIA);
    
    if (valido) {
      console.log(`✅ VALOR ACEITO! R$ ${amount.toFixed(2)} (≥ R$ ${VALOR_MINIMO.toFixed(2)})`);
    } else {
      console.log('❌❌❌ VALOR REJEITADO! ❌❌❌');
      console.log(`🚨 MOTIVO: O valor deve ser IGUAL OU MAIOR que R$ ${VALOR_MINIMO.toFixed(2)}`);
      console.log(`🚨 Valor mínimo: R$ ${VALOR_MINIMO.toFixed(2)}`);
      console.log(`🚨 Valor recebido: R$ ${amount.toFixed(2)}`);
      console.log('🚨 O PAGAMENTO SERÁ REJEITADO!');
    }
    
    return valido;
  }
  
  // ========== PROCESSAMENTO PRINCIPAL ==========
  static async processarArquivo(file) {
    console.log('='.repeat(50));
    console.log('🔮 PROCESSANDO COMPROVANTE PIX');
    console.log('='.repeat(50));
    
    try {
      // Processar com OCR
      const ocrResult = await PaymentOCRService.processImage(file);
      
      if (!ocrResult.success) {
        console.log('⚠️ OCR encontrou problemas:', ocrResult.message);
        
        // Mesmo com problemas, tentar validar
        const data = ocrResult.data || {};
        
        const validations = {
          datetime: this.validateDateTime(data.date, data.time),
          beneficiary: this.isValidBeneficiary(data.beneficiary),
          amount: this.isValidAmount(data.amount)
        };
        
        console.log('📊 Validações:', validations);
        
        // Verificar se todos estão válidos
        const allValid = validations.datetime && 
                        validations.beneficiary && 
                        validations.amount;
        
        if (allValid) {
          // Salvar no banco de dados
          const registro = {
            id: Date.now().toString(),
            date: data.date,
            time: data.time,
            beneficiary: data.beneficiary,
            amount: data.amount,
            fileName: file.name,
            timestamp: new Date().toISOString(),
            status: 'validated'
          };
          
          // Salvar no localStorage
          const db = JSON.parse(localStorage.getItem('tarot_payments_db') || '[]');
          db.push(registro);
          localStorage.setItem('tarot_payments_db', JSON.stringify(db));
          
          console.log('✅✅✅ PAGAMENTO VALIDADO! ✅✅✅');
          return {
            valido: true,
            mensagem: '✅ Pagamento validado com sucesso!',
            paymentId: registro.id
          };
        }
        
        return {
          valido: false,
          mensagem: '❌ Dados incompletos no comprovante',
          necessidadeFormulario: true,
          dadosExtraidos: data
        };
      }
      
      // OCR completo
      const data = ocrResult.data;
      
      // Validar todos os campos
      const validacoes = {
        datetime: this.validateDateTime(data.date, data.time),
        nome: this.isValidBeneficiary(data.beneficiary),
        valor: this.isValidAmount(data.amount)
      };
      
      console.log('📊 Validações completas:', validacoes);
      
      if (validacoes.datetime && validacoes.nome && validacoes.valor) {
        // Salvar no banco de dados
        const registro = {
          id: Date.now().toString(),
          date: data.date,
          time: data.time,
          beneficiary: data.beneficiary,
          amount: data.amount,
          fileName: file.name,
          timestamp: new Date().toISOString(),
          status: 'validated',
          readingAccessed: false
        };
        
        const db = JSON.parse(localStorage.getItem('tarot_payments_db') || '[]');
        db.push(registro);
        localStorage.setItem('tarot_payments_db', JSON.stringify(db));
        
        console.log('✅✅✅ PAGAMENTO VALIDADO VIA OCR! ✅✅✅');
        return {
          valido: true,
          mensagem: '✅ Pagamento validado! Liberando consulta...',
          paymentId: registro.id
        };
      }
      
      return {
        valido: false,
        mensagem: '❌ Dados inválidos no comprovante',
        necessidadeFormulario: true,
        dadosExtraidos: data
      };
      
    } catch (error) {
      console.error('❌ ERRO NO PROCESSAMENTO:', error);
      return {
        valido: false,
        mensagem: `❌ Erro: ${error.message}`,
        necessidadeFormulario: true
      };
    }
  }
  
  // ========== FUNÇÕES DE ACESSO À LEITURA ==========
  static checkReadingAccess() {
    try {
      const db = JSON.parse(localStorage.getItem('tarot_payments_db') || '[]');
      return db.find(p => p.status === 'validated' && !p.readingAccessed);
    } catch {
      return null;
    }
  }
  
  static markReadingAsAccessed(paymentId) {
    try {
      const db = JSON.parse(localStorage.getItem('tarot_payments_db') || '[]');
      const updatedDb = db.map(p => 
        p.id === paymentId ? { ...p, readingAccessed: true } : p
      );
      localStorage.setItem('tarot_payments_db', JSON.stringify(updatedDb));
      return true;
    } catch {
      return false;
    }
  }
}

export default PaymentControlService;
