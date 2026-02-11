import React, { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';
import InterpretationDisplay from './InterpretationDisplay';
import TarotCardComponent from './TarotCardComponent';

const TarotReading = ({ theme, userData, onNewReading }) => {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateReading = () => {
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

      const selected = [];
      const used = new Set();
      while (selected.length < 3) {
        const idx = Math.floor(Math.random() * allCards.length);
        if (!used.has(idx)) {
          used.add(idx);
          selected.push({
            ...allCards[idx],
            position: selected.length === 0 ? 'Passado' : selected.length === 1 ? 'Presente' : 'Futuro',
            reversed: Math.random() > 0.7
          });
        }
      }
      setReading({ cards: selected, theme });
      setLoading(false);
    };
    setTimeout(generateReading, 1000);
  }, [theme]);

  if (loading) return <div className="text-center py-20 text-white font-bold text-xl">Invocando os Arcanos...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <div className="flex flex-wrap justify-center items-start gap-6 md:gap-12 mb-16">
        {reading.cards.map((card, index) => (
          <div key={index} className="w-full sm:w-64">
            <TarotCardComponent 
              card={card} 
              position={card.position} 
              reversed={card.reversed}
            />
          </div>
        ))}
      </div>

      {/* PASSANDO A LISTA COMPLETA DE CARTAS COM ID */}
      <InterpretationDisplay 
        cards={reading.cards} 
        theme={reading.theme}
        personName={userData?.name}
      />

      <div className="text-center mt-12">
        <button onClick={onNewReading} className="bg-amber-500 text-purple-900 font-bold py-4 px-10 rounded-full hover:bg-amber-400 transition-all shadow-xl active:scale-95">
          <RotateCw className="inline-block mr-2" size={20} /> Nova Consulta
        </button>
      </div>
    </div>
  );
};

export default TarotReading;
