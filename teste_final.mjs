console.log('🧪 TESTE FINAL DO SISTEMA PIX\n');

// Configurar ambiente para Node.js
if (typeof window === 'undefined') {
  global.window = {};
}

import('./src/services/pixValidator.js')
  .then(async (module) => {
    console.log('1️⃣  TESTE COM COMPROVANTE VÁLIDO:');
    const comprovanteValido = `
COMPROVANTE DE PAGAMENTO PIX
FAVORECIDO: GUSTAVO SANTOS RIBEIRO
VALOR: R$ 25,00
DATA: ${new Date().toLocaleDateString()} ${new Date().getHours()}:${new Date().getMinutes()}
ID DA TRANSAÇÃO: PIXFINALTEST${Date.now()}
STATUS: CONCLUÍDO
BANCO: 260 - NuPagamentos S.A.
    `;
    
    console.log('📄 Comprovante válido enviado...');
    const resultadoValido = await module.validatePaymentReceipt(comprovanteValido);
    
    console.log('📊 Resultado:');
    console.log('  ✅ Válido:', resultadoValido.isValid ? 'SIM' : 'NÃO');
    console.log('  📝 Erros:', resultadoValido.errors.length > 0 ? resultadoValido.errors.join('; ') : 'Nenhum');
    
    console.log('\n2️⃣  TESTE COM COMPROVANTE INVÁLIDO (valor baixo):');
    const comprovanteInvalido = `
COMPROVANTE DE PAGAMENTO PIX  
FAVORECIDO: GUSTAVO S RIBEIRO
VALOR: R$ 5,00
DATA: ${new Date().toLocaleDateString()} ${new Date().getHours()}:${new Date().getMinutes()}
ID: PIXINVALIDO${Date.now()}
    `;
    
    console.log('📄 Comprovante inválido enviado...');
    const resultadoInvalido = await module.validatePaymentReceipt(comprovanteInvalido);
    
    console.log('📊 Resultado:');
    console.log('  ✅ Válido:', resultadoInvalido.isValid ? 'SIM' : 'NÃO');
    console.log('  📝 Erros:', resultadoInvalido.errors.length > 0 ? resultadoInvalido.errors.join('; ') : 'Nenhum');
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 CONCLUSÃO DO TESTE:');
    
    if (resultadoValido.isValid && !resultadoInvalido.isValid) {
      console.log('✅ ✅ ✅ SISTEMA FUNCIONANDO PERFEITAMENTE! ✅ ✅ ✅');
      console.log('• Comprovante válido → ACEITO');
      console.log('• Comprovante inválido → REJEITADO');
      console.log('\n🚀 O sistema está pronto para produção!');
    } else {
      console.log('⚠️  Verificação necessária:');
      if (!resultadoValido.isValid) {
        console.log('• Comprovante válido foi REJEITADO (erro)');
      }
      if (resultadoInvalido.isValid) {
        console.log('• Comprovante inválido foi ACEITO (erro grave)');
      }
    }
  })
  .catch(error => {
    console.error('❌ ERRO NO TESTE:', error.message);
  });
