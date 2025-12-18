/**
 * VALIDADOR DE PAGAMENTOS PIX
 * Aplica as 5 situações de validação:
 * 1. Duplicidade
 * 2. Nome incorreto
 * 3. Valor mínimo
 * 4. Data diferente
 * 5. Tudo OK
 */

// Banco de dados simulado para verificar duplicatas
const processedTransactions = new Set();

/**
 * Valida um pagamento PIX
 * @param {Object} paymentData - Dados do pagamento
 * @returns {Object} Resultado da validação
 */
export const validatePayment = async (paymentData) => {
  try {
    console.log('🔍 Validando pagamento:', paymentData);
    
    const hoje = new Date().toISOString().split('T')[0];
    const valorMinimo = 10.00; // VALOR CORRIGIDO: R$ 10,00
    
    // Converter amount para número
    const valor = parseFloat(paymentData.amount);
    
    // ============================================
    // SITUAÇÃO 1: TRANSÇÃO DUPLICADA
    // ============================================
    if (processedTransactions.has(paymentData.transactionId)) {
      console.log('❌ Situação 1: Transação duplicada');
      return {
        approved: false,
        message: 'RECUSADO: Transação duplicada',
        details: 'ID de transação já cadastrado no sistema. Faça um novo pagamento.',
        situation: 1,
        timestamp: new Date().toISOString()
      };
    }
    
    // ============================================
    // SITUAÇÃO 2: NOME DO FAVORECIDO INCORRETO
    // ============================================
    const nomeCorreto = 'GUSTAVO SANTOS RIBEIRO';
    if (paymentData.beneficiary !== nomeCorreto) {
      console.log('❌ Situação 2: Nome do favorecido incorreto');
      return {
        approved: false,
        message: 'RECUSADO: Nome incorreto',
        details: `Nome do favorecido não corresponde. Deve ser: ${nomeCorreto}`,
        situation: 2,
        timestamp: new Date().toISOString()
      };
    }
    
    // ============================================
    // SITUAÇÃO 3: VALOR MÍNIMO NÃO ATINGIDO
    // ============================================
    if (valor < valorMinimo) {
      console.log('❌ Situação 3: Valor mínimo não atingido');
      return {
        approved: false,
        message: 'RECUSADO: Valor insuficiente',
        details: `Valor mínimo não atingido. Mínimo: R$ ${valorMinimo.toFixed(2)}`,
        situation: 3,
        timestamp: new Date().toISOString()
      };
    }
    
    // ============================================
    // SITUAÇÃO 4: DATA DIFERENTE DA ATUAL
    // ============================================
    if (paymentData.date !== hoje) {
      console.log('❌ Situação 4: Data diferente da atual');
      return {
        approved: false,
        message: 'RECUSADO: Data incorreta',
        details: `Data da transação não é a data atual. Data do comprovante: ${paymentData.date}, Data atual: ${hoje}`,
        situation: 4,
        timestamp: new Date().toISOString()
      };
    }
    
    // ============================================
    // SITUAÇÃO 5: TUDO OK - APROVADO
    // ============================================
    console.log('✅ Situação 5: Tudo OK - Pagamento aprovado');
    
    // Registrar transação para evitar duplicatas
    processedTransactions.add(paymentData.transactionId);
    
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
    console.error('💥 Erro na validação:', error);
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
 * Limpar transações processadas (para testes)
 */
export const clearProcessedTransactions = () => {
  processedTransactions.clear();
  console.log('🧹 Transações processadas limpas');
};

// Exportar também como padrão para compatibilidade
export default validatePayment;
