import { validatePayment } from './src/services/pixValidator.js';
global.localStorage = { getItem: () => null, setItem: () => null };

async function testeLimpeza() {
    console.log("🚀 TESTANDO NORMALIZAÇÃO DE NOME...");
    const dados = {
        transactionId: "ID-LIMPEZA-777",
        amount: "15.00",
        payeeName: "  gustavo s. ribeiro  ", // Sujo, minúsculo e com ponto
        paymentDate: new Date().toISOString().split('T')[0]
    };
    const resultado = await validatePayment(dados);
    console.log("\n--- RESULTADO ---");
    console.log("Status:", resultado.valid ? "✅ PASSOU (O código é inteligente!)" : "❌ BLOQUEADO (O código foi rigoroso demais)");
}
testeLimpeza();
