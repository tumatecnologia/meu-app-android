import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  // REMOVIDO: A proteção que escondia o componente
  if (!card) return null;

  const getImagePath = (id) => {
    // PROTEÇÃO: O replace só roda se o id existir
    let fileName = id ? id.replace(/-/g, ' ') : 'o-louco';
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
      
      {/* Moldura sempre visível, mesmo que a imagem falhe */}
      <div className="relative w-48 h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-gray-900">
        <img 
          src={imagePath} 
          alt={card.name || 'Carta'}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
          onError={(e) => {
            console.error("Erro ao carregar imagem:", e.target.src);
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = "true";
              // Tentativa de fallback
              e.target.src = `assets/cartas/${card.id.replace(/-/g, ' ')}.jpg`;
            }
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/70 backdrop-blur-sm">
           <p className="text-white font-bold text-[10px] uppercase tracking-tighter">{card.name || 'Carregando...'}</p>
        </div>
      </div>
    </div>
  );
}
