// src/services/paymentControl.js
// Sistema flexível com OCR

import PaymentOCRService from './paymentOCRService.js';

class PaymentControlService {
  
  static isToday(dateString) {
    try {
      if (!dateString) return false;
      
      const hoje = new Date();
      const diaHoje = String(hoje.getDate()).padStart(2, '0');
      const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
      const hojeFormatado = `${diaHoje}/${mesHoje}`;
      
      console.log(`📅 Validando data: "${dateString}" (hoje: ${hojeFormatado})`);
      
      // Se já for DD/MM
      if (dateString.includes('/')) {
        return dateString === hojeFormatado;
      }
      
      // Converter "08 Dez" para "08/12"
      const monthMap = {
        'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04',
        'mai': '05', 'jun': '06', 'jul': '07', 'ago': '08',
        'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
      };
      
      // Extrair dia e mês
      const parts = dateString.split(' ');
      if (parts.length >= 2) {
        const day = parts[0].padStart(2, '0');
        const monthName = parts[1].toLowerCase().substring(0, 3);
        
        if (monthMap[monthName]) {
          const convertedDate = `${day}/${monthMap[monthName]}`;
          console.log(`📅 Convertido "${dateString}" para "${convertedDate}"`);
          return convertedDate === hojeFormatado;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Erro na validação da data:', error);
      return false;
    }
  }
  
  static isWithin5Minutes(timeString) {
    try {
      if (!timeString) return false;
      
      const agora = new Date();
      const agoraMin = agora.getHours() * 60 + agora.getMinutes();
      
      // Converter "20h24" para "20:24"
      let cleanTime = timeString.replace('h', ':');
      const [hour, minute] = cleanTime.split(':').map(Number);
      const compMin = hour * 60 + minute;
      
      const diff = agoraMin - compMin;
      const isValid = diff >= 0 && diff <= 5;
      
      console.log(`⏰ ${timeString} -> Diferença: ${diff} minutos (${isValid ? '✅' : '❌'})`);
      return isValid;
    } catch (error) {
      console.error('Erro na validação da hora:', error);
      return false;
    }
  }
  
  static isValidBeneficiary(name) {
    if (!name) return false;
    
    // Remover quebras de linha
    const cleanName = name.replace(/\n/g, ' ').trim();
    const isValid = cleanName.toLowerCase().includes('gustavo') && 
                    cleanName.toLowerCase().includes('ribeiro');
    
    console.log(`👤 Validando nome: "${name}" -> "${cleanName}" (${isValid ? '✅' : '❌'})`);
    return isValid;
  }
  
    static isValidAmount(amount) {
    console.log('💰 [VALIDAÇÃO RIGOROSA] Iniciando...');
    
    if (amount === undefined || amount === null) {
      console.log('❌ VALOR NULO OU INDEFINIDO');
      return false;
    }
    
    // VALOR EXATO EXIGIDO: R$ 10,00
    const VALOR_EXIGIDO = 10.00;
    const TOLERANCIA = 0.009; // Menos de 1 centavo
    
    console.log('💰 Valor exigido: R$ ' + VALOR_EXIGIDO.toFixed(2));
    console.log('💰 Valor recebido: R$ ' + amount.toFixed(2));
    
    const diferenca = Math.abs(amount - VALOR_EXIGIDO);
    const valido = diferenca <= TOLERANCIA;
    
    console.log('💰 Diferença: R$ ' + diferenca.toFixed(4));
    
    if (valido) {
      console.log('✅ VALOR CORRETO! R$ 10,00 exatos.');
    } else {
      console.log('❌❌❌ VALOR INCORRETO! ❌❌❌');
      console.log('🚨 MOTIVO: O valor deve ser EXATAMENTE R$ 10,00');
      console.log('🚨 Valor recebido: R$ ' + amount.toFixed(2));
      console.log('🚨 O PAGAMENTO SERÁ REJEITADO!');
    }
    
    return valido;
  }  static async processarArquivo(file) {
    console.log('='.repeat(50));
    console.log('🔮 PROCESSANDO COMPROVANTE');
    console.log('='.repeat(50));
    
    try {
      // Processar com OCR
      const ocrResult = await PaymentOCRService.processImage(file);
      
      if (!ocrResult.success) {
        console.log('⚠️ OCR encontrou problemas:', ocrResult.message);
        
        // Mesmo com problemas, tentar validar
        const data = ocrResult.data || {};
        
        const validations = {
          date: this.isToday(data.date),
          time: this.isWithin5Minutes(data.time),
          beneficiary: this.isValidBeneficiary(data.beneficiary),
          amount: this.isValidAmount(data.amount)
        };
        
        console.log('📊 Validações:', validations);
        
        // Verificar se todos estão válidos
        const allValid = validations.date && validations.time && 
                        validations.beneficiary && validations.amount;
        
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
        data: this.isToday(data.date),
        hora: this.isWithin5Minutes(data.time),
        nome: this.isValidBeneficiary(data.beneficiary),
        valor: this.isValidAmount(data.amount)
      };
      
      console.log('📊 Validações completas:', validacoes);
      
      if (validacoes.data && validacoes.hora && validacoes.nome && validacoes.valor) {
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
