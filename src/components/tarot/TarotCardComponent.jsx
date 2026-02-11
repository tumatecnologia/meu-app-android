import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  // Se não houver card, mostra um espaço vazio com borda para não quebrar o layout
  if (!card) return <div className="w-48 h-80 border-2 border-dashed border-purple-400 rounded-2xl"></div>;

  const getImagePath = (c) => {
    // Tenta pegar o nome do arquivo: Prioridade para o ID, depois nome manual
    let name = (c.id || c.name || '').toLowerCase().replace(/-/g, ' ');
    
    // Ajuste específico para o seu arquivo com H
    if (name.includes('eremita')) name = 'o heremita';
    
    // Remove qualquer acento residual para o link
    const cleanName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    
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
            // Se falhar com assets/, tenta sem. Se falhar de novo, usa um placeholder
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = "1";
              e.target.src = e.target.src.replace('assets/cartas/', 'cartas/');
            } else if (e.target.dataset.tried === "1") {
               e.target.dataset.tried = "2";
               // Tenta o nome da carta direto caso esteja na raiz
               e.target.src = `${card.name.toLowerCase()}.jpg`;
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
