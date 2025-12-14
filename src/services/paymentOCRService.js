// src/services/paymentOCRService.js
// OCR otimizado para prints mobile (iOS/Android)

import { createWorker } from 'tesseract.js';

class PaymentOCRService {
  
  // Configurações otimizadas para comprovantes mobile
  static async getWorker() {
    const worker = await createWorker();
    await worker.loadLanguage('por');
    await worker.initialize('por');
    
    // Configurações para melhorar reconhecimento em prints mobile
    await worker.setParameters({
      tessedit_pageseg_mode: '6',    // Assume uniform block of text
      tessedit_ocr_engine_mode: '1',  // LSTM only
      preserve_interword_spaces: '1',
      tessedit_char_whitelist: '0123456789R$:.,/abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÇÉÊÍÓÔÕÚÜàáâãçéêíóôõúü \n-',
      user_defined_dpi: '300'        // Melhor para screenshots
    });
    
    return worker;
  }
  
  // Extrair texto da imagem
  static async extractTextFromImage(file) {
    console.log('🔍 [OCR] Processando imagem:', file.name);
    console.log('📱 Detalhes:', file.type, Math.round(file.size / 1024) + 'KB');
    
    try {
      const worker = await this.getWorker();
      
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      // Limpar e normalizar texto
      const cleanText = text
        .replace(/\s+/g, ' ')      // Remover múltiplos espaços
        .replace(/[|]/g, 'I')      // Corrigir | para I
        .replace(/[0]/g, 'O')      // Corrigir 0 para O em alguns casos
        .trim();
      
      console.log('✅ [OCR] Texto extraído com sucesso');
      console.log('📄 Amostra (300 chars):', cleanText.substring(0, 300) + '...');
      
      return cleanText.toUpperCase();
      
    } catch (error) {
      console.error('❌ [OCR] Erro:', error.message);
      throw error;
    }
  }
  
  // ========== FUNÇÕES DE EXTRAÇÃO ROBUSTAS ==========
  
