import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  if (!card) return null;

  const getImagePath = (c) => {
    // Tenta o ID, se não tiver, tenta o nome, se não tiver, usa 'o-louco'
    let baseName = (c.id || c.name || 'o-louco').toLowerCase().replace(/-/g, ' ');
    
    // Ajustes manuais para bater com seus arquivos
    if (baseName.includes('eremita')) baseName = 'o heremita';
    if (baseName.includes('roda-da-fortuna')) baseName = 'a roda-da-fortuna';
    
    // Remove acentos apenas para garantir
    const cleanName = baseName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    
    return `assets/cartas/${cleanName}.jpg`;
  };

  const imagePath = getImagePath(card);

  return (
    <div className="flex flex-col items-center">
      {position && (
        <span className="mb-4 px-6 py-1.5 rounded-full bg-purple-900/80 text-amber-400 text-sm font-bold border border-amber-500/30 uppercase">
          {position}
        </span>
      )}
      
      <div className="relative w-48 h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-gray-900">
        <img 
          src={imagePath} 
          alt={card.name}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
          onError={(e) => {
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = "true";
              // Se falhar assets/cartas/, tenta direto na raiz cartas/
              e.target.src = e.target.src.replace('assets/cartas/', 'cartas/');
            }
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/80">
           <p className="text-white font-bold text-[10px] uppercase tracking-tighter">{card.name}</p>
        </div>
      </div>
    </div>
  );
}
