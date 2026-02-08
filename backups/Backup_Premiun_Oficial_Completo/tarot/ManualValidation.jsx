import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, DollarSign, User, Calendar } from 'lucide-react';

const ManualValidation = ({ onValidate, onCancel }) => {
  const [valor, setValor] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  
  const handleSubmit = () => {
    if (!valor || !dataHora || !confirmado) {
      alert('Por favor, preencha todos os campos e confirme o pagamento.');
      return;
    }
    
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (valorNumerico < 10) {
      alert('O valor mínimo é R$ 10,00.');
      return;
    }
    
    onValidate({
      valido: true,
      mensagem: 'Pagamento validado manualmente',
      dados: {
        valor: valorNumerico,
        dataHora: dataHora,
        confirmacao: true
      }
    });
  };
  
  return (
    <div className="space-y-4 p-4 bg-gray-800/50 rounded-xl border border-purple-500/20">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <Clock className="w-5 h-5 text-amber-400" />
        Validação Manual
      </h3>
      
      <p className="text-gray-300 text-sm">
        Se o sistema automático não reconhecer, informe os dados manualmente:
      </p>
      
      <div className="space-y-3">
        {/* Valor */}
        <div>
          <label className="text-gray-300 text-sm flex items-center gap-1 mb-1">
            <DollarSign className="w-4 h-4" />
            Valor pago (R$)
          </label>
          <input
            type="text"
            placeholder="Ex: 10,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        
        {/* Data e Hora */}
        <div>
          <label className="text-gray-300 text-sm flex items-center gap-1 mb-1">
            <Calendar className="w-4 h-4" />
            Data e Hora do pagamento
          </label>
          <input
            type="text"
            placeholder="Ex: 14/12/2024 20:07"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        
        {/* Confirmação */}
        <div className="flex items-center gap-2 p-3 bg-gray-900/50 rounded-lg">
          <input
            type="checkbox"
            id="confirmado"
            checked={confirmado}
            onChange={(e) => setConfirmado(e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="confirmado" className="text-gray-300 text-sm">
            Confirmo que o PIX foi realizado para Gustavo Santos Ribeiro
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          <CheckCircle className="w-4 h-4" />
          Validar
        </button>
        
        <button
          onClick={onCancel}
          className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          <XCircle className="w-4 h-4" />
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ManualValidation;
