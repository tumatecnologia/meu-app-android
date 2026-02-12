import React, { useState, useEffect } from 'react';

export default function TarotCardComponent({ card, reversed = false, position }) {
  if (!card) return null;

  // Formata o nome do arquivo (ex: "o-louco" -> "o louco.jpg")
  const fileName = card.id.replace(/-/g, ' ') + '.jpg';
  
  // Lista de caminhos possíveis para o GitHub Pages
  const paths = [
    `assets/cartas/${fileName}`,
    `/meu-app-android/assets/cartas/${fileName}`,
    `cartas/${fileName}`,
    `/assets/cartas/${fileName}`
  ];

  const [currentPathIndex, setCurrentPathIndex] = useState(0);

  // Log inicial para o terminal do navegador
  useEffect(() => {
    console.log(`🔍 Tentativa Inicial [${card.name}]: `, paths[0]);
  }, [card.id]);

  const handleError = (e) => {
    const failedUrl = e.target.src;
    console.error(`❌ FALHA ao carregar: ${failedUrl}`);
    
    if (currentPathIndex < paths.length - 1) {
      const nextIndex = currentPathIndex + 1;
      const nextPath = paths[nextIndex];
      
      console.warn(`➡️ TENTANDO PRÓXIMO CAMINHO (${nextIndex + 1}/${paths.length}): ${nextPath}`);
      
      setCurrentPathIndex(nextIndex);
      e.target.src = nextPath;
    } else {
      console.error(`🚫 TODAS AS TENTATIVAS FALHARAM para: ${card.name}`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {position && (
        <span className="mb-4 px-6 py-1.5 rounded-full bg-purple-900/80 text-amber-400 text-sm font-bold border border-amber-500/30 uppercase">
          {position}
        </span>
      )}
      
      <div className="relative w-48 h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-gray-900">
        <img 
          src={paths[currentPathIndex]} 
          alt={card.name}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
          onLoad={() => console.log(`✅ SUCESSO ao carregar [${card.name}]: `, paths[currentPathIndex])}
          onError={handleError}
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/70 backdrop-blur-sm">
           <p className="text-white font-bold text-[10px] uppercase tracking-tighter">{card.name}</p>
        </div>
      </div>
    </div>
  );
}
