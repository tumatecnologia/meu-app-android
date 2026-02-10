import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ interpretation, cards, theme, personName, birthDate }) {
  
  // Lógica para buscar a interpretação Premium do nosso arquivo
  const getPremiumInterpretation = () => {
    if (cards && cards.length > 0 && theme) {
      const cardId = cards[0].id; // Pega o ID da primeira carta (ex: 'o-louco')
      const normalizedTheme = theme.toLowerCase(); // Garante que o tema bata com a chave (ex: 'Amor' -> 'amor')
      
      if (tarotDeck[cardId] && tarotDeck[cardId].temas[normalizedTheme]) {
        return tarotDeck[cardId].temas[normalizedTheme];
      }
    }
    return interpretation; // Fallback para a interpretação original caso não encontre no banco
  };

  const finalInterpretation = getPremiumInterpretation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8 bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border-2 border-amber-400/50"
    >
      <div className="text-center mb-8 pb-6 border-b-2 border-amber-400/30">
        <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-purple-900 mb-6">Sua Interpretação Sagrada</h2>
        
        {personName && (
          <div className="bg-gradient-to-br from-purple-100 to-amber-50 rounded-2xl p-6 max-w-lg mx-auto shadow-lg">
            <p className="text-purple-900 font-bold text-2xl mb-3">👤 {personName}</p>
            {birthDate && (
              <p className="text-purple-700 text-lg mb-2">
                🎂 Nascimento: {format(new Date(birthDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            )}
            {theme && (
              <p className="text-purple-800 font-semibold text-xl mt-3">
                🔮 Tema: <span className="capitalize text-amber-700">{theme}</span>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="prose prose-purple prose-xl max-w-none">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="text-purple-800 leading-relaxed mb-6 text-lg">{children}</p>,
            strong: ({ children }) => <strong className="text-purple-900 font-bold text-lg">{children}</strong>,
            h3: ({ children }) => (
              <h3 className="text-3xl font-bold text-purple-900 mt-10 mb-6 flex items-center gap-3 border-b-2 border-amber-400 pb-3">
                <Moon className="w-8 h-8 text-amber-500" />
                {children}
              </h3>
            ),
            h2: ({ children }) => (
              <h2 className="text-4xl font-bold text-purple-900 mt-8 mb-6 text-center">
                {children}
              </h2>
            ),
            ul: ({ children }) => <ul className="space-y-4 mb-8 ml-6">{children}</ul>,
            li: ({ children }) => (
              <li className="text-purple-800 flex items-start gap-4 text-lg">
                <Sun className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                <span>{children}</span>
              </li>
            ),
          }}
        >
          {finalInterpretation}
        </ReactMarkdown>
      </div>

      <div className="mt-10 pt-8 border-t-2 border-amber-400/30 bg-gradient-to-r from-purple-100/50 to-amber-50/50 rounded-xl p-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <Sparkles className="w-4 h-4 text-purple-500" />
          <Sparkles className="w-6 h-6 text-amber-500" />
        </div>
        <p className="text-base text-center text-purple-600 italic">
          Esta interpretação foi canalizada especialmente para você através das energias ancestrais do Tarô.
        </p>
      </div>
    </motion.div>
  );
}
