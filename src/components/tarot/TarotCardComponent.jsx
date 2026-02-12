import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  // Simplificação radical: se não tem card ou image, mostra o fundo vazio
  if (!card || !card.image) {
    return (
      <div className="flex flex-col items-center">
        {position && <span className="mb-4 text-purple-300 text-sm uppercase opacity-50 font-bold">{position}</span>}
        <div className="w-48 h-80 rounded-2xl border-2 border-dashed border-amber-500/20 bg-gray-900/50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {position && (
        <span className="mb-4 px-6 py-1.5 rounded-full bg-purple-900/80 text-amber-400 text-sm font-bold border border-amber-500/30 uppercase tracking-widest shadow-lg">
          {position}
        </span>
      )}
      
      <div className="relative w-48 h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] bg-gray-900">
        <img 
          src={card.image} 
          alt={card.name}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/80 backdrop-blur-sm border-t border-amber-400/30">
           <p className="text-white font-bold text-[11px] uppercase tracking-tighter">{card.name}</p>
        </div>
      </div>
    </div>
  );
}