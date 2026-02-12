import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  // Se os dados ainda não chegaram, mantém a moldura mas sem travar o app
  if (!card || !card.id) {
    return (
      <div className="flex flex-col items-center">
        {position && <span className="mb-4 text-purple-300 text-sm uppercase opacity-50 font-bold">{position}</span>}
        <div className="w-48 h-80 rounded-2xl border-2 border-dashed border-purple-500/30 bg-gray-900/50 animate-pulse shadow-inner" />
      </div>
    );
  }

  // Caminho da imagem focado no que funcionava antes
  const fileName = card.id.replace(/-/g, ' ') + '.jpg';
  const imagePath = `assets/cartas/${fileName}`;

  return (
    <div className="flex flex-col items-center">
      {position && (
        <span className="mb-4 px-6 py-1.5 rounded-full bg-purple-900/80 text-amber-400 text-sm font-bold border border-amber-500/30 uppercase tracking-widest shadow-lg">
          {position}
        </span>
      )}
      
      <div className="relative w-48 h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] bg-gray-900 transition-transform duration-500 hover:scale-105">
        <img 
          src={imagePath} 
          alt={card.name}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
          onLoad={() => console.log(`✅ Carregada: ${card.name}`)}
          onError={(e) => {
            console.warn(`⚠️ Falha no caminho principal para ${card.name}, tentando alternativo...`);
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = "true";
              e.target.src = `cartas/${fileName}`;
            }
          }}
        />
        
        {/* Identificador da Carta */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/80 backdrop-blur-sm border-t border-amber-400/30">
           <p className="text-white font-bold text-[11px] uppercase tracking-tighter">{card.name}</p>
        </div>
      </div>
    </div>
  );
}
