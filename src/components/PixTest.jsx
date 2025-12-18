import React, { useState } from 'react';
import { validatePayment } from '../services/pixValidator.js';

const PixTest = () => {
    const [testResults, setTestResults] = useState([]);
    const [isTesting, setIsTesting] = useState(false);
    
    const runTest = async (testCase) => {
        setIsTesting(true);
        const hoje = new Date().toISOString().split('T')[0];
        const ontem = new Date();
        ontem.setDate(ontem.getDate() - 1);
        const ontemStr = ontem.toISOString().split('T')[0];
        
        let testData = {};
        let expected = '';
        
        switch(testCase) {
            case 1: // Transação duplicada
                const dupId = 'DUP_' + Date.now();
                // Primeiro salvar uma transação
                await validatePayment({
                    beneficiary: 'GUSTAVO SANTOS RIBEIRO',
                    amount: '10.00',
                    date: hoje,
                    transactionId: dupId
                });
                // Tentar a mesma transação
                testData = {
                    beneficiary: 'GUSTAVO SANTOS RIBEIRO',
                    amount: '10.00',
                    date: hoje,
                    transactionId: dupId
                };
                expected = 'RECUSADO';
                break;
                
            case 2: // Nome diferente
                testData = {
                    beneficiary: 'JOÃO DA SILVA',
                    amount: '10.00',
                    date: hoje,
                    transactionId: 'TEST2_' + Date.now()
                };
                expected = 'RECUSADO';
                break;
                
            case 3: // Valor insuficiente
                testData = {
                    beneficiary: 'GUSTAVO SANTOS RIBEIRO',
                    amount: '5.00',
                    date: hoje,
                    transactionId: 'TEST3_' + Date.now()
                };
                expected = 'RECUSADO';
                break;
                
            case 4: // Data diferente
                testData = {
                    beneficiary: 'GUSTAVO SANTOS RIBEIRO',
                    amount: '10.00',
                    date: ontemStr,
                    transactionId: 'TEST4_' + Date.now()
                };
                expected = 'RECUSADO';
                break;
                
            case 5: // Tudo OK
                testData = {
                    beneficiary: 'GUSTAVO SANTOS RIBEIRO',
                    amount: '10.00',
                    date: hoje,
                    transactionId: 'OK_' + Date.now()
                };
                expected = 'APROVADO';
                break;
        }
        
        try {
            const result = await validatePayment(testData);
            
            setTestResults(prev => [...prev, {
                case: testCase,
                expected,
                actual: result.data?.status || result.status,
                message: result.message || result.data?.message,
                details: result.details || result.data?.details,
                success: expected === (result.data?.status || result.status)
            }]);
        } catch (error) {
            setTestResults(prev => [...prev, {
                case: testCase,
                expected,
                actual: 'ERRO',
                message: 'Erro no teste',
                details: error.message,
                success: false
            }]);
        }
        
        setIsTesting(false);
    };
    
    const runAllTests = async () => {
        setIsTesting(true);
        setTestResults([]);
        
        for (let i = 1; i <= 5; i++) {
            await runTest(i);
        }
        
        setIsTesting(false);
    };
    
    const clearTests = () => {
        setTestResults([]);
    };
    
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🧪 Teste Sistema de Validação PIX</h1>
            <p>Implementação das 5 situações especificadas</p>
            
            <div style={{ margin: '20px 0' }}>
                <button 
                    onClick={runAllTests}
                    disabled={isTesting}
                    style={{
                        padding: '10px 20px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        marginRight: '10px',
                        cursor: 'pointer'
                    }}
                >
                    {isTesting ? 'Testando...' : 'Executar Todos os Testes'}
                </button>
                
                <button 
                    onClick={clearTests}
                    style={{
                        padding: '10px 20px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Limpar Resultados
                </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                {/* Situação 1 */}
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    <h3>Situação 1: Transação Duplicada</h3>
                    <p><strong>Esperado:</strong> RECUSADO</p>
                    <button onClick={() => runTest(1)} disabled={isTesting}>
                        Testar
                    </button>
                </div>
                
                {/* Situação 2 */}
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    <h3>Situação 2: Nome Diferente</h3>
                    <p><strong>Esperado:</strong> RECUSADO</p>
                    <button onClick={() => runTest(2)} disabled={isTesting}>
                        Testar
                    </button>
                </div>
                
                {/* Situação 3 */}
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    <h3>Situação 3: Valor Insuficiente</h3>
                    <p><strong>Esperado:</strong> RECUSADO</p>
                    <button onClick={() => runTest(3)} disabled={isTesting}>
                        Testar
                    </button>
                </div>
                
                {/* Situação 4 */}
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    <h3>Situação 4: Data Diferente</h3>
                    <p><strong>Esperado:</strong> RECUSADO</p>
                    <button onClick={() => runTest(4)} disabled={isTesting}>
                        Testar
                    </button>
                </div>
                
                {/* Situação 5 */}
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    <h3>Situação 5: Tudo OK</h3>
                    <p><strong>Esperado:</strong> APROVADO</p>
                    <button onClick={() => runTest(5)} disabled={isTesting}>
                        Testar
                    </button>
                </div>
            </div>
            
            {testResults.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                    <h2>📊 Resultados dos Testes</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa' }}>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Situação</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Esperado</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Obtido</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Detalhes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testResults.map((test, index) => (
                                    <tr key={index} style={{ background: test.success ? '#d4edda' : '#f8d7da' }}>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{test.case}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{test.expected}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{test.actual}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                            {test.success ? '✅' : '❌'}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{test.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            <div style={{ marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3>📋 Especificações do Sistema</h3>
                <ul>
                    <li><strong>Nomes aceitos:</strong> GUSTAVO SANTOS RIBEIRO ou GUSTAVO S RIBEIRO</li>
                    <li><strong>Valor mínimo:</strong> R$ 10,00</li>
                    <li><strong>Data:</strong> Deve ser a data atual do sistema</li>
                    <li><strong>ID da transação:</strong> Não pode ser duplicado</li>
                    <li><strong>Limpeza automática:</strong> Transações antigas (60+ dias) são removidas</li>
                </ul>
            </div>
        </div>
    );
};

export default PixTest;
