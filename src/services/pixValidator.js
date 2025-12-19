/**
 * VALIDADOR PIX - VERSÃO DEFINITIVA SEM TIMESTAMP
 * Sistema anti-fraude completo para GitHub Pages
 */

console.log('🔒 Validador PIX carregado - VERSÃO DEFINITIVA');

// CONFIGURAÇÕES
const VALOR_MINIMO = 10.00;
const NOMES_VALIDOS = [
    'GUSTAVO SANTOS RIBEIRO',
    'GUSTAVO S RIBEIRO', 
    'GUSTAVO S. RIBEIRO'
];
const STORAGE_KEY = 'pix_transactions_final_v7';

// Utilitários
function normalizarNome(nome) {
    return (nome || '').toUpperCase()
        .replace(/[.,-]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s/g, '');
}

function validarNome(nome) {
    const nomeNorm = normalizarNome(nome);
    const validos = NOMES_VALIDOS.map(normalizarNome);
    return validos.includes(nomeNorm);
}

function dataEHoje(dataStr) {
    try {
        if (!dataStr) return false;
        const hoje = new Date().toISOString().split('T')[0];
        const data = new Date(dataStr).toISOString().split('T')[0];
        return data === hoje;
    } catch {
        return false;
    }
}

// Sistema anti-duplicação
async function verificarDuplicado(id) {
    console.log(`🔍 Verificando duplicata: ${id}`);
    
    try {
        const storage = localStorage.getItem(STORAGE_KEY);
        if (storage) {
            const transacoes = JSON.parse(storage);
            const duplicata = transacoes.some(t => t.id === id);
            if (duplicata) {
                console.log(`❌ Duplicata encontrada: ${id}`);
                return true;
            }
        }
    } catch (e) {
        console.error('Erro anti-duplicação:', e);
    }
    
    console.log(`✅ Não é duplicata: ${id}`);
    return false;
}

async function registrarTransacao(dados) {
    const registro = {
        id: dados.transactionId,
        valor: dados.amount,
        nome: dados.payeeName,
        data: dados.paymentDate,
        registroEm: new Date().toISOString(), // SEM TIMESTAMP
        arquivo: dados.fileName || 'desconhecido'
    };
    
    try {
        const storage = localStorage.getItem(STORAGE_KEY);
        const lista = storage ? JSON.parse(storage) : [];
        lista.push(registro);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
        console.log('✅ Transação registrada:', registro.id);
    } catch (e) {
        console.error('Erro registro:', e);
    }
}

// VALIDAÇÃO PRINCIPAL
export async function validatePayment(dados) {
    console.log('='.repeat(40));
    console.log('🔍 VALIDAÇÃO PIX INICIADA');
    console.log('📊 Dados:', dados);
    
    // 1. Anti-duplicação
    console.log('1️⃣ Verificando duplicata...');
    const duplicado = await verificarDuplicado(dados.transactionId);
    if (duplicado) {
        console.log('❌ COMPROVANTE DUPLICADO');
        return {
            valid: false,
            error: 'COMPROVANTE DUPLICADO',
            details: 'Este comprovante já foi utilizado anteriormente.'
        };
    }
    
    // 2. Valor mínimo R$ 10,00
    console.log('2️⃣ Verificando valor mínimo...');
    const valor = parseFloat(dados.amount);
    if (isNaN(valor)) {
        console.log('❌ VALOR INVÁLIDO');
        return {
            valid: false,
            error: 'VALOR INVÁLIDO',
            details: 'O valor não é um número válido.'
        };
    }
    
    if (valor < VALOR_MINIMO) {
        console.log(`❌ VALOR INSUFICIENTE: R$ ${valor.toFixed(2)} < R$ ${VALOR_MINIMO.toFixed(2)}`);
        return {
            valid: false,
            error: 'VALOR INSUFICIENTE',
            details: `Valor R$ ${valor.toFixed(2)} é menor que o mínimo de R$ ${VALOR_MINIMO.toFixed(2)}`
        };
    }
    
    // 3. Nome do favorecido
    console.log('3️⃣ Verificando nome...');
    if (!dados.payeeName || !validarNome(dados.payeeName)) {
        console.log(`❌ NOME INVÁLIDO: "${dados.payeeName}"`);
        return {
            valid: false,
            error: 'NOME DO FAVORECIDO INVÁLIDO',
            details: `Nome deve ser: ${NOMES_VALIDOS.join(' ou ')}`
        };
    }
    
    // 4. Data do comprovante
    console.log('4️⃣ Verificando data...');
    if (!dados.paymentDate || !dataEHoje(dados.paymentDate)) {
        const hoje = new Date().toLocaleDateString('pt-BR');
        console.log(`❌ DATA INVÁLIDA: "${dados.paymentDate}" (hoje: ${hoje})`);
        return {
            valid: false,
            error: 'DATA INVÁLIDA',
            details: `Data do comprovante deve ser hoje (${hoje})`
        };
    }
    
    // TUDO OK!
    console.log('✅ Todas validações passaram!');
    await registrarTransacao(dados);
    
    console.log('='.repeat(40));
    console.log('🎉 PAGAMENTO VALIDADO COM SUCESSO!');
    console.log('='.repeat(40));
    
    return {
        valid: true,
        message: '✅ Pagamento validado com sucesso!',
        details: 'Comprovante aprovado. Gerando sua leitura de tarô...'
    };
}

export default validatePayment;
