/**
 * Serviço para controle de pagamentos
 * Gerencia hash de comprovantes, transações PIX e status
 */

// Simulação de banco de dados em memória (em produção, usar API/banco real)
const paymentRecords = new Map();

class PaymentControlService {
  /**
   * Criar novo registro de controle de pagamento
   * @param {Object} data - Dados do pagamento
   * @returns {Promise<Object>} - Registro criado
   */
  static async createPaymentControl(data) {
    const { hash_arquivo, nome_arquivo, id_transacao, status = 'ativo' } = data;
    
    if (!hash_arquivo) {
      throw new Error('hash_arquivo é obrigatório');
    }
    
    // Verificar se hash já existe
    if (paymentRecords.has(hash_arquivo)) {
      throw new Error('Hash de arquivo já registrado');
    }
    
    const record = {
      hash_arquivo,
      nome_arquivo: nome_arquivo || `comprovante_${Date.now()}.jpg`,
      id_transacao: id_transacao || `pix_${Date.now()}`,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    paymentRecords.set(hash_arquivo, record);
    
    console.log('📋 PaymentControl criado:', record);
    return record;
  }
  
  /**
   * Buscar registro por hash
   * @param {string} hash - Hash do arquivo
   * @returns {Promise<Object|null>} - Registro encontrado ou null
   */
  static async getByHash(hash) {
    return paymentRecords.get(hash) || null;
  }
  
  /**
   * Verificar se hash já foi usado
   * @param {string} hash - Hash do arquivo
   * @returns {Promise<boolean>} - true se já foi usado
   */
  static async isHashUsed(hash) {
    const record = paymentRecords.get(hash);
    return !!record;
  }
  
  /**
   * Atualizar status de um registro
   * @param {string} hash - Hash do arquivo
   * @param {string} status - Novo status ('ativo' ou 'inativo')
   * @returns {Promise<Object>} - Registro atualizado
   */
  static async updateStatus(hash, status) {
    if (!['ativo', 'inativo'].includes(status)) {
      throw new Error('Status inválido. Use "ativo" ou "inativo"');
    }
    
    const record = paymentRecords.get(hash);
    if (!record) {
      throw new Error('Registro não encontrado');
    }
    
    record.status = status;
    record.updated_at = new Date().toISOString();
    paymentRecords.set(hash, record);
    
    console.log(`📋 PaymentControl ${hash} atualizado para status: ${status}`);
    return record;
  }
  
  /**
   * Listar todos os registros (para admin)
   * @param {string} status - Filtrar por status (opcional)
   * @returns {Promise<Array>} - Lista de registros
   */
  static async listAll(status = null) {
    let records = Array.from(paymentRecords.values());
    
    if (status) {
      records = records.filter(record => record.status === status);
    }
    
    return records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  
  /**
   * Gerar hash único para arquivo
   * @param {File} file - Arquivo do comprovante
   * @returns {Promise<string>} - Hash gerado
   */
  static async generateFileHash(file) {
    // Em produção, usar algoritmo de hash real (SHA-256)
    // Aqui simulamos com uma combinação
    const timestamp = Date.now();
    const fileName = file.name;
    const fileSize = file.size;
    const random = Math.random().toString(36).substring(2, 15);
    
    // Hash simulado: fileHash_timestamp_random
    return `fileHash_${timestamp}_${random}`;
  }
  
  /**
   * Validar comprovante PIX
   * @param {File} file - Arquivo do comprovante
   * @returns {Promise<Object>} - Resultado da validação
   */
  static async validatePaymentProof(file) {
    try {
      // 1. Gerar hash do arquivo
      const hash = await this.generateFileHash(file);
      
      // 2. Verificar se já foi usado
      const isUsed = await this.isHashUsed(hash);
      if (isUsed) {
        return {
          valid: false,
          error: 'Este comprovante já foi utilizado anteriormente',
          hash
        };
      }
      
      // 3. Validar tipo de arquivo (em produção, fazer análise mais detalhada)
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        return {
          valid: false,
          error: 'Tipo de arquivo não permitido. Use JPG, PNG ou PDF',
          hash
        };
      }
      
      // 4. Validar tamanho (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return {
          valid: false,
          error: 'Arquivo muito grande. Tamanho máximo: 5MB',
          hash
        };
      }
      
      return {
        valid: true,
        hash,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      };
      
    } catch (error) {
      console.error('Erro na validação do comprovante:', error);
      return {
        valid: false,
        error: 'Erro ao validar comprovante'
      };
    }
  }
}

export default PaymentControlService;
