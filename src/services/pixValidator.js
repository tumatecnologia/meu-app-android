/**
 * VALIDADOR DE PAGAMENTOS PIX - VERSÃO 5.0 CORRIGIDA
 * BLOQUEIA:
 * 1. Comprovantes duplicados
 * 2. Valores < R$ 10,00
 * 3. Nomes diferentes de "GUSTAVO SANTOS RIBEIRO" ou "GUSTAVO S RIBEIRO"
 * 4. Datas que não são hoje
 */

console.log('✅ pixValidator.js v5.0 carregado - CORRIGIDO PARA GITHUB PAGES');

const VALOR_MINIMO = 10.00;
const NOMES_PERMITIDOS = ['GUSTAVO SANTOS RIBEIRO', 'GUSTAVO S RIBEIRO', 'GUSTAVO S. RIBEIRO'];
const STORAGE_KEY = 'pix_transactions_secure_v5';

// Normaliza nome
function normalizarNome(nome) {
    if (!nome) return '';
    return nome.toUpperCase()
        .replace(/[.,-]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s/g, '');
}

// Verifica nome
function nomeValido(nome) {
    const normalizado = normalizarNome(nome);
    const permitidos = NOMES_PERMITIDOS.map(normalizarNome);
    return permitidos.includes(normalizado);
}

// Verifica data
function dataEhHoje(dataStr) {
    try {
        if (!dataStr) return false;
        const hoje = new Date().toISOString().split('T')[0];
        const data = new Date(dataStr).toISOString().split('T')[0];
        return data === hoje;
    } catch {
        return false;
    }
}

// Verifica duplicata (apenas localStorage para GitHub Pages)
async function verificarDuplicata(id) {
    console.log(`[ANTI-DUPL] Verificando: ${id}`);
    
    try {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
            const dados = JSON.parse(local);
            const existe = dados.some(t => t.transactionId === id);
            if (existe) {
                console.log(`[ANTI-DUPL] ❌ BLOQUEADO: Já existe`);
                return true;
            }
        }
    } catch (e) {
        console.log('[ANTI-DUPL] Erro:', e.message);
    }
    
    console.log(`[ANTI-DUPL] ✅ Não encontrado`);
    return false;
}

// Registra transação
async function registrarTransacao(dados) {
    const registro = {
        transactionId: dados.transactionId,
        amount: dados.amount,
        payeeName: dados.payeeName,
        paymentDate: dados.paymentDate,
        registeredAt: new Date().toISOString(),  // CORREÇÃO: registeredAt em vez de timestamp
        fileName: dados.fileName || 'desconhecido'
    };
    
    console.log(`[REGISTRO] Salvando: ${dados.transactionId}`);
    
    try {
        const local = localStorage.getItem(STORAGE_KEY);
        const lista = local ? JSON.parse(local) : [];
        lista.push(registro);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
        console.log(`[REGISTRO] ✅ Salvo no localStorage`);
    } catch (e) {
        console.log(`[REGISTRO] Erro: ${e.message}`);
    }
}

// VALIDAÇÃO PRINCIPAL - Versão simplificada para GitHub Pages
export async function validatePayment(paymentData) {
    console.log('='.repeat(50));
    console.log('🔍 VALIDAÇÃO PIX INICIADA');
    console.log('📊 Dados:', paymentData);
    
    // 1. ANTI-DUPLICAÇÃO
    console.log('1️⃣ Verificando duplicata...');
    const duplicata = await verificarDuplicata(paymentData.transactionId);
    if (duplicata) {
        console.log('❌ COMPROVANTE DUPLICADO');
        return {
            valid: false,
            error: 'COMPROVANTE DUPLICADO',
            details: 'Este comprovante já foi utilizado anteriormente.'
        };
    }
    
    // 2. VALOR MÍNIMO (R$ 10,00)
    console.log('2️⃣ Verificando valor mínimo...');
    const valor = parseFloat(paymentData.amount);
    if (isNaN(valor)) {
        console.log('❌ VALOR NÃO É NÚMERO');
        return {
            valid: false,
            error: 'VALOR INVÁLIDO',
            details: 'O valor do comprovante não é válido.'
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
    
    // 3. NOME DO FAVORECIDO
    console.log('3️⃣ Verificando nome...');
    if (!paymentData.payeeName || !nomeValido(paymentData.payeeName)) {
        console.log(`❌ NOME INVÁLIDO: "${paymentData.payeeName}"`);
        return {
            valid: false,
            error: 'NOME DO FAVORECIDO INVÁLIDO',
            details: `Nome deve ser: ${NOMES_PERMITIDOS.join(' ou ')}`
        };
    }
    
    // 4. DATA DO COMPROVANTE
    console.log('4️⃣ Verificando data...');
    if (!paymentData.paymentDate || !dataEhHoje(paymentData.paymentDate)) {
        const hoje = new Date().toLocaleDateString('pt-BR');
        console.log(`❌ DATA INVÁLIDA: "${paymentData.paymentDate}" (hoje é ${hoje})`);
        return {
            valid: false,
            error: 'DATA INVÁLIDA',
            details: `Data do comprovante deve ser hoje (${hoje})`
        };
    }
    
    // TUDO OK - REGISTRAR E APROVAR
    console.log('5️⃣ Todas validações passaram! Registrando...');
    await registrarTransacao(paymentData);
    
    console.log('='.repeat(50));
    console.log('🎉 PAGAMENTO VALIDADO COM SUCESSO!');
    console.log('='.repeat(50));
    
    return {
        valid: true,
        message: '✅ Pagamento validado com sucesso!',
        details: 'Comprovante aprovado. Gerando sua leitura de tarô...'
    };
}

export default validatePayment;
