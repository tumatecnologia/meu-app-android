import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  if (!card) return null;

  // 1. Identifica o arquivo físico com precisão
  const getImagePath = (c) => {
    let fileName = c.id.replace(/-/g, ' ');
    if (c.id === 'o-eremita') fileName = 'o heremita';
    if (c.id === 'a-roda-da-fortuna') fileName = 'a roda-da-fortuna';
    return `assets/cartas/${fileName}.jpg`;
  };

  const imagePath = getImagePath(card);

  return (
    <div className="flex flex-col items-center">
      {position && (
        <span className="mb-4 px-6 py-1.5 rounded-full bg-purple-900/80 text-amber-400 text-sm font-bold border border-amber-500/30 uppercase">
          {position}
        </span>
      )}
      
      {/* Moldura Fixa para parar de tremer */}
      <div className="relative w-48 h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-gray-900">
        <img 
          src={imagePath} 
          alt={card.name}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
          onError={(e) => {
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = "true";
              e.target.src = e.target.src.replace('assets/cartas/', 'cartas/');
            }
          }}
        />
        
        {/* Nome sólido na parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/70 backdrop-blur-sm">
           <p className="text-white font-bold text-xs uppercase tracking-widest">{card.name}</p>
        </div>
      </div>
    </div>
  );
}
