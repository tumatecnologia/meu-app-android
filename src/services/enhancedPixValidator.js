// Sistema de validação PIX aprimorado
export class EnhancedPixValidator {
    constructor() {
        this.allowedNames = ['GUSTAVO SANTOS RIBEIRO', 'GUSTAVO S RIBEIRO'];
        this.minAmount = 10.00;
        this.dbName = 'pixValidationDB';
        this.storeName = 'transactions';
        this.cleanupDays = 60;
        this.db = null;
        this.init();
    }

    // Inicialização do banco de dados
    async init() {
        if (!window.indexedDB) {
            console.warn('IndexedDB não suportado');
            return;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            
            request.onerror = () => reject(request.error);
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.autoCleanup();
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'transactionId' });
                    store.createIndex('date', 'date', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        }).catch(error => {
            console.error('Erro ao inicializar banco de dados:', error);
        });
    }

    // Normalização de nomes
    normalizeName(name) {
        if (!name) return '';
        return name.toUpperCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Verificar se o nome é válido
    isValidName(beneficiary) {
        const normalizedInput = this.normalizeName(beneficiary);
        const allowedNames = this.allowedNames.map(name => this.normalizeName(name));
        return allowedNames.includes(normalizedInput);
    }

    // Verificar se o valor é válido
    isValidAmount(amount) {
        const numAmount = parseFloat(amount);
        return !isNaN(numAmount) && numAmount >= this.minAmount;
    }

    // Verificar se a data é válida (data atual)
    isValidDate(dateStr) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const date = new Date(dateStr);
        const dateStrFormatted = date.toISOString().split('T')[0];
        return todayStr === dateStrFormatted;
    }

    // Verificar se transação já existe
    async checkTransactionExists(transactionId) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(transactionId);
            
            request.onsuccess = () => {
                resolve(!!request.result);
            };
            request.onerror = () => resolve(false);
        });
    }

    // Salvar transação no banco de dados
    async saveTransaction(transactionData) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const record = {
                transactionId: transactionData.transactionId,
                beneficiary: transactionData.beneficiary,
                amount: transactionData.amount,
                date: transactionData.date,
                timestamp: Date.now()
            };
            
            const request = store.add(record);
            
            request.onsuccess = () => resolve(true);
            request.onerror = (event) => {
                if (event.target.error.name === 'ConstraintError') {
                    resolve(false);
                } else {
                    reject(event.target.error);
                }
            };
        });
    }

    // Validação principal seguindo as 5 situações
    async validateReceipt(comprovanteData) {
        const { beneficiary, amount, date, transactionId } = comprovanteData;
        
        // Validações individuais
        const nameOk = this.isValidName(beneficiary);
        const amountOk = this.isValidAmount(amount);
        const dateOk = this.isValidDate(date);
        const transactionExists = await this.checkTransactionExists(transactionId);
        
        console.log('Validação:', { nameOk, amountOk, dateOk, transactionExists });
        
        // SITUAÇÃO 01: Tudo OK mas transação duplicada
        if (nameOk && amountOk && dateOk && transactionExists) {
            return {
                status: 'RECUSADO',
                message: 'Por favor faça um novo pagamento',
                details: 'ID de transação já cadastrado anteriormente'
            };
        }
        
        // SITUAÇÃO 02: Nome diferente
        if (!nameOk && amountOk && dateOk) {
            return {
                status: 'RECUSADO',
                message: 'Por favor faça um novo pagamento',
                details: 'Nome do favorecido não corresponde'
            };
        }
        
        // SITUAÇÃO 03: Valor insuficiente
        if (nameOk && !amountOk && dateOk) {
            return {
                status: 'RECUSADO',
                message: 'Por favor faça um novo pagamento',
                details: 'Valor mínimo não atingido'
            };
        }
        
        // SITUAÇÃO 04: Data diferente
        if (nameOk && amountOk && !dateOk) {
            return {
                status: 'RECUSADO',
                message: 'Por favor faça um novo pagamento',
                details: 'Data da transação não é a data atual'
            };
        }
        
        // SITUAÇÃO 05: Tudo OK - APROVADO
        if (nameOk && amountOk && dateOk && !transactionExists) {
            await this.saveTransaction(comprovanteData);
            return {
                status: 'APROVADO',
                message: 'Comprovante validado com sucesso',
                details: 'Consulta liberada'
            };
        }
        
        // Caso não se encaixe nas situações acima
        return {
            status: 'RECUSADO',
            message: 'Por favor faça um novo pagamento',
            details: 'Validação não atendida'
        };
    }

    // Limpeza automática a cada 60 dias
    async autoCleanup() {
        const lastCleanup = localStorage.getItem('lastPixCleanup');
        const today = new Date().toDateString();
        
        if (lastCleanup === today) return;
        
        try {
            if (!this.db) await this.init();
            
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - this.cleanupDays);
            const cutoffTimestamp = sixtyDaysAgo.getTime();
            
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.openCursor();
            
            let deletedCount = 0;
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.timestamp < cutoffTimestamp) {
                        cursor.delete();
                        deletedCount++;
                    }
                    cursor.continue();
                } else {
                    if (deletedCount > 0) {
                        console.log('Limpeza automática: ' + deletedCount + ' transações antigas removidas');
                    }
                    localStorage.setItem('lastPixCleanup', today);
                }
            };
            
            request.onerror = () => {
                console.warn('Erro durante limpeza automática');
            };
            
        } catch (error) {
            console.error('Erro na limpeza automática:', error);
        }
    }

    // Método para teste: obter todas transações
    async getAllTransactions() {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => resolve([]);
        });
    }
}

// Exportar instância única
export const pixValidator = new EnhancedPixValidator();
