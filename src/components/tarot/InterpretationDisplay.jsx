import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ cards, theme, personName }) {
  const getPremiumInterpretation = () => {
    if (cards && cards.length > 0 && theme) {
      const cardId = cards[0].id;
      const normalizedTheme = theme.toLowerCase();
      
      // Busca no banco de dados tarotData.js
      if (tarotDeck[cardId] && tarotDeck[cardId].temas[normalizedTheme]) {
        return tarotDeck[cardId].temas[normalizedTheme];
      }
    }
    return "Sua interpretação está sendo processada pelas energias do universo...";
  };

  const finalInterpretation = getPremiumInterpretation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="mt-8 bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-amber-400"
    >
      <div className="text-center mb-6">
        <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h2 className="text-3xl font-bold text-purple-900">Interpretação para {personName || 'Você'}</h2>
      </div>
      
      <div className="prose prose-purple max-w-none text-left">
        <ReactMarkdown>
          {finalInterpretation}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}
