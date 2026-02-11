import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  // Se não houver card ou id, mostra apenas um espaço reservado elegante
  if (!card || !card.id) {
    return (
      <div className="flex flex-col items-center">
        {position && <span className="mb-4 text-purple-300 text-sm uppercase opacity-50">{position}</span>}
        <div className="w-48 h-80 rounded-2xl border-2 border-dashed border-purple-500/30 bg-gray-900/50 animate-pulse" />
      </div>
    );
  }

  const getImagePath = (id) => {
    // PROTEÇÃO: O replace só roda se o id existir
    let fileName = id ? id.replace(/-/g, ' ') : 'o louco';
    if (id === 'o-eremita') fileName = 'o heremita';
    if (id === 'a-roda-da-fortuna') fileName = 'a roda-da-fortuna';
    return `assets/cartas/${fileName}.jpg`;
  };

  const imagePath = getImagePath(card.id);

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
          alt={card.name || 'Carta'}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
          onError={(e) => {
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = "true";
              e.target.src = e.target.src.replace('assets/cartas/', 'cartas/');
            }
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/70 backdrop-blur-sm">
           <p className="text-white font-bold text-[10px] uppercase tracking-tighter">{card.name}</p>
        </div>
      </div>
    </div>
  );
}
