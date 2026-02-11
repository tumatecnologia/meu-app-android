import React from 'react';
import ReactMarkdown from 'react-markdown';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ cards, theme, personName }) {
  if (!cards || !cards[0] || !cards[0].id) return null;

  const getRobustInterpretation = () => {
    const mainCard = cards[0];
    const cardData = tarotDeck[mainCard.id];
    
    if (!cardData) return "A sabedoria desta carta está se revelando...";

    // Normaliza o tema (ex: 'Amor' vira 'amor')
    const activeTheme = theme 
      ? theme.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
      : 'conselho';
    
    // A PONTE: Busca o texto detalhado no objeto 'temas' do seu arquivo
    const robustText = cardData.temas?.[activeTheme] || cardData.upright;

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
      
      {/* Texto em preto sólido para legibilidade total */}
      <div className="prose prose-xl max-w-none text-gray-900 leading-relaxed font-medium">
        <ReactMarkdown>{getRobustInterpretation()}</ReactMarkdown>
      </div>
    </div>
  );
}
