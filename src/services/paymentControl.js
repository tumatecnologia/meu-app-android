/**
 * SISTEMA DE VALIDAÇÃO DE COMPROVANTES PIX COM PERSISTÊNCIA
 * COM LOGS DETALHADOS PARA DEBUG - VERSÃO CORRIGIDA
 */

const DB_KEY = 'comprovante_consulta_db_final';

class PaymentControlService {
  // Banco de dados em localStorage
  static getDatabase() {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        console.log('📂 Banco carregado:', data.registros?.length || 0, 'registros');
        return new Map(data.registros || []);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar banco:', error);
    }
    return new Map();
  }

  static saveDatabase(registros) {
    try {
      const data = {
        registros: Array.from(registros.entries()),
        lastUpdate: new Date().toISOString(),
        total: registros.size
      };
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      console.log('💾 Banco salvo com', registros.size, 'registros');
    } catch (error) {
      console.error('❌ Erro ao salvar banco:', error);
    }
  }

  /**
   * VALIDAÇÃO DAS 5 CONDIÇÕES + REGISTRO - VERSÃO CORRIGIDA
   */
  static async validarEProcessarComprovante(dadosComprovante, nomeArquivo) {
    try {
      console.log('\n🔍 INICIANDO VALIDAÇÃO DO COMPROVANTE - VERSÃO CORRIGIDA');
      console.log('='.repeat(70));
      
      const { data_comprovante, hora_comprovante, nome_favorecido, valor_pix, id_transacao } = dadosComprovante;
      
      console.log('📊 DADOS RECEBIDOS PARA VALIDAÇÃO:');
      console.log('   ID:', id_transacao);
      console.log('   Data:', data_comprovante);
      console.log('   Hora:', hora_comprovante);
      console.log('   Nome:', nome_favorecido);
      console.log('   Valor:', valor_pix);
      console.log('   Arquivo:', nomeArquivo);
      
      // Carregar banco
      const database = this.getDatabase();
      console.log('📈 BANCO ATUAL:', database.size, 'IDs registrados');
      
      // CONDIÇÃO 1: Data atual
      console.log('\n1️⃣  ========== VERIFICANDO: Data atual ==========');
      const dataAtual = new Date().toISOString().split('T')[0];
      console.log(`   📅 Data comprovante: ${data_comprovante}`);
      console.log(`   📅 Data atual: ${dataAtual}`);
      console.log(`   🔄 São iguais? ${data_comprovante === dataAtual ? '✅ SIM' : '❌ NÃO'}`);
      
      if (data_comprovante !== dataAtual) {
        console.log('   🚫 VALIDAÇÃO FALHOU: Data não é atual');
        return {
          valido: false,
          motivo: 'Data do comprovante não é hoje',
          mensagem: 'Por favor, faça novo pagamento para nova consulta!'
        };
      }
      console.log('   ✅ PASSOU: Data é atual');
      
      // CONDIÇÃO 2: Hora ≤ 6 minutos - VERIFICAÇÃO CORRIGIDA
      console.log('\n2️⃣  ========== VERIFICANDO: Hora ≤ 6 minutos ==========');
      const horaAtual = new Date();
      console.log(`   ⏰ Hora atual do sistema: ${horaAtual.toLocaleTimeString('pt-BR', { hour12: false })}`);
      console.log(`   ⏰ Hora do comprovante: ${hora_comprovante}`);
      
      // Converter hora do comprovante para Date
      const [horaComp, minutoComp, segundoComp] = hora_comprovante.split(':').map(Number);
      const dataHoraComprovante = new Date();
      dataHoraComprovante.setHours(horaComp, minutoComp, segundoComp, 0);
      
      console.log(`   📅 Data/Hora comprovante (ajustada): ${dataHoraComprovante.toLocaleString('pt-BR')}`);
      console.log(`   📅 Data/Hora atual: ${horaAtual.toLocaleString('pt-BR')}`);
      
      // Calcular diferença em minutos
      const diferencaMilissegundos = horaAtual - dataHoraComprovante;
      const diferencaMinutos = diferencaMilissegundos / (1000 * 60);
      
      console.log(`   ⏱️  Diferença em milissegundos: ${diferencaMilissegundos}ms`);
      console.log(`   ⏱️  Diferença em minutos: ${diferencaMinutos.toFixed(2)}min`);
      console.log(`   🎯 Limite máximo permitido: 6 minutos`);
      
      // Verificar se está dentro do limite (0 a 6 minutos)
      const dentroDoLimite = diferencaMinutos >= 0 && diferencaMinutos <= 6;
      console.log(`   ✅ Está dentro do limite (0-6min)? ${dentroDoLimite ? 'SIM' : 'NÃO'}`);
      
      if (!dentroDoLimite) {
        if (diferencaMinutos < 0) {
          console.log(`   🚫 VALIDAÇÃO FALHOU: Hora do comprovante é FUTURA! (${diferencaMinutos.toFixed(2)}min)`);
          return {
            valido: false,
            motivo: 'Hora do comprovante é futura',
            mensagem: 'Por favor, faça novo pagamento para nova consulta!'
          };
        } else {
          console.log(`   🚫 VALIDAÇÃO FALHOU: Hora > 6min (${diferencaMinutos.toFixed(2)}min)`);
          return {
            valido: false,
            motivo: `Comprovante tem ${diferencaMinutos.toFixed(0)} minutos (limite: 6 minutos)`,
            mensagem: 'Por favor, faça novo pagamento para nova consulta!'
          };
        }
      }
      console.log('   ✅ PASSOU: Hora dentro do limite');
      
      // CONDIÇÃO 3: Nome correto
      console.log('\n3️⃣  ========== VERIFICANDO: Nome correto ==========');
      const nomesPermitidos = ['GUSTAVO SANTOS RIBEIRO', 'GUSTAVO S RIBEIRO'];
      const nomeNormalizado = nome_favorecido.trim().toUpperCase();
      console.log(`   👤 Nome fornecido: "${nome_favorecido}"`);
      console.log(`   🔠 Nome normalizado: "${nomeNormalizado}"`);
      console.log(`   ✅ Nomes permitidos: ${nomesPermitidos.join(', ')}`);
      
      if (!nomesPermitidos.includes(nomeNormalizado)) {
        console.log('   🚫 VALIDAÇÃO FALHOU: Nome incorreto');
        return {
          valido: false,
          motivo: 'Nome do favorecido incorreto',
          mensagem: 'Por favor, faça novo pagamento para nova consulta!'
        };
      }
      console.log('   ✅ PASSOU: Nome correto');
      
      // CONDIÇÃO 4: Valor = R$ 10,00
      console.log('\n4️⃣  ========== VERIFICANDO: Valor = R$ 10,00 ==========');
      const valorNumerico = parseFloat(valor_pix);
      console.log(`   💰 Valor fornecido: R$ ${valor_pix}`);
      console.log(`   🔢 Valor numérico: R$ ${valorNumerico}`);
      console.log(`   🎯 Valor esperado: R$ 10.00`);
      
      if (Math.abs(valorNumerico - 10.00) >= 0.001) {
        console.log('   🚫 VALIDAÇÃO FALHOU: Valor incorreto');
        return {
          valido: false,
          motivo: 'Valor diferente de R$ 10,00',
          mensagem: 'Por favor, faça novo pagamento para nova consulta!'
        };
      }
      console.log('   ✅ PASSOU: Valor correto');
      
      // CONDIÇÃO 5: ID NÃO existe no banco
      console.log('\n5️⃣  ========== VERIFICANDO: ID NÃO existe no banco ==========');
      console.log(`   🔑 ID a verificar: ${id_transacao}`);
      console.log(`   📊 Total no banco: ${database.size} registros`);
      
      if (database.has(id_transacao)) {
        const registroExistente = database.get(id_transacao);
        console.log('   🚫 VALIDAÇÃO FALHOU: ID já existe no banco!');
        console.log('      📋 Registro existente:');
        console.log('      - Data registro:', registroExistente.data_hora_registro);
        console.log('      - Arquivo:', registroExistente.nome_arquivo);
        console.log('      - ID:', registroExistente.id_transacao);
        console.log('   🚫 ESTE COMPROVANTE JÁ FOI USADO ANTERIORMENTE!');
        
        return {
          valido: false,
          motivo: 'Este comprovante já foi utilizado anteriormente',
          mensagem: 'Por favor, faça novo pagamento para nova consulta!'
        };
      }
      console.log('   ✅ PASSOU: ID não existe no banco');
      
      console.log('\n🎉 ========== TODAS AS 5 CONDIÇÕES FORAM ATENDIDAS! ==========');
      console.log('='.repeat(70));
      
      // REGISTRAR COMPROVANTE VÁLIDO
      console.log('\n📋 REGISTRANDO COMPROVANTE NO BANCO...');
      const registro = {
        id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        id_transacao,
        data_comprovante,
        hora_comprovante,
        nome_favorecido,
        valor_pix,
        nome_arquivo: nomeArquivo,
        data_hora_registro: new Date().toISOString().replace('T', ' ').substr(0, 19),
        data_hora_registro_iso: new Date().toISOString(),
        status: 'ativo',
        utilizado_para_consulta: true
      };
      
      database.set(id_transacao, registro);
      this.saveDatabase(database);
      
      console.log(`✅ COMPROVANTE REGISTRADO COM SUCESSO`);
      console.log(`   ID: ${id_transacao}`);
      console.log(`   Data registro: ${registro.data_hora_registro}`);
      console.log(`   Este ID NÃO poderá ser usado novamente!`);
      console.log('='.repeat(70));
      
      // Limpar registros antigos
      this.limparRegistrosAntigos(database);
      
      return {
        valido: true,
        mensagem: 'Consulta liberada com sucesso!',
        registro: registro,
        dados: dadosComprovante
      };
      
    } catch (error) {
      console.error('\n❌ ERRO NO PROCESSAMENTO:', error);
      console.trace(); // Mostrar stack trace para debug
      return {
        valido: false,
        motivo: error.message || 'Erro na validação',
        mensagem: 'Erro no processamento. Tente novamente.'
      };
    }
  }

  static limparRegistrosAntigos(database) {
    const noventaDiasAtras = new Date();
    noventaDiasAtras.setDate(noventaDiasAtras.getDate() - 90);
    
    let removidos = 0;
    
    for (const [idTransacao, registro] of database.entries()) {
      const dataRegistro = new Date(registro.data_hora_registro_iso);
      
      if (dataRegistro < noventaDiasAtras) {
        database.delete(idTransacao);
        removidos++;
      }
    }
    
    if (removidos > 0) {
      console.log(`🧹 ${removidos} registros antigos removidos`);
      this.saveDatabase(database);
    }
  }

  // Métodos para debug (mantidos para testes)
  static listarRegistros() {
    const database = this.getDatabase();
    console.log('\n📋 TODOS OS REGISTROS NO BANCO:');
    console.log('='.repeat(50));
    
    if (database.size === 0) {
      console.log('Nenhum registro encontrado');
      return [];
    }
    
    const registros = Array.from(database.values());
    registros.forEach((reg, i) => {
      console.log(`${i+1}. ID: ${reg.id_transacao}`);
      console.log(`   Data: ${reg.data_comprovante} ${reg.hora_comprovante}`);
      console.log(`   Registro: ${reg.data_hora_registro}`);
      console.log(`   Arquivo: ${reg.nome_arquivo}`);
      console.log('   ---');
    });
    
    return registros;
  }

  static verificarID(idTransacao) {
    const database = this.getDatabase();
    const existe = database.has(idTransacao);
    
    console.log(`\n🔍 VERIFICANDO ID: ${idTransacao}`);
    console.log(`   Existe no banco? ${existe ? '✅ SIM' : '❌ NÃO'}`);
    
    if (existe) {
      const registro = database.get(idTransacao);
      console.log('   Detalhes do registro:');
      console.log('   - Data registro:', registro.data_hora_registro);
      console.log('   - Arquivo:', registro.nome_arquivo);
      console.log('   - ID transação:', registro.id_transacao);
      return { existe: true, registro };
    }
    
    return { existe: false, registro: null };
  }

  static limparBanco() {
    localStorage.removeItem(DB_KEY);
    console.log('🧹 Banco de dados limpo');
    return true;
  }
}

export default PaymentControlService;
