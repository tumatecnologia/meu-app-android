import('./src/services/pixValidator.js')
  .then(async (module) => {
    console.log('🧪 TESTANDO VALIDADOR PIX...\n');
    
    // Comprovante válido
    const comprovante = `
COMPROVANTE DE PAGAMENTO PIX
FAVORECIDO: GUSTAVO SANTOS RIBEIRO
VALOR: R$ 15,00
DATA: ${new Date().toLocaleDateString()} ${new Date().getHours()}:${new Date().getMinutes()}
ID DA TRANSAÇÃO: PIXFINALTEST${Date.now()}
STATUS: CONCLUÍDO
    `;
    
    console.log('📄 Comprovante de teste:');
    console.log(comprovante);
    console.log('\n🔍 Validando...\n');
    
    const resultado = await module.validatePaymentReceipt(comprovante);
    
    console.log('📊 RESULTADO DA VALIDAÇÃO:');
    console.log('├─ ✅ Válido:', resultado.isValid ? 'SIM' : 'NÃO');
    console.log('├─ 📝 Erros:', resultado.errors.length > 0 ? resultado.errors.join(', ') : 'Nenhum');
    console.log('├─ 💳 Favorecido:', resultado.extractedData.beneficiary || 'Não encontrado');
    console.log('├─ 💰 Valor:', `R$ ${resultado.extractedData.amount}`);
    console.log('└─ 🔑 ID Transação:', resultado.extractedData.transactionId);
    
    console.log('\n' + '='.repeat(50));
    
    if (resultado.isValid) {
      console.log('🎉 🎉 🎉 SISTEMA FUNCIONANDO CORRETAMENTE! 🎉 🎉 🎉');
      console.log('O comprovante atendeu a TODAS as validações:');
      console.log('1. ✅ Favorecido correto');
      console.log('2. ✅ Valor ≥ R$ 10,00');
      console.log('3. ✅ Data dentro de 5 minutos');
      console.log('4. ✅ ID de transação único');
      console.log('\n📍 CONSULTA SERÁ LIBERADA PARA O USUÁRIO!');
    } else {
      console.log('🚫 CONSULTA NÃO SERÁ LIBERADA');
      console.log('Motivo(s):', resultado.errors.join(', '));
    }
  })
  .catch(error => {
    console.error('❌ ERRO:', error.message);
  });
