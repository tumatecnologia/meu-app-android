import { validatePayment } from './src/services/pixValidator.js';

// Isso impede que o erro de "localStorage" aconteça no terminal
global.localStorage = {
    getItem: () => null,
    setItem: () => null
};

async function executarTeste() {
    console.log("🚀 INICIANDO TESTE DE VALIDAÇÃO...");

    const dadosSimulados = {
        transactionId: "ID-TESTE-12345",
        amount: "20.00", 
        payeeName: "GUSTAVO SANTOS RIBEIRO", 
        paymentDate: new Date().toISOString().split('T')[0],
        fileName: "teste_manual.png"
    };

    const resultado = await validatePayment(dadosSimulados);
    
    console.log("\n--- RESULTADO FINAL ---");
    console.log(resultado.message || resultado.error);
    console.log("Detalhes:", resultado.details);
}

executarTeste();
