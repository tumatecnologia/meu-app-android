import React from 'react';

const TarotForm = ({ formData, setFormData, onSubmit, loading }) => {
  const handleDateChange = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 8) v = v.substring(0, 8);
    if (v.length > 4) {
      v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (v.length > 2) {
      v = v.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }
    setFormData({ ...formData, birthDate: v });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white/10 p-6 rounded-xl backdrop-blur-sm">
      <div className="space-y-2">
        <label className="block text-purple-200 text-sm font-medium mb-1">Nome Completo</label>
        <input
          required
          type="text"
          className="w-full bg-white/5 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Digite seu nome"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-purple-200 text-sm font-medium mb-1">Data de Nascimento</label>
        <input
          required
          type="tel" 
          id="campo_data_manual_v4"
          autoComplete="off"
          maxLength="10"
          className="w-full bg-white/5 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
          value={formData.birthDate || ''}
          onChange={handleDateChange}
          placeholder="DD/MM/AAAA"
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
