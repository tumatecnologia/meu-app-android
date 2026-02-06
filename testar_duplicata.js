import { validatePayment } from './src/services/pixValidator.js';

// Simulando o banco de dados na memória para o teste
const bancoDeDadosSimulado = {};
global.localStorage = {
    getItem: (key) => bancoDeDadosSimulado[key] || null,
    setItem: (key, value) => { bancoDeDadosSimulado[key] = value; }
};

async function testarDuplicidade() {
    const dados = {
        transactionId: "PIX-REPETIDO-123",
        amount: "25.00",
        payeeName: "GUSTAVO SANTOS RIBEIRO",
        paymentDate: new Date().toISOString().split('T')[0]
    };

    console.log("--- 1ª TENTATIVA (Deve passar) ---");
    const res1 = await validatePayment(dados);
    console.log("Resultado 1:", res1.valid ? "✅ SUCESSO" : "❌ FALHA");

    console.log("\n--- 2ª TENTATIVA (Deve bloquear) ---");
    const res2 = await validatePayment(dados);
    console.log("Resultado 2:", res2.valid ? "✅ SUCESSO" : "❌ BLOQUEADO (Correto!)");
    console.log("Motivo do bloqueio:", res2.error);
}

testarDuplicidade();
