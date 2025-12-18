// Serviço de validação PIX compatível com Node.js e Browser

const API_URL = 'http://localhost:3001';

// Helper para localStorage seguro (compatível Node.js + Browser)
const getSafeLocalStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  // Mock para Node.js
  return {
    store: {},
    getItem: function(key) {
      return this.store[key] || null;
    },
    setItem: function(key, value) {
      this.store[key] = String(value);
    },
    clear: function() {
      this.store = {};
    }
  };
};

// Helper para fetch seguro
const safeFetch = async (url, options) => {
  try {
    // No browser, fetch está disponível globalmente
    // No Node.js 18+, fetch está disponível
    if (typeof fetch !== 'undefined') {
      return await fetch(url, options);
    }
    // Para Node.js antigo, você precisaria instalar node-fetch
    throw new Error('fetch não disponível');
  } catch (error) {
    console.warn('Fetch não disponível:', error.message);
    throw error;
  }
};
// Verificar se ID já existe
const checkTransactionId = async (transactionId) => {
  try {
    const response = await safeFetch(`${API_URL}/transactions?transactionId=${transactionId}`);
    if (response.ok) {
      const data = await response.json();
      return data.length === 0;
    }
  } catch (error) {
    console.warn('API não disponível, usando storage local');
  }
  
  // Fallback para localStorage (ou mock)
  const storage = getSafeLocalStorage();
  const transactions = JSON.parse(storage.getItem('pix_transactions') || '[]');
  return !transactions.some(t => t.transactionId === transactionId);
};

// Salvar transação
const saveTransaction = async (data) => {
  try {
    await safeFetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        createdAt: new Date().toISOString()
      })
    });
  } catch (error) {
    console.warn('Salvando localmente');
  }
  
  // Fallback
  const storage = getSafeLocalStorage();
  const transactions = JSON.parse(storage.getItem('pix_transactions') || '[]');
  transactions.push({
    ...data,
    id: Date.now(),
    createdAt: new Date().toISOString()
  });
  storage.setItem('pix_transactions', JSON.stringify(transactions));
};
// Extrair dados do texto OCR
const extractPixData = (ocrText) => {
  const result = {
    beneficiary: '',
    amount: 0,
    date: new Date(),
    transactionId: '',
    rawText: ocrText
  };
  
  const text = ocrText.toUpperCase();
  
  // 1. Favorecido
  if (text.includes('GUSTAVO SANTOS RIBEIRO')) {
    result.beneficiary = 'GUSTAVO SANTOS RIBEIRO';
  } else if (text.includes('GUSTAVO S RIBEIRO')) {
    result.beneficiary = 'GUSTAVO S RIBEIRO';
  }
  
  // 2. Valor (procura em diferentes formatos)
  let valorMatch = text.match(/R\$\s*(\d+[.,]\d+)/);
  if (!valorMatch) valorMatch = text.match(/VALOR[:\s]*(\d+[.,]\d+)/);
  if (!valorMatch) valorMatch = text.match(/(\d+[.,]\d+)\s*REAIS/);
  
  if (valorMatch) {
    result.amount = parseFloat(valorMatch[1].replace(',', '.'));
  }
  
  // 3. Data (formato: DD/MM/AAAA HH:MM)
  const dataMatch = text.match(/(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2})/);
  if (dataMatch) {
    const [dia, mes, ano, hora, minuto] = dataMatch[0].match(/\d+/g);
    result.date = new Date(ano, mes-1, dia, hora, minuto);
  }
  
  // 4. ID da transação
  let idMatch = text.match(/ID[:\s]*([A-Z0-9]{8,})/);
  if (!idMatch) idMatch = text.match(/TRANSACAO[:\s]*([A-Z0-9]{8,})/);
  if (!idMatch) idMatch = text.match(/PIX[:\s]*([A-Z0-9]{8,})/);
  if (!idMatch) {
    // Extrai qualquer sequência alfanumérica longa
    const matches = text.match(/([A-Z0-9]{10,})/g);
    if (matches && matches.length > 0) {
      // Pega a primeira sequência longa que não parece ser outra coisa
      for (const match of matches) {
        if (!match.includes('PIX') && !match.includes('CPF') && !match.includes('CNPJ')) {
          idMatch = [match, match];
          break;
        }
      }
    }
  }
  
  if (idMatch) {
    result.transactionId = idMatch[1];
  } else {
    // Gera ID único como fallback
    result.transactionId = 'PIX' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  
  return result;
};
// VALIDAÇÃO PRINCIPAL
export const validatePaymentReceipt = async (ocrText) => {
  console.log('🔍 Iniciando validação PIX...');
  
  const extractedData = extractPixData(ocrText);
  const errors = [];
  const details = {};
  
  // 1. Validação do FAVORECIDO
  details.beneficiary = !!extractedData.beneficiary;
  if (!details.beneficiary) {
    errors.push('Favorecido não corresponde. Deve ser: GUSTAVO SANTOS RIBEIRO ou GUSTAVO S RIBEIRO');
  }
  
  // 2. Validação do VALOR MÍNIMO
  details.amount = extractedData.amount >= 10.00;
  if (!details.amount) {
    errors.push(`Valor R$${extractedData.amount.toFixed(2)} é menor que o mínimo de R$10,00`);
  }
  
  // 3. Validação da DATA (5 minutos de tolerância)
  const now = new Date();
  const timeDiff = Math.abs(now - extractedData.date);
  details.date = timeDiff <= 5 * 60 * 1000;
  if (!details.date) {
    const diffMinutes = Math.floor(timeDiff / 60000);
    errors.push(`Comprovante com ${diffMinutes} minutos (limite: 5 minutos)`);
  }
  
  // 4. Validação do ID ÚNICO
  try {
    details.transactionIdUnique = await checkTransactionId(extractedData.transactionId);
    if (!details.transactionIdUnique) {
      errors.push('ID de transação já utilizado. Faça um novo pagamento.');
    }
  } catch (error) {
    console.warn('Erro ao verificar ID único:', error.message);
    details.transactionIdUnique = true; // Assume único se não conseguir verificar
  }
  
  // Resultado final
  const isValid = errors.length === 0;
  
  // Se válido, salvar transação
  if (isValid) {
    try {
      await saveTransaction({
        transactionId: extractedData.transactionId,
        amount: extractedData.amount,
        beneficiary: extractedData.beneficiary,
        paymentDate: extractedData.date.toISOString()
      });
    } catch (saveError) {
      console.warn('Erro ao salvar transação:', saveError.message);
    }
  }
  
  return {
    isValid,
    extractedData,
    errors,
    details,
    timestamp: new Date().toISOString()
  };
};
// Limpar transações antigas (6 meses)
export const cleanOldTransactions = () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const storage = getSafeLocalStorage();
  const transactions = JSON.parse(storage.getItem('pix_transactions') || '[]');
  const filtered = transactions.filter(t => new Date(t.createdAt) > sixMonthsAgo);
  storage.setItem('pix_transactions', JSON.stringify(filtered));
  
  console.log(`🧹 Limpadas ${transactions.length - filtered.length} transações antigas`);
};

// Executar limpeza ao carregar (apenas no browser)
if (typeof window !== 'undefined') {
  cleanOldTransactions();
}
