// Teste prático do sistema de validação PIX
const { validatePaymentReceipt } = require('./src/services/pixValidator.js');

async function testarValidacao() {
  console.log('🧪 TESTE PRÁTICO DO SISTEMA PIX\n');
  
  // Teste 1: Comprovante VÁLIDO
  console.log('1️⃣  TESTE VÁLIDO:');
  const comprovanteValido = `
COMPROVANTE PIX
FAVORECIDO: GUSTAVO SANTOS RIBEIRO
VALOR: R$ 25,00
DATA: ${new Date().toLocaleDateString()} ${new Date().getHours()}:${new Date().getMinutes()}
ID DA TRANSAÇÃO: PIXTEST${Date.now()}
STATUS: CONCLUÍDO
  `;
  
  console.log('📄 Comprovante:');
  console.log(comprovanteValido);
  
  try {
    const resultado = await validatePaymentReceipt(comprovanteValido);
    console.log('\n📊 RESULTADO:');
    console.log('✅ Válido:', resultado.isValid);
    console.log('📝 Erros:', resultado.errors.length > 0 ? resultado.errors : 'Nenhum');
    console.log('💳 Dados extraídos:', {
      favorecido: resultado.extractedData.beneficiary,
      valor: `R$ ${resultado.extractedData.amount}`,
      id: resultado.extractedData.transactionId
    });
    
    if (resultado.isValid) {
      console.log('\n🎉 CONSULTA DEVE SER LIBERADA!');
    } else {
      console.log('\n🚫 CONSULTA NÃO LIBERADA!');
    }
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Teste 2: Comprovante INVÁLIDO (valor baixo)
  console.log('2️⃣  TESTE INVÁLIDO (valor baixo):');
  const comprovanteInvalido = `
COMPROVANTE PIX
FAVORECIDO: GUSTAVO S RIBEIRO
VALOR: R$ 5,00
DATA: ${new Date().toLocaleDateString()} ${new Date().getHours()}:${new Date().getMinutes()}
ID DA TRANSAÇÃO: PIXTEST${Date.now() + 1}
STATUS: CONCLUÍDO
  `;
  
  console.log('📄 Comprovante:');
  console.log(comprovanteInvalido);
  
  try {
    const resultado = await validatePaymentReceipt(comprovanteInvalido);
    console.log('\n📊 RESULTADO:');
    console.log('✅ Válido:', resultado.isValid);
    console.log('📝 Erros:', resultado.errors);
    
    if (!resultado.isValid) {
      console.log('\n🚫 CORRETO! Sistema rejeitou o pagamento (valor < R$ 10,00)');
    }
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testarValidacao();