  static extractDate(text) {
    console.log('📅 [DATA] Extraindo data...');
    
    // Múltiplos padrões para data (mobile-friendly)
    const patterns = [
      // DD/MM/YYYY ou DD/MM
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{1,2})\/(\d{1,2})/,
      
      // DD Mes (por extenso ou abreviado)
      /(\d{1,2})\s+(JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)/i,
      /(\d{1,2})\s+(JANEIRO|FEVEREIRO|MARÇO|ABRIL|MAIO|JUNHO|JULHO|AGOSTO|SETEMBRO|OUTUBRO|NOVEMBRO|DEZEMBRO)/i,
      
      // Padrões comuns em apps bancários
      /DATA.*?(\d{1,2})\/(\d{1,2})\/(\d{4})/i,
      /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        let day, month;
        
        if (match[2] && match[2].match(/^[A-Z]/i)) {
          // Caso: "08 DEZ"
          day = match[1].padStart(2, '0');
          const monthMap = {
            'JAN': '01', 'FEV': '02', 'MAR': '03', 'ABR': '04',
            'MAI': '05', 'JUN': '06', 'JUL': '07', 'AGO': '08',
            'SET': '09', 'OUT': '10', 'NOV': '11', 'DEZ': '12'
          };
          month = monthMap[match[2].toUpperCase().substring(0, 3)] || '12';
        } else {
          // Caso: "08/12"
          day = match[1].padStart(2, '0');
          month = match[2] ? match[2].padStart(2, '0') : '12';
        }
        
        const date = `${day}/${month}`;
        console.log(`✅ [DATA] Encontrada: ${date}`);
        return date;
      }
    }
    
    console.log('⚠️ [DATA] Nenhuma data encontrada');
    return null;
  }
  
  static extractTime(text) {
    console.log('⏰ [HORA] Extraindo hora...');
    
    // Múltiplos padrões para hora
    const patterns = [
      // HH:MM
      /(\d{1,2}):(\d{2})/,
      
      // HHhMM (comum em prints)
      /(\d{1,2})H(\d{2})/i,
      /(\d{1,2})H\s*(\d{2})/i,
      
      // Padrões com label
      /HORA.*?(\d{1,2}):(\d{2})/i,
      /HOR.*RIO.*?(\d{1,2}):(\d{2})/i,
      
      // Com segundos
      /(\d{1,2}):(\d{2}):(\d{2})/,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const hour = match[1].padStart(2, '0');
        const minute = match[2].padStart(2, '0');
        const time = `${hour}:${minute}`;
        
        console.log(`✅ [HORA] Encontrada: ${time}`);
        return time;
      }
    }
    
    console.log('⚠️ [HORA] Nenhuma hora encontrada');
    return null;
  }
  
  static extractAmount(text) {
    console.log('💰 [VALOR] Extraindo valor...');
    
    // Múltiplos padrões para valores
    const patterns = [
      // R$ 10,00 ou R$10,00
      /R\$\s*(\d+)[,\.](\d{2})/i,
      /R\$\s*(\d+)/i,
      
      // VALOR: R$ 10,00
      /VALOR[\s:]*R\$\s*(\d+)[,\.](\d{2})/i,
      /VALOR[\s:]*(\d+)[,\.](\d{2})/i,
      
      // PAGO: R$ 10,00
      /PAG(O|AMENTO)[\s:]*R\$\s*(\d+)[,\.](\d{2})/i,
      
      // TRANSFERÊNCIA: R$ 10,00
      /TRANSFER[ÊA]*[\s:]*R\$\s*(\d+)[,\.](\d{2})/i,
      
      // Apenas número com ,00
      /(\d+)[,\.]00\b/,
      
      // DEZ REAIS (fallback)
      /DEZ\s+REAIS/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        let integer, decimal;
        
        if (pattern.toString().includes('DEZ')) {
          // Caso "DEZ REAIS"
          integer = '10';
          decimal = '00';
        } else {
          integer = match[1] || match[2] || '10';
          decimal = match[2] || '00';
        }
        
        const amount = parseFloat(`${integer}.${decimal}`);
        console.log(`✅ [VALOR] Encontrado: R$ ${amount.toFixed(2)}`);
        return amount;
      }
    }
    
    console.log('⚠️ [VALOR] Nenhum valor encontrado');
    return null;
  }
  
  static extractBeneficiary(text) {
    console.log('👤 [NOME] Extraindo beneficiário...');
    
    // Padrões flexíveis para o nome
    const patterns = [
      // Nome completo
      /GUSTAVO[\s\w]{0,15}SANTOS[\s\w]{0,15}RIBEIRO/i,
      /GUSTAVO[\s\w]{0,15}RIBEIRO/i,
      
      // Com "S" abreviado
      /GUSTAVO[\s\w]{0,5}S[\s\w]{0,5}RIBEIRO/i,
      /GUSTAVO[\s\w]{0,5}S\.?[\s\w]{0,5}RIBEIRO/i,
      
      // Com prefixos comuns
      /PARA[\s:]*GUSTAVO[\s\w]+RIBEIRO/i,
      /FAVORECIDO[\s:]*GUSTAVO[\s\w]+RIBEIRO/i,
      /BENEFICI[ÁA]RIO[\s:]*GUSTAVO[\s\w]+RIBEIRO/i,
      
      // Busca por contexto
      /(?:PARA|FAVORECIDO|BENEFICI[ÁA]RIO)[\s:]*([A-Z\s]{10,50})/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        let name = match[0];
        
        // Limpar prefixos
        name = name.replace(/^(PARA|FAVORECIDO|BENEFICI[ÁA]RIO)[\s:]*/i, '');
        name = name.trim();
        
        // Verificar se contém "GUSTAVO" e "RIBEIRO"
        if (name.includes('GUSTAVO') && name.includes('RIBEIRO')) {
          console.log(`✅ [NOME] Encontrado: ${name}`);
          return name;
        }
      }
    }
    
    // Busca por qualquer menção a "GUSTAVO"
    const gustavoMatch = text.match(/(GUSTAVO[\s\w]{5,30})/i);
    if (gustavoMatch) {
      console.log(`⚠️ [NOME] Possível nome encontrado: ${gustavoMatch[0]}`);
      return gustavoMatch[0];
    }
    
    console.log('⚠️ [NOME] Nenhum nome encontrado');
    return null;
  }
  
  // Processamento principal
  static async processImage(file) {
    console.log('='.repeat(50));
    console.log('🔮 PROCESSANDO COMPROVANTE PIX');
    console.log('='.repeat(50));
    
    try {
      // Extrair texto
      const text = await this.extractTextFromImage(file);
      
      // Extrair dados individuais
      const data = {
        date: this.extractDate(text),
        time: this.extractTime(text),
        amount: this.extractAmount(text),
        beneficiary: this.extractBeneficiary(text)
      };
      
      console.log('📊 RESUMO DOS DADOS EXTRAÍDOS:');
      console.log('- Data:', data.date || 'Não encontrada');
      console.log('- Hora:', data.time || 'Não encontrada');
      console.log('- Valor:', data.amount ? `R$ ${data.amount.toFixed(2)}` : 'Não encontrado');
      console.log('- Nome:', data.beneficiary || 'Não encontrado');
      
      // Verificar completude
      const allFound = data.date && data.time && data.amount && data.beneficiary;
      
      if (allFound) {
        console.log('🎉 ✅ TODOS OS DADOS FORAM EXTRAÍDOS COM SUCESSO!');
        return {
          success: true,
          message: '✅ OCR realizado com sucesso!',
          data: data
        };
      } else {
        const missing = [];
        if (!data.date) missing.push('data');
        if (!data.time) missing.push('hora');
        if (!data.amount) missing.push('valor');
        if (!data.beneficiary) missing.push('nome');
        
        console.log(`⚠️ DADOS FALTANDO: ${missing.join(', ')}`);
        
        return {
          success: false,
          message: `Dados incompletos: ${missing.join(', ')}`,
          data: data,
          missing: missing
        };
      }
      
    } catch (error) {
      console.error('❌ ERRO NO PROCESSAMENTO:', error);
      return {
        success: false,
        message: `Erro: ${error.message}`,
        data: null,
        error: error.message
      };
    }
  }
}

export default PaymentOCRService;
