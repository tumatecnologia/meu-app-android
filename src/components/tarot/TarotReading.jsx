import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCw, Calendar } from 'lucide-react';
import InterpretationDisplay from './InterpretationDisplay';
import TarotCardComponent from './TarotCardComponent';

const TarotReading = ({ theme, userData, onNewReading }) => {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);

  const themeLabels = {
    'amor': 'Amor', 'carreira': 'Carreira', 'financas': 'Finanças',
    'espiritualidade': 'Espiritualidade', 'saude': 'Saúde', 'traicao': 'Traição',
    'casamento': 'Casamento', 'viagem': 'Viagem', 'noivado': 'Noivado',
    'conselho': 'Conselho', 'justica': 'Justiça'
  };

  useEffect(() => {
    const generateReading = () => {
      const today = new Date().toLocaleDateString('pt-BR');
      
      const allCards = [
        { id: 'o-louco', name: 'O Louco', number: '0', element: 'Ar', upright: 'Novos começos', reversed: 'Imprudência', image: '0' },
        { id: 'o-mago', name: 'O Mago', number: 'I', element: 'Ar', upright: 'Vontade', reversed: 'Manipulação', image: '1' },
        { id: 'a-sacerdotisa', name: 'A Sacerdotisa', number: 'II', element: 'Água', upright: 'Intuição', reversed: 'Segredos', image: '2' },
        { id: 'a-imperatriz', name: 'A Imperatriz', number: 'III', element: 'Terra', upright: 'Fertilidade', reversed: 'Dependência', image: '3' },
        { id: 'o-imperador', name: 'O Imperador', number: 'IV', element: 'Fogo', upright: 'Autoridade', reversed: 'Rigidez', image: '4' },
        { id: 'o-hierofante', name: 'O Hierofante', number: 'V', element: 'Terra', upright: 'Tradição', reversed: 'Rebelião', image: '5' },
        { id: 'os-enamorados', name: 'Os Enamorados', number: 'VI', element: 'Ar', upright: 'Amor', reversed: 'Dúvida', image: '6' },
        { id: 'o-carro', name: 'O Carro', number: 'VII', element: 'Água', upright: 'Vitória', reversed: 'Agressão', image: '7' },
        { id: 'a-justica', name: 'A Justiça', number: 'VIII', element: 'Ar', upright: 'Equilíbrio', reversed: 'Injustiça', image: '8' },
        { id: 'o-eremita', name: 'O Eremita', number: 'IX', element: 'Terra', upright: 'Prudência', reversed: 'Isolamento', image: '9' },
        { id: 'a-roda-da-fortuna', name: 'A Roda da Fortuna', number: 'X', element: 'Fogo', upright: 'Destino', reversed: 'Má sorte', image: '10' },
        { id: 'a-forca', name: 'A Força', number: 'XI', element: 'Fogo', upright: 'Coragem', reversed: 'Fraqueza', image: '11' },
        { id: 'o-enforcado', name: 'O Pendurado', number: 'XII', element: 'Água', upright: 'Sacrifício', reversed: 'Estagnação', image: '12' },
        { id: 'a-morte', name: 'A Morte', number: 'XIII', element: 'Água', upright: 'Mudança', reversed: 'Medo', image: '13' },
        { id: 'a-temperanca', name: 'A Temperança', number: 'XIV', element: 'Fogo', upright: 'Equilíbrio', reversed: 'Excesso', image: '14' },
        { id: 'o-diabo', name: 'O Diabo', number: 'XV', element: 'Terra', upright: 'Ambição', reversed: 'Libertação', image: '15' },
        { id: 'a-torre', name: 'A Torre', number: 'XVI', element: 'Fogo', upright: 'Revelação', reversed: 'Atraso', image: '16' },
        { id: 'a-estrela', name: 'A Estrela', number: 'XVII', element: 'Ar', upright: 'Esperança', reversed: 'Desespero', image: '17' },
        { id: 'a-lua', name: 'A Lua', number: 'XVIII', element: 'Água', upright: 'Intuição', reversed: 'Confusão', image: '18' },
        { id: 'o-sol', name: 'O Sol', number: 'XIX', element: 'Fogo', upright: 'Sucesso', reversed: 'Tristeza', image: '19' },
        { id: 'o-julgamento', name: 'O Julgamento', number: 'XX', element: 'Fogo', upright: 'Renascimento', reversed: 'Dúvida', image: '20' },
        { id: 'o-mundo', name: 'O Mundo', number: 'XXI', element: 'Terra', upright: 'Conclusão', reversed: 'Inércia', image: '21' }
      ];

      const selectedCards = [];
      const used = new Set();
      while (selectedCards.length < 3) {
        const idx = Math.floor(Math.random() * allCards.length);
        if (!used.has(idx)) {
          used.add(idx);
          selectedCards.push({
            ...allCards[idx],
            position: selectedCards.length === 0 ? 'Passado' : selectedCards.length === 1 ? 'Presente' : 'Futuro',
            reversed: Math.random() > 0.7
          });
        }
      }

      setReading({ cards: selectedCards, date: today, theme });
      setLoading(false);
    };
    setTimeout(generateReading, 1500);
  }, [theme]);

  if (loading) return (
    <div className="text-center py-20">
      <div className="animate-spin h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
      <p className="text-purple-200">Embaralhando as energias...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">Leitura Sagrada</h2>
        <p className="text-amber-300 capitalize">Tema: {themeLabels[reading.theme] || reading.theme}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {reading.cards.map((card, index) => (
          <TarotCardComponent 
            key={index}
            card={card}
            index={index}
            position={card.position}
            reversed={card.reversed}
            autoReveal={true}
          />
        ))}
      </div>

      <InterpretationDisplay 
        cards={reading.cards} 
        theme={reading.theme}
        personName={userData?.name}
        birthDate={userData?.birthDate}
      />

      <div className="text-center mt-12">
        <button onClick={onNewReading} className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-purple-900 font-bold py-3 px-8 rounded-full transition-all">
          <RotateCw className="w-5 h-5" /> Nova Consulta
        </button>
      </div>
    </div>
  );
};

export default TarotReading;
