import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Lock, Calendar, Sparkles, LayoutGrid } from 'lucide-react';

export default function DailyCard() {
  const navigate = useNavigate();
  const [cardRevealed, setCardRevealed] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [alreadyReadToday, setAlreadyReadToday] = useState(false);
  const [lastReadingDate, setLastReadingDate] = useState('');

  const tarotCards = [
    { id: 0, name: 'O Louco', emoji: '🤡', meaning: 'Novos começos, aventura, liberdade e espontaneidade' },
    { id: 1, name: 'O Mago', emoji: '🧙', meaning: 'Manifestação, poder, habilidade e concentração' },
    { id: 2, name: 'A Sacerdotisa', emoji: '🌙', meaning: 'Intuição, mistério, sabedoria interior e o inconsciente' },
    { id: 3, name: 'A Imperatriz', emoji: '👑', meaning: 'Abundância, criatividade, fertilidade e beleza' },
    { id: 4, name: 'O Imperador', emoji: '🏛️', meaning: 'Estrutura, autoridade, estabilidade e controle' },
    { id: 5, name: 'O Hierofante', emoji: '🙏', meaning: 'Tradição, espiritualidade, educação e crenças' },
    { id: 6, name: 'Os Enamorados', emoji: '💞', meaning: 'Amor, união, escolhas importantes e harmonia' },
    { id: 7, name: 'O Carro', emoji: '🏎️', meaning: 'Determinação, progresso, vitória e movimento' },
    { id: 8, name: 'A Força', emoji: '🦁', meaning: 'Coragem, paciência, força interior e compaixão' },
    { id: 9, name: 'O Eremita', emoji: '🧘', meaning: 'Introspecção, busca pela verdade, solidão e reflexão' },
  ];

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('dailyCardDate');
    const storedCardId = localStorage.getItem('dailyCardId');
    
    if (storedDate === today && storedCardId !== null) {
      setAlreadyReadToday(true);
      setLastReadingDate(storedDate);
      const card = tarotCards.find(c => c.id === parseInt(storedCardId));
      if (card) {
        setSelectedCard(card);
        setCardRevealed(true);
      }
    }
  }, []);

  // Lógica de Sorteio Personalizado por Dispositivo
  const generateDailyCard = () => {
    const today = new Date();
    const datePart = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Cria um ID único baseado nas características do navegador/dispositivo
    const userFingerprint = 
      (navigator.userAgent.length) + 
      (screen.height * screen.width) + 
      (navigator.language.length);

    // Soma a data com o ID do dispositivo para o sorteio ser único para aquela pessoa
    const combinedSeed = datePart + userFingerprint;
    
    const randomIndex = Math.floor((combinedSeed * 9301 + 49297) % 233280) % tarotCards.length;
    return tarotCards[randomIndex];
  };

  const revealCard = () => {
    if (alreadyReadToday) return;
    
    const today = new Date().toDateString();
    const dailyCard = generateDailyCard();
    
    setSelectedCard(dailyCard);
    setCardRevealed(true);
    setAlreadyReadToday(true);
    setLastReadingDate(today);
    
    localStorage.setItem('dailyCardDate', today);
    localStorage.setItem('dailyCardId', dailyCard.id.toString());
  };

  const getNextAvailableTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diffMs = tomorrow - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-purple-200 hover:text-white mb-8 p-2 rounded-lg hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-4 bg-amber-400/20 rounded-full mb-4">
            <Sun className="w-12 h-12 text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Carta do Dia
          </h1>
          <p className="text-purple-200 text-lg">
            Sua orientação espiritual única para hoje
          </p>
        </motion.div>

        {alreadyReadToday && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-900/50 to-violet-900/50 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-6 mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-amber-400">Energia Revelada</h3>
            </div>
            <p className="text-purple-200 text-sm mb-4 italic">
              Esta é sua mensagem pessoal para hoje ({lastReadingDate}).
            </p>
            <div className="inline-flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 font-bold text-sm">Nova energia em: {getNextAvailableTime()}</span>
            </div>
          </motion.div>
        )}

        {!cardRevealed && !alreadyReadToday ? (
          <div className="flex justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={revealCard}
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-purple-900 font-bold text-xl px-10 py-7 rounded-full shadow-xl shadow-amber-500/20 transition-all"
            >
              🔮 Revelar Minha Mensagem
            </motion.button>
          </div>
        ) : null}

        {cardRevealed && selectedCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-400/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-amber-400/50 w-72 h-96 flex flex-col items-center justify-center shadow-2xl">
                  <div className="text-7xl mb-6">{selectedCard.emoji}</div>
                  <h3 className="text-2xl font-bold text-white text-center mb-2">
                    {selectedCard.name}
                  </h3>
                  <div className="flex items-center gap-2 text-amber-400">
                    <Sun className="w-4 h-4" />
                    <p className="text-purple-200 text-sm">Guia Pessoal</p>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-amber-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  ✨ Sua Carta
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
              <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2 text-center justify-center">
                <Sparkles className="w-6 h-6" /> Sua Orientação
              </h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-purple-100 text-lg leading-relaxed text-center">
                    A energia de <strong>{selectedCard.name}</strong> foca em {selectedCard.meaning}. 
                    Neste momento, o universo envia essa vibração especificamente para o seu caminho. 
                    No entanto, as influências que moldam seu destino são profundas, e uma única carta mostra apenas o início da jornada...
                  </p>
                </div>

                <div className="bg-purple-950/60 rounded-2xl p-6 border border-amber-400/40 text-center space-y-4">
                  <p className="text-amber-200 font-medium italic">
                    "Deseja ver como essa energia interage com seu passado e futuro?"
                  </p>
                  
                  <button 
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-purple-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
                  >
                    <LayoutGrid className="w-5 h-5" />
                    Fazer Jogo de 3 Cartas
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
