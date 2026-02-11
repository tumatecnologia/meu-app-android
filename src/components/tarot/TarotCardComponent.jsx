import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  if (!card) return null;

  // Mapeamento direto usando o nome que aparece na tela (convertido para o nome do arquivo)
  // Removemos a barra inicial do path para compatibilidade com GitHub Pages
  const getImagePath = (cardName) => {
    const name = cardName.toLowerCase();
    // Ajuste específico para o heremita que vimos no seu 'ls'
    if (name === 'o eremita') return 'assets/cartas/o heremita.jpg';
    return `assets/cartas/${name}.jpg`;
  };

  const imagePath = getImagePath(card.name);

  return (
    <div className="flex flex-col items-center">
      {position && (
        <span className="mb-4 px-6 py-1.5 rounded-full bg-purple-900/50 text-amber-400 text-sm font-bold border border-amber-500/30 uppercase">
          {position}
        </span>
      )}
      
      <div className="relative w-48 h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-gray-900">
        <img 
          src={imagePath} 
          alt={card.name}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
          onError={(e) => {
            console.error("Falha fatal no link:", e.target.src);
            // Tenta um caminho alternativo sem o 'assets/' caso o build tenha movido os arquivos
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = "true";
              e.target.src = e.target.src.replace('assets/cartas/', 'cartas/');
            }
          }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/80">
           <p className="text-white font-bold text-xs uppercase tracking-widest">{card.name}</p>
        </div>

        {reversed && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
            INVERTIDA
          </div>
        )}
      </div>
    </div>
  );
}
