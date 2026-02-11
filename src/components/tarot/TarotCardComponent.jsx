import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  if (!card) return null;

  const cardId = card.id || '';
  
  // Função para tratar o nome do arquivo exatamente como você tem na pasta
  const getFileName = (id) => {
    if (id === 'o-eremita') return 'o heremita.jpg';
    if (id === 'a-roda-da-fortuna') return 'a roda-da-fortuna.jpg';
    return id.replace(/-/g, ' ') + '.jpg';
  };

  const fileName = getFileName(cardId);
  // Tentativa 1: Caminho relativo padrão
  const primaryPath = `assets/cartas/${fileName}`;

  return (
    <div className="flex flex-col items-center">
      {position && (
        <span className="mb-4 px-6 py-1.5 rounded-full bg-purple-900/80 text-amber-400 text-sm font-bold border border-amber-500/30 uppercase">
          {position}
        </span>
      )}
      
      <div className="relative w-48 h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-gray-900">
        <img 
          src={primaryPath} 
          alt={card.name}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
          onError={(e) => {
            const tried = e.target.dataset.tried || "0";
            
            if (tried === "0") {
              e.target.dataset.tried = "1";
              // Tentativa 2: Com barra inicial
              e.target.src = `/${primaryPath}`;
            } else if (tried === "1") {
              e.target.dataset.tried = "2";
              // Tentativa 3: Direto na pasta cartas (sem assets)
              e.target.src = `cartas/${fileName}`;
            } else if (tried === "2") {
              e.target.dataset.tried = "3";
              // Tentativa 4: Forçando o caminho completo do GitHub
              const repoName = window.location.pathname.split('/')[1];
              e.target.src = `/${repoName}/assets/cartas/${fileName}`;
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
