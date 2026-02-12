import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  if (!card || !card.id) return null;

  const getImagePath = (id) => {
    // 1. Identifica o nome do arquivo exatamente como você listou
    let fileName = id.replace(/-/g, ' ');
    if (id === 'o-eremita') fileName = 'o heremita';
    if (id === 'a-roda-da-fortuna') fileName = 'a roda-da-fortuna';
    
    // 2. Caminho relativo simples - costuma funcionar melhor no GH Pages
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
          alt={card.name}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
          onError={(e) => {
            // Se falhar, tenta sem o 'assets/'
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = "true";
              const currentSrc = e.target.src;
              e.target.src = currentSrc.replace('assets/cartas/', 'cartas/');
            }
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/70 backdrop-blur-sm">
           <p className="text-white font-bold text-xs uppercase tracking-widest">{card.name}</p>
        </div>
      </div>
    </div>
  );
}
