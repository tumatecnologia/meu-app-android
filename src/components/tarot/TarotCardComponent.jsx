import React from 'react';
import { motion } from 'framer-motion';

const TarotCardComponent = ({ card, isReversed, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-gradient-to-br from-purple-800/40 to-violet-800/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 text-center h-full flex flex-col justify-between">
        <h3 className="text-xl font-bold text-white mb-2">{card.name}</h3>
        <div className="text-sm text-purple-200 italic mb-4">
          {isReversed ? 'Invertida' : 'Direta'}
        </div>
        <div className="text-purple-300 text-xs">
          {isReversed ? card.reversedMeaning : card.uprightMeaning}
        </div>
      </div>
    </motion.div>
  );
};

export default TarotCardComponent;
