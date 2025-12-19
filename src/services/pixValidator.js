/**
 * VALIDADOR DE PAGAMENTOS PIX - VERSÃO FINAL
 * BLOQUEIA:
 * 1. Comprovantes duplicados
 * 2. Valores < R$ 10,00
 * 3. Nomes diferentes de "GUSTAVO SANTOS RIBEIRO" ou "GUSTAVO S RIBEIRO"
 * 4. Datas que não são hoje
 */

console.log('✅ pixValidator.js carregado');

const VALOR_MINIMO = 10.00;
const NOMES_PERMITIDOS = ['GUSTAVO SANTOS RIBEIRO', 'GUSTAVO S RIBEIRO', 'GUSTAVO S. RIBEIRO'];
const DB_URL = 'http://localhost:3000/transactions';
const STORAGE_KEY = 'pix_transactions';

// Normaliza nome
function normalizarNome(nome) {
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
        const hoje = new Date().toISOString().split('T')[0];
        const data = new Date(dataStr).toISOString().split('T')[0];
        return data === hoje;
    } catch {
        return false;
    }
}

// Verifica duplicata
async function verificarDuplicata(id) {
    try {
        // Banco
        const res = await fetch(`${DB_URL}?transactionId=${id}`);
        if (res.ok) {
            const dados = await res.json();
            if (dados.length > 0) return true;
        }
    } catch (e) {
        console.log('Erro banco:', e.message);
    }
    
    // localStorage
    try {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
            const dados = JSON.parse(local);
            if (dados.some(t => t.transactionId === id)) return true;
        }
    } catch (e) {
        console.log('Erro localStorage:', e.message);
    }
    
    return false;
}

// Registra transação
async function registrarTransacao(dados) {
    const registro = { ...dados, timestamp: new Date().toISOString() };
    
    // Banco
    try {
        await fetch(DB_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registro)
        });
    } catch (e) {
        console.log('Erro salvar banco:', e.message);
    }
    
    // localStorage
    try {
        const local = localStorage.getItem(STORAGE_KEY);
        const lista = local ? JSON.parse(local) : [];
        lista.push(registro);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch (e) {
        console.log('Erro salvar local:', e.message);
    }
}

// VALIDAÇÃO PRINCIPAL
export async function validatePayment(paymentData) {
    console.log('=== VALIDAÇÃO INICIADA ===');
    
    // 1. DUPLICATA
    const duplicata = await verificarDuplicata(paymentData.transactionId);
    if (duplicata) {
        return {
            valid: false,
            error: 'DUPLICATA',
            details: 'Comprovante já foi usado'
        };
    }
    
    // 2. VALOR MÍNIMO (R$ 10,00)
    const valor = parseFloat(paymentData.amount);
    if (isNaN(valor)) {
        return {
            valid: false,
            error: 'VALOR INVÁLIDO',
            details: 'Valor não é número'
        };
    }
    
    if (valor < VALOR_MINIMO) {
        return {
            valid: false,
            error: 'VALOR INSUFICIENTE',
            details: `Valor R$ ${valor.toFixed(2)} < mínimo R$ ${VALOR_MINIMO.toFixed(2)}`
        };
    }
    
    // 3. NOME
    if (!paymentData.payeeName || !nomeValido(paymentData.payeeName)) {
        return {
            valid: false,
            error: 'NOME INVÁLIDO',
            details: `Nome deve ser: ${NOMES_PERMITIDOS.join(' ou ')}`
        };
    }
    
    // 4. DATA
    if (!paymentData.paymentDate || !dataEhHoje(paymentData.paymentDate)) {
        const hoje = new Date().toLocaleDateString('pt-BR');
        return {
            valid: false,
            error: 'DATA INVÁLIDA',
            details: `Data deve ser hoje (${hoje})`
        };
    }
    
    // TUDO OK - REGISTRAR
    await registrarTransacao(paymentData);
    
    return {
        valid: true,
        message: '✅ Pagamento validado!'
    };
}

export default validatePayment;
