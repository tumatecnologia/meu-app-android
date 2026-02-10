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
    return "As energias estão se alinhando... (Carta não mapeada: " + cardId + ")";
  };

  const finalInterpretation = getPremiumInterpretation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="mt-12 bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 md:p-14 shadow-2xl border-2 border-amber-400 max-w-4xl mx-auto mb-16"
    >
      <div className="text-center mb-10">
        <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-purple-900 mb-3">Interpretação para {personName || 'Você'}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto rounded-full mb-4"></div>
        <p className="text-amber-600 font-bold uppercase tracking-[0.2em] text-xs">Mensagem do Oráculo</p>
      </div>
      
      <div className="prose prose-purple prose-lg max-w-none">
        <div className="text-purple-900 leading-[1.8] font-medium italic text-center text-xl md:text-2xl px-2 md:px-6">
          <ReactMarkdown>
            {finalInterpretation}
          </ReactMarkdown>
        </div>
      </div>

      <div className="mt-14 pt-8 border-t border-amber-100 text-center">
        <p className="text-purple-300 text-sm italic">
          "As cartas revelam o caminho, mas você é o mestre do seu destino."
        </p>
        <p className="text-purple-200 text-xs mt-2 uppercase tracking-widest">Consulta Realizada em 2026</p>
      </div>
    </motion.div>
  );
}
