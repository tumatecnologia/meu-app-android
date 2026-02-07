// Simulando a lógica que está no seu paymentControl.js
function testarLogica(textoSimulado) {
    const cleanText = textoSimulado.toUpperCase();
    
    // 1. Verificar se é PIX
    const isPix = cleanText.includes('PIX') || cleanText.includes('COMPROVANTE') || cleanText.includes('REALIZADA');
    
    if (!isPix) {
        return { valid: false, details: 'A imagem não parece ser um comprovante PIX.' };
    }

    // 2. Busca valor
    const amountMatch = cleanText.match(/R\$\s?(\d+[,.]\d{2})/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : 0;

    if (amount < 10.00) {
        return { valid: false, details: `Valor detectado (R$ ${amount.toFixed(2)}) é menor que o mínimo de R$ 10,00.` };
    }

    return {
        valid: true,
        amount: amount.toFixed(2),
        details: 'Pagamento identificado com sucesso!'
    };
}

// --- EXECUÇÃO DOS TESTES ---

console.log("--- TESTE 1: Foto de um cachorro (Não é PIX) ---");
console.log(testarLogica("Esta é uma foto da minha sala de estar"));

console.log("\n--- TESTE 2: Comprovante de R$ 5,00 (Valor Baixo) ---");
console.log(testarLogica("COMPROVANTE PIX REALIZADA VALOR R$ 5,00 DATA HOJE"));

console.log("\n--- TESTE 3: Comprovante Correto de R$ 15,00 ---");
console.log(testarLogica("PIX ENVIADO COM SUCESSO VALOR R$ 15,00 PARA ORACULO MISTICO"));
