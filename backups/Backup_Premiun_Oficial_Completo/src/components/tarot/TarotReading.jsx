import React from 'react';
import TarotCardComponent from './TarotCardComponent';
import InterpretationDisplay from './InterpretationDisplay';

// Adicionamos birthDate e question nas props recebidas
export default function TarotReading({ selectedCards, theme, personName, birthDate, question }) {
  // Se não houver cartas selecionadas, não renderiza nada para evitar placeholders vazios
  if (!selectedCards || selectedCards.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 animate-fadeIn">
      {/* As imagens das cartas permanecem intocadas no topo, 
          conforme sua instrução terminante. 
      */}
      <div className="flex flex-wrap justify-center gap-10 mb-16">
        {selectedCards.map((card, index) => (
          <TarotCardComponent 
            key={card.id || `card-${index}`}
            card={card} 
            reversed={card.reversed}
            position={index === 0 ? "Passado" : index === 1 ? "Presente" : "Futuro"}
          />
        ))}
      </div>

      {/* Repassando todas as informações para o Display de Interpretação 
      */}
      <InterpretationDisplay 
        cards={selectedCards} 
        theme={theme} 
        personName={personName} 
        birthDate={birthDate}
        question={question}
      />
    </div>
  );
}