import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  if (!card) return null;

  const getImagePath = (id) => {
    // 1. Identifica o nome do arquivo exatamente como você listou
    let fileName = id.replace(/-/g, ' ');
    if (id === 'o-eremita') fileName = 'o heremita';
    if (id === 'a-roda-da-fortuna') fileName = 'a roda-da-fortuna'; // Mantendo o hífen como estava no seu ls
    
    // 2. No Vite + GitHub Pages, arquivos em public/assets devem ser acessados assim:
    return `./assets/cartas/${fileName}.jpg`;
  };

  const imagePath = getImagePath(card.id || '');

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
            // Se falhar o ./assets/, tenta direto na raiz /assets/
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = "true";
              const currentSrc = e.target.src;
              if (currentSrc.includes('./assets/')) {
                e.target.src = currentSrc.replace('./assets/', 'assets/');
              } else {
                // Última tentativa: tenta sem o prefixo assets
                e.target.src = `assets/cartas/${card.id.replace(/-/g, ' ')}.jpg`;
              }
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
