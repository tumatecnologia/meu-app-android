import React from 'react';
import ReactMarkdown from 'react-markdown';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ cards, theme, personName }) {
  if (!cards || cards.length === 0) return null;

  const getRobustInterpretation = () => {
    const mainCard = cards[0];
    
    // Tenta encontrar o ID de todas as formas possíveis
    const cardId = mainCard.id || mainCard.name?.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const cardData = tarotDeck[cardId];
    
    if (!cardData) {
      return `### ${mainCard.name || 'Carta'}
      As energias estão se alinhando, mas a profundidade total desta carta ainda está sendo processada.`;
    }

    // Normaliza o tema (ex: 'Amor' vira 'amor') para bater com as chaves do seu tarotData.js
    const activeTheme = theme ? theme.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") : 'conselho';
    
    // BUSCA A PONTE ROBUSTA: temas[amor], temas[trabalho], etc.
    const robustText = cardData.temas?.[activeTheme] || cardData.upright || "A sabedoria desta carta está oculta no momento.";

    return `**${cardData.name}**\n\n${robustText}`;
  };

  const interpretation = getRobustInterpretation();

  return (
    <div className="mt-12 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-t-8 border-amber-400 max-w-4xl mx-auto mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-900 uppercase">
          Interpretação para {personName || 'Você'}
        </h2>
        <div className="h-1.5 w-20 bg-amber-400 mx-auto rounded-full mt-4"></div>
      </div>
      
      <div className="prose prose-xl max-w-none text-gray-900 leading-relaxed font-medium">
        <ReactMarkdown>{interpretation}</ReactMarkdown>
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-100 text-center">
        <p className="text-amber-600 font-bold italic">
          "As cartas revelam o caminho, mas você é o mestre do seu destino."
        </p>
      </div>
    </div>
  );
}
