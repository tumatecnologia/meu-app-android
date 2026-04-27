import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Lock, Sparkles, LayoutGrid, MessageSquare } from 'lucide-react';
import TarotCardComponent from '../components/tarot/TarotCardComponent';

export default function DailyCard() {
  const navigate = useNavigate();
  const [cardRevealed, setCardRevealed] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [alreadyReadToday, setAlreadyReadToday] = useState(false);
  const [lastReadingDate, setLastReadingDate] = useState('');

  const tarotCards = [
    { id: 0, name: 'O Louco', meaning: 'novos começos, aventura, liberdade e espontaneidade' },
    { id: 1, name: 'O Mago', meaning: 'manifestação, poder, habilidade e concentração' },
    { id: 2, name: 'A Sacerdotisa', meaning: 'intuição, mistério, sabedoria interior e o inconsciente' },
    { id: 3, name: 'A Imperatriz', meaning: 'abundância, criatividade, fertilidade e beleza' },
    { id: 4, name: 'O Imperador', meaning: 'estrutura, autoridade, estabilidade e controle' },
    { id: 5, name: 'O Hierofante', meaning: 'tradição, espiritualidade, educação e crenças' },
    { id: 6, name: 'Os Enamorados', meaning: 'amor, união, escolhas importantes e harmonia' },
    { id: 7, name: 'O Carro', meaning: 'determinação, progresso, vitória e movimento' },
    { id: 8, name: 'A Força', meaning: 'coragem, paciência, força interior e compaixão' },
    { id: 9, name: 'O Eremita', meaning: 'introspecção, busca pela verdade, solidão e reflexão' },
    { id: 10, name: 'A Roda da Fortuna', meaning: 'mudança, ciclos, destino e reviravoltas' },
    { id: 11, name: 'A Justiça', meaning: 'equilíbrio, justiça, verdade e causa e efeito' },
    { id: 12, name: 'O Enforcado', meaning: 'pausa, rendição, nova perspectiva e sacrifício' },
    { id: 13, name: 'A Morte', meaning: 'fim, transformação, transição e novos começos' },
    { id: 14, name: 'A Temperança', meaning: 'paciência, moderação, equilíbrio e propósito' },
    { id: 15, name: 'O Diabo', meaning: 'vício, materialismo, tentação e desapego' },
    { id: 16, name: 'A Torre', meaning: 'mudança repentina, caos, revelação e despertar' },
    { id: 17, name: 'A Estrela', meaning: 'esperança, fé, rejuvenescimento e espiritualidade' },
    { id: 18, name: 'A Lua', meaning: 'ilusão, medo, ansiedade e subconsciente' },
    { id: 19, name: 'O Sol', meaning: 'positividade, diversão, calor e sucesso' },
    { id: 20, name: 'O Julgamento', meaning: 'redenção, julgamento, renascimento e chamado interno' },
    { id: 21, name: 'O Mundo', meaning: 'conclusão, integração, realização e viagem' }
  ];

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('dailyCardDate');
    const storedCardId = localStorage.getItem('dailyCardId');
    
    if (storedDate === today && storedCardId !== null) {
      setAlreadyReadToday(true);
      setLastReadingDate(today);
      const card = tarotCards.find(c => c.id === parseInt(storedCardId));
      if (card) {
        setSelectedCard(card);
        setCardRevealed(true);
      }
    }
  }, []);

  const generateDailyCard = () => {
    const today = new Date();
    const datePart = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const userFingerprint = (navigator.userAgent.length) + (screen.height * screen.width) + (navigator.language.length);
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
    localStorage.setItem('dailyCardDate', today);
    localStorage.setItem('dailyCardId', dailyCard.id.toString());
  };

  const getNextAvailableTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diffMs = tomorrow - now;
    const h = Math.floor(diffMs / (1000 * 60 * 60));
    const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}h ${m}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 py-8 px-4 font-sans text-white relative">
      <div className="container mx-auto max-w-4xl">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-purple-200 hover:text-white mb-8 p-2 rounded-lg hover:bg-white/10 transition-all font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-block p-4 bg-amber-400/20 rounded-full mb-4">
            <Sun className="w-12 h-12 text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">Carta do Dia</h1>
          <p className="text-purple-200 text-lg font-medium">Sua orientação espiritual única para hoje</p>
        </motion.div>

        {alreadyReadToday && (
          <div className="flex justify-center mb-6">
             <div className="inline-flex items-center gap-2 bg-black/40 px-5 py-2 rounded-full border border-amber-400/30 shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 font-bold text-sm">Renovação em: {getNextAvailableTime()}</span>
            </div>
          </div>
        )}

        {!cardRevealed ? (
          <div className="flex justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={revealCard}
              className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-purple-950 font-black text-xl px-12 py-6 rounded-full shadow-[0_0_40px_rgba(251,191,36,0.3)] transition-all uppercase tracking-tight"
            >
              🔮 Revelar Minha Mensagem
            </motion.button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
            
            {/* AJUSTE FEITO AQUI: Mudei my-10 para mt-16 mb-10 para dar espaço superior */}
            <div className="flex justify-center scale-110 md:scale-125 mt-16 mb-10">
              <TarotCardComponent 
                card={{ name: selectedCard?.name || '' }} 
                reversed={false} 
                revealed={true} 
                onReveal={() => {}} 
                position="Sua Energia" 
                autoReveal={true} 
              />
            </div>

            <div className="bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />
              <h2 className="text-3xl font-black text-amber-400 mb-6 text-center uppercase tracking-tighter tracking-tight">Sua Orientação</h2>
              <div className="space-y-8">
                <p className="text-purple-50 text-xl leading-relaxed text-center font-medium italic">
                  "A energia de <strong>{selectedCard?.name}</strong> foca em {selectedCard?.meaning}. 
                  Esta vibração foi atraída especificamente para você hoje."
                </p>
                <div className="bg-purple-950/80 rounded-3xl p-8 border border-amber-400/30 text-center space-y-5">
                  <p className="text-amber-200 font-bold uppercase text-sm tracking-widest">Aprofunde sua consulta</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 text-purple-950 font-black py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-xl uppercase text-sm"
                  >
                    <LayoutGrid className="w-5 h-5" />
                    Fazer Jogo de 3 Cartas
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-20 relative bg-gradient-to-br from-amber-500/20 via-purple-900/60 to-violet-900/60 backdrop-blur-md border-2 border-amber-400/50 rounded-[2.5rem] p-10 max-w-4xl mx-auto shadow-2xl text-center">
          <div className="text-5xl mb-6">🔮</div>
          <h3 className="text-3xl font-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent mb-4 uppercase tracking-tighter text-white">Consultas Particulares</h3>
          <p className="text-purple-100 text-lg mb-8 leading-relaxed font-medium">Agende sua consulta diretamente pelo WhatsApp!</p>
          <a href="https://wa.me/5512996764694" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-purple-950 px-12 py-5 rounded-full font-black text-xl shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:scale-105 transition-all uppercase tracking-tight">
            <MessageSquare className="w-8 h-8" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
