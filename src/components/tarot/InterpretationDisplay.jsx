import React from 'react';
import ReactMarkdown from 'react-markdown';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ cards, theme, personName }) {
  if (!cards || cards.length === 0) return null;

  const getDetailedInterpretation = () => {
    const mainCard = cards[0];
    const cardData = tarotDeck[mainCard.id];

    if (!cardData) return "Interpretando as energias... Aguarde.";

    // A PONTE CORRETA:
    // O tema vindo do sorteio deve bater exatamente com a chave do tarotData (ex: 'amor', 'trabalho')
    const normalizedTheme = theme 
      ? theme.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
      : 'conselho';
    
    // Busca o texto robusto ou usa o geral
    const text = cardData.temas?.[normalizedTheme] || cardData.upright || "Conselho em análise...";
    
    return text;
  };

  const text = getDetailedInterpretation();

  return (
    <div className="mt-12 bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border-4 border-amber-400 max-w-4xl mx-auto mb-20">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
          Interpretação para {personName || 'você'}
        </h2>
        <div className="h-1 w-24 bg-amber-400 mx-auto rounded-full mt-4"></div>
      </div>
      
      {/* Texto grande, legível e sem cortes */}
      <div className="prose prose-lg max-w-none text-gray-900 leading-relaxed font-semibold">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 text-center">
        <p className="text-amber-600 font-bold italic">
          "As cartas revelam a tendência, mas você é o mestre do seu destino."
        </p>
      </div>
    </div>
  );
}
