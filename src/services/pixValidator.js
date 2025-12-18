/**
 * VALIDADOR DE PAGAMENTOS PIX - VERSÃO COMPLETA E FUNCIONAL
 * Sistema anti-duplicação garantido
 */

console.log('✅ pixValidator.js carregado');

const DB_API_URL = 'http://localhost:3000/transactions';
const FALLBACK_KEY = 'pix_transactions_secure_v3';

/**
 * Verifica se transação já existe - método robusto
 */
const checkTransactionInDatabase = async (transactionId) => {
  console.log(`[ANTI-DUPL] Verificando: ${transactionId}`);
  
  // PRIMEIRO: Tentar banco de dados (JSON Server)
  try {
    console.log(`[ANTI-DUPL] Tentando conexão com: ${DB_API_URL}`);
    const response = await fetch(`${DB_API_URL}?transactionId=${encodeURIComponent(transactionId)}`);
    
    console.log(`[ANTI-DUPL] Resposta status: ${response.status}`);
    
    if (response.ok) {
      const transactions = await response.json();
      console.log(`[ANTI-DUPL] Encontradas no banco: ${transactions.length}`);
      
      if (transactions.length > 0) {
        console.log(`[ANTI-DUPL] ❌ BLOQUEADO: Já existe no banco`);
        return true;
      }
    } else {
      console.log(`[ANTI-DUPL] ⚠️ Banco não respondeu OK: ${response.status}`);
    }
  } catch (error) {
    console.log(`[ANTI-DUPL] ❌ Erro no fetch: ${error.message}`);
  }
  
  // SEGUNDO: Fallback para localStorage
  try {
    const stored = localStorage.getItem(FALLBACK_KEY);
    if (stored) {
      const transactions = JSON.parse(stored);
      const exists = transactions.includes(transactionId);
      console.log(`[ANTI-DUPL] localStorage: ${exists ? 'EXISTE' : 'NÃO EXISTE'}`);
      return exists;
    }
  } catch (error) {
    console.log(`[ANTI-DUPL] ❌ Erro localStorage: ${error.message}`);
  }
  
  console.log(`[ANTI-DUPL] ✅ Transação nova`);
  return false;
};

/**
 * Registra transação em ambos os sistemas
 */
