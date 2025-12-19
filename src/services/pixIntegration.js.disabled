// Integração do novo validador PIX com sistema existente
import { pixValidator } from './enhancedPixValidator.js';

// Função compatível com API atual
export async function validatePIXPayment(paymentData) {
    try {
        const result = await pixValidator.validateReceipt({
            beneficiary: paymentData.beneficiary || paymentData.nomeFavorecido || paymentData.nome,
            amount: paymentData.amount || paymentData.valor || paymentData.value,
            date: paymentData.date || paymentData.data || paymentData.transactionDate,
            transactionId: paymentData.transactionId || paymentData.idTransacao || paymentData.id
        });
        
        return {
            valid: result.status === 'APROVADO',
            status: result.status,
            message: result.message,
            details: result.details,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            valid: false,
            status: 'ERRO',
            message: 'Erro na validação do comprovante',
            details: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Função para verificar status de uma transação
export async function checkTransactionStatus(transactionId) {
    try {
        const exists = await pixValidator.checkTransactionExists(transactionId);
        return {
            exists: exists,
            message: exists ? 'Transação já validada' : 'Transação não encontrada',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            exists: false,
            message: 'Erro ao verificar transação',
            details: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Adicionar ao objeto global para compatibilidade
if (typeof window !== 'undefined') {
    window.PIXValidation = {
        validate: validatePIXPayment,
        checkStatus: checkTransactionStatus
    };
}

console.log('✅ Sistema de validação PIX aprimorado integrado');
