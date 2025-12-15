// ==============================================
// NOVO SISTEMA PIX - VERSÃO 2.0
// Implementação completa das 5 situações
// ==============================================

import { pixValidator } from './enhancedPixValidator.js';

// ========== EXPORTAÇÃO PRINCIPAL ==========
export async function validatePayment(paymentData) {
    console.log('🔍 Validando PIX:', paymentData);
    
    try {
        const result = await pixValidator.validateReceipt({
            beneficiary: paymentData.beneficiary || paymentData.nomeFavorecido,
            amount: paymentData.amount || paymentData.valor,
            date: paymentData.date || paymentData.data,
            transactionId: paymentData.transactionId || paymentData.idTransacao
        });
        
        return {
            success: result.status === 'APROVADO',
            approved: result.status === 'APROVADO',
            status: result.status,
            message: result.message,
            details: result.details
        };
    } catch (error) {
        return {
            success: false,
            approved: false,
            status: 'ERRO',
            message: 'Erro na validação',
            details: error.message
        };
    }
}

// ========== OUTRAS EXPORTAÇÕES ==========
export async function checkDuplicateTransaction(transactionId) {
    try {
        const exists = await pixValidator.checkTransactionExists(transactionId);
        return { exists, message: exists ? 'Duplicada' : 'Nova' };
    } catch (error) {
        return { exists: false, message: error.message };
    }
}

export async function clearPIXData() {
    try {
        localStorage.removeItem('lastPixCleanup');
        return { success: true, message: 'Dados resetados' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ========== COMPATIBILIDADE ==========
export const validatePIX = validatePayment;

// ========== EXPORTAÇÃO PADRÃO ==========
export default {
    validatePayment,
    checkDuplicateTransaction,
    clearPIXData,
    validatePIX
};
