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

  const cardData = card || { name: 'Carta', number: '?', image: '0', upright: '...', reversed: '...' };

  return (
    <div className="relative w-full max-w-xs mx-auto">
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

      <div 
        className={`relative w-48 h-72 mx-auto ${!isRevealed && !autoReveal ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={isFlipping ? { rotateY: 90 } : { rotateY: 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {!isRevealed ? (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-800 to-violet-900 rounded-2xl border-4 border-amber-400/50 flex flex-col items-center justify-center p-4">
              <div className="text-amber-400 text-5xl mb-4">🔮</div>
              <p className="text-white text-xs uppercase tracking-widest">Tarot Tuma</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 w-full h-full bg-white rounded-2xl border-4 border-amber-600 shadow-2xl overflow-hidden"
            >
              {/* IMAGEM DA CARTA AQUI */}
              <img 
                src={`/cards/${cardData.image}.jpg`} 
                alt={cardData.name}
                className={`w-full h-full object-cover ${localReversed ? 'rotate-180' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-white font-bold text-sm drop-shadow-lg">{cardData.name}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {isRevealed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
          <p className="text-purple-300 text-sm italic">
            {localReversed ? cardData.reversed : cardData.upright}
          </p>
        </motion.div>
      )}
    </div>
  );
}
