import "./TarotCard.css";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function TarotCardComponent({ 
  card, 
  reversed = false, 
  revealed = false, 
  onReveal, 
  position,
  autoReveal = false,
  index = 0 
}) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [isRevealed, setIsRevealed] = useState(revealed);
  const [localReversed, setLocalReversed] = useState(reversed);

  useEffect(() => {
    if (autoReveal && !isRevealed) {
      const delay = (index || 0) * 1500 + 1000;
      const timer = setTimeout(() => {
        handleReveal();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [autoReveal, isRevealed, index]);

  useEffect(() => {
    setLocalReversed(reversed);
  }, [reversed]);

  const handleReveal = () => {
    if (!isRevealed) {
      setIsFlipping(true);
      setTimeout(() => {
        setIsRevealed(true);
        if (onReveal) onReveal();
        setIsFlipping(false);
      }, 600);
    }
  };

  const handleClick = () => {
    if (!isRevealed && !autoReveal) {
      handleReveal();
    }
  };

  // Dados da carta - pode ser passado como prop ou usar padrão
  const cardData = card || {
    name: position === 'Passado' ? 'O Louco' : 
           position === 'Presente' ? 'A Sacerdotisa' : 
           position === 'Futuro' ? 'O Sol' : 'Carta do Destino',
    meaning: position === 'Passado' ? 'Novos começos, liberdade, aventura' : 
             position === 'Presente' ? 'Intuição, mistério, sabedoria interior' : 
             position === 'Futuro' ? 'Sucesso, alegria, realização' : 'Significado profundo',
    description: 'Uma carta poderosa do tarot com significado ancestral',
    number: position === 'Passado' ? '0' : 
            position === 'Presente' ? 'II' : 
            position === 'Futuro' ? 'XIX' : '?',
    element: position === 'Passado' ? 'Ar' : 
             position === 'Presente' ? 'Água' : 
             position === 'Futuro' ? 'Fogo' : 'Espírito',
    upright: position === 'Passado' ? 'Espontaneidade, fé no universo' : 
             position === 'Presente' ? 'Conhecimento oculto, sabedoria divina' : 
             position === 'Futuro' ? 'Vitalidade, crescimento, felicidade' : 'Iluminação',
    reversed: position === 'Passado' ? 'Imprudência, falta de foco' : 
              position === 'Presente' ? 'Segredos, ilusão, falta de intuição' : 
              position === 'Futuro' ? 'Excesso de confiança, atrasos' : 'Desorientação'
  };

  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* Indicador de posição */}
      {position && (
        <div className="mb-3 text-center">
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
            position === 'Passado' ? 'bg-blue-500/30 text-blue-300' :
            position === 'Presente' ? 'bg-amber-500/30 text-amber-300' :
            'bg-green-500/30 text-green-300'
          }`}>
            {position}
          </span>
        </div>
      )}

      {/* Carta */}
      <div 
        className={`relative w-48 h-72 mx-auto ${!isRevealed && !autoReveal ? 'cursor-pointer hover:scale-105 transition-transform duration-300' : ''}`}
        onClick={handleClick}
      >
        {/* Animação de flip */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={isFlipping ? { rotateY: 90 } : { rotateY: 0 }}
          transition={{ duration: 0.3 }}
          style={{ 
            transformStyle: 'preserve-3d',
            transformOrigin: 'center'
          }}
        >
          {/* Verso da carta (quando não revelado) */}
          {!isRevealed ? (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-800 to-violet-900 rounded-2xl border-4 border-amber-400/50 flex flex-col items-center justify-center p-4 backface-hidden">
              <div className="text-amber-400 text-5xl mb-4">🔮</div>
              <div className="text-white text-center">
                <p className="text-sm mb-2">Tarot Místico</p>
                <div className="flex gap-1 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Frente da carta (quando revelado) */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-4 border-amber-600 shadow-2xl flex flex-col items-center justify-center p-4 backface-hidden"
            >
              {/* Indicador de carta reversa */}
              {localReversed && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  🔄 Invertida
                </div>
              )}

              {/* Número da carta */}
              <div className="absolute top-3 left-3 text-2xl font-bold text-amber-800">
                {cardData.number}
              </div>

              {/* Nome da carta */}
              <div className="text-center mt-6">
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  {cardData.name}
                </h3>
                <div className="text-5xl mb-3">🃏</div>
              </div>

              {/* Elemento */}
              <div className="absolute bottom-12 text-sm text-amber-700 font-medium">
                Elemento: {cardData.element}
              </div>

              {/* Significado breve */}
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <p className="text-xs text-amber-800 font-medium">
                  {localReversed ? cardData.reversed : cardData.upright}
                </p>
              </div>

              {/* Bordas decorativas */}
              <div className="absolute inset-2 border-2 border-amber-300/30 rounded-xl pointer-events-none" />
            </motion.div>
          )}
        </motion.div>

        {/* Indicador de revelação automática */}
        {!isRevealed && autoReveal && (
          <motion.div
            className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1 z-10"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className="w-3 h-3 text-purple-900" />
          </motion.div>
        )}
      </div>

      {/* Informação da carta quando revelada */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <h4 className="text-white font-semibold mb-1">{cardData.name}</h4>
          <p className="text-purple-300 text-sm">
            {localReversed ? (
              <span className="text-red-300">🔁 {cardData.reversed}</span>
            ) : (
              <span className="text-green-300">⬆️ {cardData.upright}</span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}
