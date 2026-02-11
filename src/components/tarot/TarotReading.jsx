import React from 'react';
import TarotCardComponent from './TarotCardComponent';
import InterpretationDisplay from './InterpretationDisplay';

export default function TarotReading({ selectedCards, theme, personName }) {
  if (!selectedCards || selectedCards.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {selectedCards.map((card, index) => (
          <TarotCardComponent 
            key={card.id || index}
            card={card} 
            reversed={card.reversed}
            position={index === 0 ? "Passado" : index === 1 ? "Presente" : "Futuro"}
          />
        ))}
      </div>

      <InterpretationDisplay 
        cards={selectedCards} 
        theme={theme} 
        personName={personName} 
      />
    </div>
  );
}
