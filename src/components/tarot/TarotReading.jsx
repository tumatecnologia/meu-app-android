import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import InterpretationDisplay from './InterpretationDisplay';
import TarotCardComponent from './TarotCardComponent';

const TarotReading = ({ theme, userData, onNewReading }) => {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateReading = () => {
      // IDs EXATOS para bater com o tarotData.js
      const allCards = [
        { id: 'o-louco', name: 'O Louco', number: '0' },
        { id: 'o-mago', name: 'O Mago', number: 'I' },
        { id: 'a-sacerdotisa', name: 'A Sacerdotisa', number: 'II' },
        { id: 'a-imperatriz', name: 'A Imperatriz', number: 'III' },
        { id: 'o-imperador', name: 'O Imperador', number: 'IV' },
        { id: 'o-hierofante', name: 'O Hierofante', number: 'V' },
        { id: 'os-enamorados', name: 'Os Enamorados', number: 'VI' },
        { id: 'o-carro', name: 'O Carro', number: 'VII' },
        { id: 'a-justica', name: 'A Justiça', number: 'VIII' },
        { id: 'o-eremita', name: 'O Eremita', number: 'IX' },
        { id: 'a-roda-da-fortuna', name: 'A Roda da Fortuna', number: 'X' },
        { id: 'a-forca', name: 'A Força', number: 'XI' },
        { id: 'o-enforcado', name: 'O Pendurado', number: 'XII' },
        { id: 'a-morte', name: 'A Morte', number: 'XIII' },
        { id: 'a-temperanca', name: 'A Temperança', number: 'XIV' },
        { id: 'o-diabo', name: 'O Diabo', number: 'XV' },
        { id: 'a-torre', name: 'A Torre', number: 'XVI' },
        { id: 'a-estrela', name: 'A Estrela', number: 'XVII' },
        { id: 'a-lua', name: 'A Lua', number: 'XVIII' },
        { id: 'o-sol', name: 'O Sol', number: 'XIX' },
        { id: 'o-julgamento', name: 'O Julgamento', number: 'XX' },
        { id: 'o-mundo', name: 'O Mundo', number: 'XXI' }
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
      setReading({ cards: selectedCards, theme });
      setLoading(false);
    };
    setTimeout(generateReading, 1000);
  }, [theme]);

  if (loading) return <div className="text-center py-20 text-white font-bold">Embaralhando...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* GRID FORÇADO: 3 colunas no PC, 1 no Celular */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-8 mb-12">
        {reading.cards.map((card, index) => (
          <div key={index} className="w-full md:w-1/3">
            <TarotCardComponent 
              card={card} 
              position={card.position} 
              reversed={card.reversed} 
              autoReveal={true}
              index={index}
            />
          </div>
        ))}
      </div>

      <InterpretationDisplay 
        cards={reading.cards} 
        theme={reading.theme}
        personName={userData?.name}
      />

      <div className="text-center mt-12 mb-10">
        <button onClick={onNewReading} className="bg-amber-500 text-purple-900 font-bold py-3 px-8 rounded-full flex items-center gap-2 mx-auto hover:bg-amber-400 transition-colors shadow-lg">
          <RotateCw size={20} /> Nova Consulta
        </button>
      </div>
    </div>
  );
};

export default TarotReading;
