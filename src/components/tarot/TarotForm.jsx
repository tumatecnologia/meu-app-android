import React from 'react';

const TarotForm = ({ formData, setFormData, onSubmit, loading }) => {
  
  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d)/, "$1/$2");
      value = value.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    }
    setFormData({ ...formData, birthDate: value });
  };

  // Nova função para garantir que a pergunta seja salva
  const handleQuestionChange = (e) => {
    const q = e.target.value;
    setFormData({ ...formData, question: q });
    localStorage.setItem('userQuestion', q); // Salva no navegador por segurança
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-black/20 p-6 rounded-2xl backdrop-blur-md border border-purple-500/30">
      
      {/* Campo Nome */}
      <div className="flex flex-col gap-2">
        <label className="text-white font-bold text-sm ml-1 uppercase">Nome Completo</label>
        <input
          required
          type="text"
          placeholder="Digite seu nome"
          className="w-full bg-white/10 border border-purple-400/50 rounded-xl p-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      {/* Campo Data */}
      <div className="flex flex-col gap-2">
        <label className="text-white font-bold text-sm ml-1 uppercase">Data de Nascimento</label>
        <input
          required
          type="text"
          inputMode="numeric"
          placeholder="DD/MM/AAAA"
          maxLength="10"
          className="w-full bg-white/10 border border-purple-400/50 rounded-xl p-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={formData.birthDate || ''}
          onChange={handleDateChange}
        />
      </div>

      {/* NOVO: Campo Pergunta (O que estava faltando!) */}
      <div className="flex flex-col gap-2">
        <label className="text-white font-bold text-sm ml-1 uppercase">Sua Pergunta ao Oráculo</label>
        <textarea
          required
          placeholder="Ex: Vou engravidar esse ano?"
          rows="3"
          className="w-full bg-white/10 border border-purple-400/50 rounded-xl p-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          value={formData.question || ''}
          onChange={handleQuestionChange}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 uppercase"
      >
        {loading ? "PROCESSANDO..." : "VER MEU DESTINO"}
      </button>
    </form>
  );
};

export default TarotForm;