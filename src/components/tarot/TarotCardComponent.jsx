import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  const cardName = card?.name || card?.card_name || "";
  
  const fileName = cardName.toLowerCase()
                           .normalize('NFD')
                           .replace(/[\u0300-\u036f]/g, "");
  
  // Detecta se estamos no GitHub Pages e ajusta o caminho base
  const isGitHubPages = window.location.hostname.includes('github.io');
  const basePath = isGitHubPages ? '/meu-app-android' : '';
  
  const finalImage = `${basePath}/assets/cartas/${fileName}.jpg`;

  return (
    <div className="flex flex-col items-center">
      {position && (
        <span className="mb-4 px-6 py-1.5 rounded-full bg-purple-900/80 text-amber-400 text-sm font-bold border border-amber-500/30 uppercase tracking-widest shadow-lg">
          {position}
        </span>
      )}
      
      <div className="relative w-48 h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] bg-gray-900">
        <img 
          src={finalImage} 
          alt={cardName}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
          onError={(e) => {
            console.error("❌ Erro ao carregar imagem no caminho:", e.target.src);
          }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/80 backdrop-blur-sm border-t border-amber-400/30">
           <p className="text-white font-bold text-[11px] uppercase tracking-tighter">{cardName}</p>
        </div>
      </div>
    </div>
  );
}