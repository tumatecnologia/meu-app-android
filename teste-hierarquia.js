const usedIds = ['ID-JA-EXISTENTE-123456789'];

function validarComprovante(textoOcr) {
    const cleanText = textoOcr.toUpperCase();
    
    // 1. REGRA: ID REPETIDO (Ajustado para aceitar hífens e sublinhas comum em IDs)
    const idMatch = cleanText.match(/[A-Z0-9-_]{15,}/);
    const transactionId = idMatch ? idMatch[0] : null;
    
    if (transactionId && usedIds.includes(transactionId)) {
        return { valid: false, details: 'ESTE COMPROVANTE JÁ FOI UTILIZADO ANTES.' };
    }

    // 2. REGRA: DESTINATÁRIO
    const nomesValidos = ['GUSTAVO SANTOS RIBEIRO', 'GUSTAVO S RIBEIRO'];
    const nomeDetectado = nomesValidos.some(nome => cleanText.includes(nome)) || 
                         (cleanText.includes('GUSTAVO') && cleanText.includes('RIBEIRO') && (cleanText.includes('SANTOS') || cleanText.includes(' S ')));
    
    if (!nomeDetectado) {
        return { valid: false, details: 'DESTINATÁRIO INCORRETO.' };
    }

    // 3. REGRA: VALOR
    const regexValor = /(?:R\$|VALOR|PAGO)\s?(\d+[,.]\d{2})/i;
    const matchValor = cleanText.match(regexValor) || cleanText.match(/(\d+[,.]\d{2})/);
    if (matchValor) {
        const valorNumerico = parseFloat(matchValor[1].replace(',', '.'));
        if (valorNumerico < 10.00) return { valid: false, details: 'VALOR INFERIOR A R$ 10,00.' };
    } else { return { valid: false, details: 'VALOR NÃO LIDO.' }; }

    // 4. REGRA: DATA
    if (!cleanText.match(/(\d{2}\/\d{2})/)) return { valid: false, details: 'DATA NÃO ENCONTRADA.' };

    return { valid: true, details: 'PAGAMENTO APROVADO!' };
}

console.log('TESTE 1 (ID DUPLICADO):', validarComprovante('ID-JA-EXISTENTE-123456789 GUSTAVO SANTOS RIBEIRO R$ 10,00 06/02').details);
console.log('TESTE 2 (NOME ERRADO):', validarComprovante('ID-NOVO-111 MARIA SOUZA R$ 10,00 06/02').details);
console.log('TESTE 3 (VALOR BAIXO):', validarComprovante('ID-NOVO-222 GUSTAVO S RIBEIRO R$ 5,00 06/02').details);
console.log('TESTE 4 (TUDO OK):', validarComprovante('ID-NOVO-333 GUSTAVO S RIBEIRO R$ 10,00 06/02').details);
