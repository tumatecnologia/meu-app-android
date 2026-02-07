import React from 'react';

const BirthDateInput = ({ value, onChange }) => {
  const handleChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    if (val.length >= 5) {
      val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
    } else if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    onChange(val);
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      <input
        type="text"
        name="birthDate"
        value={value || ''}
        onChange={handleChange}
        placeholder="Data de Nascimento"
        inputMode="numeric"
        required
        className="w-full bg-white/10 border border-purple-400/30 text-white rounded-lg px-4 py-3 outline-none focus:border-amber-400 placeholder-white/50"
        style={{
          textAlign: 'center',
          appearance: 'none',
          WebkitAppearance: 'none'
        }}
      />
    </div>
  );
};

export default BirthDateInput;
