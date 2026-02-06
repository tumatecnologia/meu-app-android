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
      <div className="mb-4">
        <label style={{display: 'block', color: 'yellow', fontWeight: 'bold', fontSize: '18px', marginBottom: '5px'}}>
          NOME COMPLETO (TESTE)
        </label>
        <input
          required
          type="text"
          className="w-full bg-white/20 border border-yellow-500 rounded-lg p-3 text-white"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Digite seu nome"
        />
      </div>

      <div className="mb-4">
        <label style={{display: 'block', color: 'yellow', fontWeight: 'bold', fontSize: '18px', marginBottom: '5px'}}>
          DATA DE NASCIMENTO (TESTE)
        </label>
        <input
          required
          type="tel"
          autoComplete="off"
          maxLength="10"
          className="w-full bg-white/20 border border-yellow-500 rounded-lg p-3 text-white"
          value={formData.birthDate || ''}
          onChange={handleDateChange}
          placeholder="DD/MM/AAAA"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg transition-all"
      >
        {loading ? "PROCESSANDO..." : "VER MEU DESTINO"}
      </button>
    </form>
  );
};

export default TarotForm;
