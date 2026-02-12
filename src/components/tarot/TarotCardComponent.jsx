import React from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  const cardName = card?.name || card?.card_name || "";
  
  // 1. Tratamento do nome (minúsculas e sem acentos)
  const fileName = cardName.toLowerCase()
                           .normalize('NFD')
                           .replace(/[\u0300-\u036f]/g, "");
  
  // 2. Caminho baseado na pasta public (deve funcionar)
  const finalImage = `/assets/cartas/${fileName}.jpg`;

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
            // Logs detalhados para o console se falhar
            console.error("❌ Imagem não encontrada:", e.target.src);
            console.log("📂 Procurando em: public/assets/cartas/" + fileName + ".jpg");
          }}
          onLoad={() => console.log("✅ Imagem carregada:", finalImage)}
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/80 backdrop-blur-sm border-t border-amber-400/30">
           <p className="text-white font-bold text-[11px] uppercase tracking-tighter">{cardName}</p>
        </div>
      </div>
    </div>
  );
}