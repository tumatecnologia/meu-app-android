import React, { useState } from 'react';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const testPIX = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Importação dinâmica
      const module = await import('./services/pixValidator.js');
      
      const hoje = new Date().toISOString().split('T')[0];
      const testData = {
        beneficiary: 'GUSTAVO SANTOS RIBEIRO',
        amount: '15.00',
        date: hoje,
        transactionId: 'TEST_' + Date.now()
      };
      
      const resultado = await module.validatePayment(testData);
      setResult(resultado);
      
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>🧪 SISTEMA PIX - IMPLEMENTAÇÃO COMPLETA ✅</h1>
      <p>Teste da nova validação PIX com IndexedDB e 5 situações de validação</p>
      
      <button 
        onClick={testPIX}
        disabled={loading}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          background: loading ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'VALIDANDO...' : '🧪 TESTAR VALIDAÇÃO PIX'}
      </button>
      
      {error && (
        <div style={{
          padding: '15px',
          background: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <strong>❌ ERRO:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={{
          padding: '20px',
          background: result.success ? '#d4edda' : '#f8d7da',
          color: result.success ? '#155724' : '#721c24',
          border: `2px solid ${result.success ? '#28a745' : '#dc3545'}`,
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>{result.success ? '✅ COMPROVANTE APROVADO' : '❌ COMPROVANTE RECUSADO'}</h3>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Mensagem:</strong> {result.message}</p>
          <p><strong>Detalhes:</strong> {result.details}</p>
        </div>
      )}
      
      <div style={{
        padding: '20px',
        background: '#e8f4f8',
        border: '1px solid #b8daff',
        borderRadius: '8px',
        marginTop: '30px'
      }}>
        <h3>📋 5 SITUAÇÕES IMPLEMENTADAS:</h3>
        <ol>
          <li><strong>Transação duplicada:</strong> ❌ RECUSADO</li>
          <li><strong>Nome diferente:</strong> ❌ RECUSADO</li>
          <li><strong>Valor &lt; R$ 10,00:</strong> ❌ RECUSADO</li>
          <li><strong>Data diferente:</strong> ❌ RECUSADO</li>
          <li><strong>Tudo correto:</strong> ✅ APROVADO</li>
        </ol>
        
        <h3>🛠️ TECNOLOGIAS:</h3>
        <ul>
          <li>React + Vite</li>
          <li>IndexedDB para armazenamento</li>
          <li>Limpeza automática a cada 60 dias</li>
          <li>Validação em tempo real</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
