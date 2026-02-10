import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ cards, theme, personName }) {
  const getPremiumInterpretation = () => {
    if (!cards || cards.length === 0) return "Aguardando as cartas...";
    
    const cardId = cards[0].id;
    const normalizedTheme = theme 
      ? theme.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
      : 'conselho';
    
    const cardData = tarotDeck[cardId];
    if (cardData) {
      return cardData.temas[normalizedTheme] || cardData.temas['conselho'];
    }
    return "As energias estão se alinhando para a carta: " + cardId;
  };

  const finalInterpretation = getPremiumInterpretation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      // h-auto garante que a altura seja automática. p-10 md:p-16 dá muito espaço.
      className="mt-12 bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl border-4 border-amber-400 max-w-4xl mx-auto mb-20 h-auto min-h-[400px]"
    >
      <div className="text-center mb-10">
        <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-4xl font-black text-purple-950 mb-3">Interpretação para {personName || 'Você'}</h2>
        <div className="h-1.5 w-32 bg-amber-400 mx-auto rounded-full mb-4"></div>
      </div>
      
      {/* CORRIGIDO: text-purple-950 (quase preto) para leitura perfeita e h-full */}
      <div className="w-full h-full overflow-visible">
        <div className="prose prose-purple prose-xl max-w-none text-purple-950 leading-relaxed font-serif text-center md:text-left">
          <ReactMarkdown>
            {finalInterpretation}
          </ReactMarkdown>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t-2 border-amber-100 text-center">
        <p className="text-purple-900 font-bold italic text-lg">
          "As cartas revelam o caminho, mas você é o mestre do seu destino."
        </p>
      </div>
    </motion.div>
  );
}