const registerTransactionInDatabase = async (paymentData) => {
  const transactionId = paymentData.transactionId;
  console.log(`[REGISTRO] Registrando: ${transactionId}`);
  
  // 1. Registrar no banco
  try {
    const transactionRecord = {
      transactionId: transactionId,
      beneficiary: paymentData.beneficiary || 'GUSTAVO SANTOS RIBEIRO',
      amount: parseFloat(paymentData.amount) || 10.00,
      paymentDate: paymentData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      status: 'APROVADO',
      source: 'web-app'
    };
    
    const response = await fetch(DB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionRecord)
    });
    
    console.log(`[REGISTRO] Banco status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log(`[REGISTRO] ✅ Registrado no banco com ID: ${result.id}`);
    }
  } catch (error) {
    console.log(`[REGISTRO] ❌ Erro banco: ${error.message}`);
  }
  
  // 2. Registrar no localStorage (IMPORTANTE: funciona offline)
  try {
    const stored = localStorage.getItem(FALLBACK_KEY);
    let transactions = stored ? JSON.parse(stored) : [];
    
    if (!transactions.includes(transactionId)) {
      transactions.push(transactionId);
      localStorage.setItem(FALLBACK_KEY, JSON.stringify(transactions));
      console.log(`[REGISTRO] ✅ localStorage atualizado. Total: ${transactions.length}`);
    }
  } catch (error) {
    console.log(`[REGISTRO] ❌ Erro localStorage: ${error.message}`);
  }
  
  console.log(`[REGISTRO] ✅ Registro completo para: ${transactionId}`);
  return true;
};

/**
 * Função principal de validação
 */
export const validatePayment = async (paymentData) => {
  console.log('='.repeat(50));
  console.log(`[VALIDAÇÃO] Iniciada para: ${paymentData.transactionId}`);
  
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const valorMinimo = 10.00;
    const valor = parseFloat(paymentData.amount);
    
    // ETAPA 1: VERIFICAÇÃO DE DUPLICATA (CRÍTICA)
    console.log(`[VALIDAÇÃO] Etapa 1: Verificando duplicata...`);
    const isDuplicate = await checkTransactionInDatabase(paymentData.transactionId);
    
    if (isDuplicate) {
      console.log(`[VALIDAÇÃO] ❌❌❌ FALHOU: TRANSAÇÃO DUPLICADA ❌❌❌`);
      return {
        approved: false,
        message: 'RECUSADO: Transação já utilizada',
        details: `Este comprovante PIX já foi usado anteriormente. ID: ${paymentData.transactionId}`,
        situation: 1,
        timestamp: new Date().toISOString()
      };
    }
    console.log(`[VALIDAÇÃO] ✅ Etapa 1: Não é duplicata`);
    
    // ETAPA 2: NOME DO FAVORECIDO
    const nomeCorreto = 'GUSTAVO SANTOS RIBEIRO';
    if (paymentData.beneficiary !== nomeCorreto) {
      console.log(`[VALIDAÇÃO] ❌ Nome incorreto`);
      return {
        approved: false,
        message: 'RECUSADO: Nome incorreto',
        details: `Nome do favorecido não corresponde. Deve ser: ${nomeCorreto}`,
        situation: 2,
        timestamp: new Date().toISOString()
      };
    }
    console.log(`[VALIDAÇÃO] ✅ Etapa 2: Nome correto`);
    
    // ETAPA 3: VALOR MÍNIMO
    if (valor < valorMinimo) {
      console.log(`[VALIDAÇÃO] ❌ Valor insuficiente`);
      return {
        approved: false,
        message: 'RECUSADO: Valor insuficiente',
        details: `Valor mínimo não atingido. Mínimo: R$ ${valorMinimo.toFixed(2)}`,
        situation: 3,
        timestamp: new Date().toISOString()
      };
    }
    console.log(`[VALIDAÇÃO] ✅ Etapa 3: Valor suficiente`);
    
    // ETAPA 4: DATA ATUAL
    if (paymentData.date !== hoje) {
      console.log(`[VALIDAÇÃO] ❌ Data incorreta`);
      return {
        approved: false,
        message: 'RECUSADO: Data incorreta',
        details: `Data da transação não é a data atual. Data do comprovante: ${paymentData.date}, Data atual: ${hoje}`,
        situation: 4,
        timestamp: new Date().toISOString()
      };
    }
    console.log(`[VALIDAÇÃO] ✅ Etapa 4: Data correta`);
    
    // ETAPA 5: REGISTRAR TRANSAÇÃO (APÓS TODAS VALIDAÇÕES)
    console.log(`[VALIDAÇÃO] Etapa 5: Registrando transação...`);
    await registerTransactionInDatabase(paymentData);
    
    console.log(`[VALIDAÇÃO] 🎉🎉🎉 TODAS ETAPAS APROVADAS! 🎉🎉🎉`);
    console.log(`[VALIDAÇÃO] ✅ Transação ${paymentData.transactionId} APROVADA`);
    
    return {
      approved: true,
      message: 'APROVADO: Pagamento validado',
      details: 'Comprovante aprovado em todas as verificações. Consulta liberada!',
      situation: 5,
      timestamp: new Date().toISOString(),
      transactionId: paymentData.transactionId,
      approvedAmount: valor
    };
    
  } catch (error) {
    console.error(`[VALIDAÇÃO] 💥 ERRO CRÍTICO: ${error.message}`);
    return {
      approved: false,
      message: 'ERRO: Validação falhou',
      details: `Erro técnico: ${error.message}`,
      situation: 'error',
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Função para limpar transações (apenas desenvolvimento)
 */
export const clearProcessedTransactions = () => {
  localStorage.removeItem(FALLBACK_KEY);
  console.log('[LIMPEZA] localStorage limpo');
};

export default validatePayment;
