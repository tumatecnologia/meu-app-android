// Serviço de validação PIX compatível com Node.js e Browser

const API_URL = 'http://localhost:3001';

// Helper para localStorage seguro
const getSafeLocalStorage = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }
  // Mock para Node.js
  return {
    getItem: (key) => null,
    setItem: (key, value) => {},
    clear: () => {}
  };
};

// Verificar se ID já existe
const checkTransactionId = async (transactionId) => {
  try {
    const response = await fetch(\`\${API_URL}/transactions?transactionId=\${transactionId}\`);
    if (response.ok) {
      const data = await response.json();
      return data.length === 0;
    }
  } catch (error) {
    console.warn('API não disponível');
  }
  
  // Fallback para localStorage (ou mock)
  const storage = getSafeLocalStorage();
  const transactions = JSON.parse(storage.getItem('pix_transactions') || '[]');
  return !transactions.some(t => t.transactionId === transactionId);
};

// Salvar transação
const saveTransaction = async (data) => {
  try {
    await fetch(\`\${API_URL}/transactions\`, {
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

// ... (resto do código permanece igual ao pixValidator.js original)

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
    errors.push(\`Valor R$\${extractedData.amount.toFixed(2)} é menor que o mínimo de R$10,00\`);
  }
  
  // 3. Validação da DATA (5 minutos de tolerância)
  const now = new Date();
  const timeDiff = Math.abs(now - extractedData.date);
  details.date = timeDiff <= 5 * 60 * 1000;
  if (!details.date) {
    const diffMinutes = Math.floor(timeDiff / 60000);
    errors.push(\`Comprovante com \${diffMinutes} minutos (limite: 5 minutos)\`);
  }
  
  // 4. Validação do ID ÚNICO
  details.transactionIdUnique = await checkTransactionId(extractedData.transactionId);
  if (!details.transactionIdUnique) {
    errors.push('ID de transação já utilizado. Faça um novo pagamento.');
  }
  
  // Resultado final
  const isValid = errors.length === 0;
  
  // Se válido, salvar transação
  if (isValid) {
    await saveTransaction({
      transactionId: extractedData.transactionId,
      amount: extractedData.amount,
      beneficiary: extractedData.beneficiary,
      paymentDate: extractedData.date.toISOString()
    });
  }
  
  return {
    isValid,
    extractedData,
    errors,
    details,
    timestamp: new Date().toISOString()
  };
};

// ... (resto das funções)
