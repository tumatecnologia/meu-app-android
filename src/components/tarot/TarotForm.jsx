import React from 'react';

const TarotForm = ({ formData, setFormData, onSubmit, loading }) => {
  
  // Função para colocar as barras automaticamente na data
  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove o que não é número
    if (value.length <= 8) {
      value = value.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
      // Ajuste para ir colocando as barras enquanto digita
      if (value.length > 2 && value.length <= 4) value = value.replace(/(\d{2})(\d{0,2})/, "$1/$2");
      if (value.length > 4) value = value.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    }
    setFormData({ ...formData, birthDate: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white/10 p-6 rounded-xl backdrop-blur-sm">
      <div className="space-y-2">
        <label className="text-purple-200 text-sm">Nome Completo</label>
        <input
          required
          type="text"
          className="w-full bg-white/5 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Seu nome"
        />
      </div>

      <div className="space-y-2">
        <label className="text-purple-200 text-sm">Data de Nascimento (DD/MM/AAAA)</label>
        <input
          required
          type="tel"
          maxLength="10"
          className="w-full bg-white/5 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
          value={formData.birthDate}
          onChange={handleDateChange}
          placeholder="Ex: 10/05/1990"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50"
      >
        {loading ? "PROCESSANDO..." : "VER MEU DESTINO"}
      </button>
    </form>
  );
};

export default TarotForm;
