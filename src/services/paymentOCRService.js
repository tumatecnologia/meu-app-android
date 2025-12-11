// src/services/paymentOCRService.js
// VERSÃO SIMPLIFICADA - FUNCIONAL

import Tesseract from 'tesseract.js';

class PaymentOCRService {
  
  static async extractTextFromImage(file) {
    console.log('🔍 [OCR] Processando:', file.name);
    
    try {
      const result = await Tesseract.recognize(
        file,
        'por',
        { 
          logger: m => console.log('📊 [OCR] Progresso:', m.progress),
          tessedit_char_whitelist: '0123456789/:,.R$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZàáâãçèéêíóôõúü \n-'
        }
      );
      
      console.log('✅ [OCR] Concluído');
      const text = result.data.text;
      console.log('📄 [OCR] Texto extraído (amostra):', text.substring(0, 200));
      return text;
    } catch (error) {
      console.error('❌ [OCR] Erro:', error);
      throw error;
    }
  }
  
  static extractDate(text) {
    console.log('📅 [DATA] Extraindo data...');
    
    // Buscar "08 Dez 2025" de forma SIMPLES
    // Primeiro, encontrar a linha que contém a data
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      // Procurar por padrões comuns
      if (line.includes('dez') && /\d/.test(line)) {
        console.log('🔍 [DATA] Linha encontrada:', lines[i]);
        
        // Extrair número do dia
        const dayMatch = line.match(/(\d{1,2})/);
        if (dayMatch) {
          const day = dayMatch[1].padStart(2, '0');
          const month = '12'; // Dezembro
          const date = `${day}/${month}`;
          console.log(`✅ [DATA] Extraída: ${date}`);
          return date;
        }
      }
    }
    
    // Se não encontrou, tentar regex direto
    const patterns = [
      /(\d{1,2})\s+dez\s+(\d{4})/i,
      /(\d{1,2})\s+dezembro\s+(\d{4})/i,
      /(\d{1,2})\/12\/(\d{4})/i,
      /(\d{1,2})\/12/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const day = match[1].padStart(2, '0');
        const date = `${day}/12`;
        console.log(`✅ [DATA] Regex encontrou: ${date}`);
        return date;
      }
    }
    
    console.log('❌ [DATA] Nenhuma data encontrada');
    return null;
  }
  
  static extractTime(text) {
    console.log('⏰ [HORA] Extraindo hora...');
    
    // Procurar por "20h24" ou "20:24"
    const patterns = [
      /(\d{1,2})h(\d{2})/i,
      /(\d{1,2}):(\d{2})/,
      /(\d{1,2})\.(\d{2})/
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const hour = match[1].padStart(2, '0');
        const minute = match[2];
        const time = `${hour}:${minute}`;
        console.log(`✅ [HORA] Encontrada: ${time}`);
        return time;
      }
    }
    
    console.log('❌ [HORA] Nenhuma hora encontrada');
    return null;
  }
  
  static extractAmount(text) {
    console.log('💰 [VALOR] Extraindo valor...');
    
    // Procurar por "R$ 10,00"
    const pattern = /R\$\s*(\d+)[,\.](\d{2})/i;
    const match = text.match(pattern);
    
    if (match) {
      const amount = parseFloat(`${match[1]}.${match[2]}`);
      console.log(`✅ [VALOR] Encontrado: R$ ${amount.toFixed(2)}`);
      return amount;
    }
    
    console.log('❌ [VALOR] Nenhum valor encontrado');
    return null;
  }
  
  static extractBeneficiary(text) {
    console.log('👤 [NOME] Extraindo beneficiário...');
    
    // Procurar por "Gustavo Santos Ribeiro"
    const patterns = [
      /Gustavo\s+Santos\s+Ribeiro/i,
      /Gustavo[\s\w]+Ribeiro/i,
      /para\s+Gustavo[\s\w]+/i,
      /favorecido.*Gustavo[\s\w]+/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const name = match[0].replace(/^(para|favorecido):?\s*/i, '').trim();
        console.log(`✅ [NOME] Encontrado: ${name}`);
        return name;
      }
    }
    
    console.log('❌ [NOME] Nenhum nome encontrado');
    return null;
  }
  
  static async processImage(file) {
    console.log('🔄 [PROCESSO] Iniciando processamento da imagem...');
    
    try {
      const text = await this.extractTextFromImage(file);
      
      const data = {
        date: this.extractDate(text),
        time: this.extractTime(text),
        amount: this.extractAmount(text),
        beneficiary: this.extractBeneficiary(text),
        rawText: text.substring(0, 500) // Apenas para logs
      };
      
      console.log('📦 [PROCESSO] Dados extraídos:', JSON.stringify(data, null, 2));
      
      // Verificar se todos os dados foram encontrados
      const allFound = data.date && data.time && data.amount && data.beneficiary;
      
      if (allFound) {
        console.log('🎉 [PROCESSO] TODOS os dados foram extraídos com sucesso!');
        return {
          success: true,
          data,
          message: '✅ Todos dados extraídos!'
        };
      } else {
        const missing = [];
        if (!data.date) missing.push('data');
        if (!data.time) missing.push('hora');
        if (!data.amount) missing.push('valor');
        if (!data.beneficiary) missing.push('nome');
        
        console.log(`⚠️ [PROCESSO] Dados faltando: ${missing.join(', ')}`);
        return {
          success: false,
          data,
          missing,
          message: `Faltando: ${missing.join(', ')}`
        };
      }
      
    } catch (error) {
      console.error('❌ [PROCESSO] Erro:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro ao processar imagem'
      };
    }
  }
}

export default PaymentOCRService;
