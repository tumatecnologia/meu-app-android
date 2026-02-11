import React from 'react';
import ReactMarkdown from 'react-markdown';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ cards, theme, personName }) {
  if (!cards || cards.length === 0) return null;

  const getFullInterpretation = () => {
    const mainCard = cards[0];
    const cardData = tarotDeck[mainCard.id];
    
    if (!cardData) return "As energias de " + mainCard.name + " estão se revelando para você...";

    const normalizedTheme = theme ? theme.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") : 'conselho';
    
    // Busca o texto do tema ou usa o significado geral (upright)
    const text = cardData.temas?.[normalizedTheme] || cardData.upright || "Interpretação em análise...";
    
    return text;
  };

  return (
    <div className="mt-12 bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-amber-400 max-w-4xl mx-auto mb-20">
      <h2 className="text-3xl font-black text-gray-900 text-center mb-6 border-b-2 border-amber-200 pb-4">
        Interpretação para {personName || 'Você'}
      </h2>
      
      <div className="prose prose-lg max-w-none text-gray-900 font-semibold leading-relaxed">
        <ReactMarkdown>{getFullInterpretation()}</ReactMarkdown>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-amber-600 font-bold italic text-sm">
          "As cartas revelam o caminho, mas você é o mestre do seu destino."
        </p>
      </div>
    </div>
  );
}
