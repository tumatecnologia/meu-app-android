import React from 'react';
import ReactMarkdown from 'react-markdown';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ cards, theme, personName }) {
  // Se não houver cartas, não renderiza nada
  if (!cards || !cards[0] || !cards[0].id) return null;

  const getRobustInterpretation = () => {
    const mainCard = cards[0];
    const cardId = mainCard.id;
    const cardData = tarotDeck[cardId];
    
    if (!cardData) {
      return `A energia de **${mainCard.name}** está presente. Esta carta fala sobre um momento de grande significado em sua jornada.`;
    }

    // Normaliza o tema (ex: 'Amor' vira 'amor')
    const activeTheme = theme 
      ? theme.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
      : 'conselho';
    
    // Pega o texto do seu tarotData.js
    const robustText = cardData.temas?.[activeTheme] || cardData.upright || "A sabedoria profunda desta carta está se revelando...";

    return robustText;
  };

  return (
    <div className="mt-12 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-t-8 border-amber-400 max-w-4xl mx-auto mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-900 uppercase">
          Interpretação para {personName || 'Você'}
        </h2>
        <div className="h-1.5 w-20 bg-amber-400 mx-auto rounded-full mt-4"></div>
      </div>
      
      <div className="prose prose-xl max-w-none text-gray-900 leading-relaxed font-medium">
        <ReactMarkdown>{getRobustInterpretation()}</ReactMarkdown>
      </div>
    </div>
  );
}
