import { validatePayment } from './src/services/pixValidator.js';

global.localStorage = { getItem: () => null, setItem: () => null };

async function testeNomeErrado() {
    console.log("🚀 TESTANDO NOME DE FAVORECIDO ERRADO...");

    const dados = {
        transactionId: "ID-NOME-ERRADO-999",
        amount: "50.00",
        payeeName: "JOAO DA SILVA", // Nome que NÃO está na sua lista
        paymentDate: new Date().toISOString().split('T')[0]
    };

    const resultado = await validatePayment(dados);
    console.log("\n--- RESULTADO ---");
    console.log("Status:", resultado.valid ? "✅ PASSOU" : "❌ BLOQUEADO");
    console.log("Erro:", resultado.error);
}

testeNomeErrado();
