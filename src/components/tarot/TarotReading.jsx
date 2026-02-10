import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCw, Calendar } from 'lucide-react';
import InterpretationDisplay from './InterpretationDisplay';

const TarotReading = ({ paymentId, theme, userData, onNewReading }) => {
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
      const today = new Date().toISOString().split('T')[0];
      
      const allCards = [
        { id: 'o-louco', name: 'O Louco', upright: 'Novos começos, aventura, liberdade', reversed: 'Imprudência, risco excessivo' },
        { id: 'o-mago', name: 'O Mago', upright: 'Vontade, habilidade, recurso', reversed: 'Manipulação, falta de habilidade' },
        { id: 'a-sacerdotisa', name: 'A Sacerdotisa', upright: 'Intuição, mistério, sabedoria', reversed: 'Ignorar a intuição, superficialidade' },
        { id: 'a-imperatriz', name: 'A Imperatriz', upright: 'Fertilidade, beleza, natureza', reversed: 'Dependência, negligência' },
        { id: 'o-imperador', name: 'O Imperador', upright: 'Autoridade, estrutura, controle', reversed: 'Rigidez, dominação' },
        { id: 'o-hierofante', name: 'O Hierofante', upright: 'Tradição, espiritualidade, conformidade', reversed: 'Rebelião, não-conformidade' },
        { id: 'os-enamorados', name: 'Os Enamorados', upright: 'Amor, harmonia, relacionamentos', reversed: 'Desequilíbrio, escolhas difíceis' },
        { id: 'o-carro', name: 'O Carro', upright: 'Determinação, vitória, vontade', reversed: 'Falta de direção, agressão' },
        { id: 'a-forca', name: 'A Força', upright: 'Coragem, paciência, controle', reversed: 'Fraqueza, insegurança' },
        { id: 'o-eremita', name: 'O Eremita', upright: 'Introspecção, prudência, orientação', reversed: 'Isolamento, ignorância' },
        { id: 'a-roda-da-fortuna', name: 'A Roda da Fortuna', upright: 'Destino, sorte, ciclos', reversed: 'Má sorte, resistência à mudança' },
        { id: 'a-justica', name: 'A Justiça', upright: 'Equilíbrio, justiça, verdade', reversed: 'Injustiça, falta de responsabilidade' },
        { id: 'o-enforcado', name: 'O Pendurado', upright: 'Sacrifício, perspectiva, rendição', reversed: 'Estagnação, resistência' },
        { id: 'a-morte', name: 'A Morte', upright: 'Fim, mudança, transformação', reversed: 'Medo de mudar, estagnação' },
        { id: 'a-temperanca', name: 'A Temperança', upright: 'Equilíbrio, moderação, paciência', reversed: 'Desequilíbrio, excessos' },
        { id: 'o-diabo', name: 'O Diabo', upright: 'Escravidão, materialismo, ignorância', reversed: 'Libertação, esclarecimento' },
        { id: 'a-torre', name: 'A Torre', upright: 'Mudança repentina, revelação', reversed: 'Medo de mudança, desastre evitado' },
        { id: 'a-estrela', name: 'A Estrela', upright: 'Esperança, inspiração, serenidade', reversed: 'Desespero, falta de fé' },
        { id: 'a-lua', name: 'A Lua', upright: 'Ilusão, intuição, inconsciente', reversed: 'Confusão, medo' },
        { id: 'o-sol', name: 'O Sol', upright: 'Alegria, sucesso, vitalidade', reversed: 'Tristeza, falta de sucesso' },
        { id: 'o-julgamento', name: 'O Julgamento', upright: 'Renascimento, absolvição, decisão', reversed: 'Dúvida, culpa' },
        { id: 'o-mundo', name: 'O Mundo', upright: 'Realização, viagem, integração', reversed: 'Incompletude, falta de realização' }
      ];

      const selectedCards = [];
      const usedIndexes = new Set();
      
      while (selectedCards.length < 3) {
        const randomIndex = Math.floor(Math.random() * allCards.length);
        if (!usedIndexes.has(randomIndex)) {
          usedIndexes.add(randomIndex);
          const card = allCards[randomIndex];
          const reversed = Math.random() > 0.7;
          
          selectedCards.push({
            id: card.id,
            card_name: card.name,
            position: selectedCards.length === 0 ? 'Passado' : selectedCards.length === 1 ? 'Presente' : 'Futuro',
            reversed: reversed,
            meaning: reversed ? card.reversed : card.upright
          });
        }
      }

      setReading({
        cards: selectedCards,
        date: today,
        theme: theme
      });
      setLoading(false);
    };

    setTimeout(generateReading, 1500);
  }, [theme]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
        <p className="text-purple-300">Preparando sua leitura personalizada...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-amber-400/20 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Leitura de 3 Cartas
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 text-purple-300">
          <div className="flex items-center gap-1 bg-purple-800/40 px-3 py-1 rounded-full">
            <span className="text-amber-300">🎴</span>
            <span>{themeLabels[reading.theme] || reading.theme}</span>
          </div>
          <div className="flex items-center gap-1 bg-purple-800/40 px-3 py-1 rounded-full">
            <Calendar className="w-3 h-3" />
            <span>{reading.date}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {reading.cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-purple-800/40 to-violet-800/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30"
          >
            <div className="text-center">
              <div className="mb-4">
                <span className={}>
                  {card.position}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{card.card_name}</h3>
              
              <div className="mb-3">
                <span className={}>
                  {card.reversed ? '🔄 Invertida' : '⬆️ Direta'}
                </span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-purple-400/30">
                <p className="text-purple-200 text-sm">
                  {card.meaning}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AQUI ESTÁ A LIGAÇÃO CORRETA COM O LAYOUT ANTIGO */}
      <InterpretationDisplay 
        interpretation="" // Deixamos vazio para o InterpretationDisplay buscar no tarotData.js
        cards={reading.cards} 
        theme={reading.theme}
        personName={userData?.name}
        birthDate={userData?.birthDate}
      />

      <div className="flex flex-wrap gap-3 justify-center mb-8 mt-12">
        <button
          onClick={onNewReading}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
        >
          <RotateCw className="w-4 h-4" />
          Nova Leitura
        </button>
      </div>

    </motion.div>
  );
};

export default TarotReading;
