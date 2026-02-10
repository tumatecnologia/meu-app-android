import "./TarotCard.css";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TarotCardComponent({ card, reversed = false, position, index = 0 }) {
  const cardData = card || { id: 'default', name: 'Carta', number: '?', upright: '...', reversed: '...' };
  
  // Mapeamento de emojis únicos por carta
  const cardEmojis = {
    'o-louco': '🤡', 'o-mago': '🧙‍♂️', 'a-sacerdotisa': '🧕', 'a-imperatriz': '👸',
    'o-imperador': '🤴', 'o-hierofante': '👨‍⚖️', 'os-enamorados': '👩‍❤️‍👨', 'o-carro': '🏎️',
    'a-justica': '⚖️', 'o-eremita': '👴', 'a-roda-da-fortuna': '🎡', 'a-forca': '🦁',
    'o-enforcado': '🧘‍♂️', 'a-morte': '💀', 'a-temperanca': '😇', 'o-diabo': '😈',
    'a-torre': '🗼', 'a-estrela': '🌟', 'a-lua': '🌙', 'o-sol': '☀️',
    'o-julgamento': '🎺', 'o-mundo': '🌍'
  };

  const emoji = cardEmojis[cardData.id] || '🃏';

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

      <div className="relative w-48 h-72 mx-auto">
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRENTE DA CARTA (Lógica 3D) */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl border-4 border-amber-600 shadow-2xl flex flex-col items-center justify-center p-4">
            
            {/* Indicador de Invertida */}
            {reversed && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                🔄 Invertida
              </div>
            )}
            
            {/* Número e Nome */}
            <div className="text-sm font-bold text-amber-800 absolute top-3 left-3">
              {cardData.number}
            </div>
            
            <h3 className="text-lg font-bold text-amber-900 mt-6 mb-1 text-center">
              {cardData.name}
            </h3>
            
            {/* EMOJI ÚNICO DA CARTA */}
            <div className="text-6xl mb-2">{emoji}</div>
            
            {/* Significado breve */}
            <div className="absolute bottom-3 left-3 right-3 text-center">
              <p className="text-xs text-amber-800 font-medium line-clamp-2">
                {reversed ? cardData.reversed : cardData.upright}
              </p>
            </div>
            
            {/* Rotação se invertida */}
            <div className={`absolute inset-0 ${reversed ? 'rotate-180' : ''}`} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
