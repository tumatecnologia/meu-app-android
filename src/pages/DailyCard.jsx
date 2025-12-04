import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Lock, Calendar, Sparkles } from 'lucide-react';

export default function DailyCard() {
  const navigate = useNavigate();
  const [cardRevealed, setCardRevealed] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [alreadyReadToday, setAlreadyReadToday] = useState(false);
  const [lastReadingDate, setLastReadingDate] = useState('');

  const tarotCards = [
    { id: 0, name: 'O Louco', emoji: '🤡', meaning: 'Novos começos, aventura, liberdade, espontaneidade' },
    { id: 1, name: 'O Mago', emoji: '🧙', meaning: 'Manifestação, poder, habilidade, concentração' },
    { id: 2, name: 'A Sacerdotisa', emoji: '🌙', meaning: 'Intuição, mistério, sabedoria interior, inconsciente' },
    { id: 3, name: 'A Imperatriz', emoji: '👑', meaning: 'Abundância, criatividade, fertilidade, beleza' },
    { id: 4, name: 'O Imperador', emoji: '🏛️', meaning: 'Estrutura, autoridade, estabilidade, controle' },
    { id: 5, name: 'O Hierofante', emoji: '🙏', meaning: 'Tradição, espiritualidade, educação, crenças' },
    { id: 6, name: 'Os Enamorados', emoji: '💞', meaning: 'Amor, união, escolhas, harmonia' },
    { id: 7, name: 'O Carro', emoji: '🏎️', meaning: 'Determinação, progresso, vitória, movimento' },
    { id: 8, name: 'A Força', emoji: '🦁', meaning: 'Coragem, paciência, força interior, compaixão' },
    { id: 9, name: 'O Eremita', emoji: '🧘', meaning: 'Introspecção, sabedoria, solidão, reflexão' },
  ];

  // Verificar se já leu hoje
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

  // Gerar carta do dia (consistente por dia)
  const generateDailyCard = () => {
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Usar a data como seed para gerar carta consistente por dia
    const randomIndex = Math.floor((dateSeed * 9301 + 49297) % 233280) % tarotCards.length;
    
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
    
    // Salvar no localStorage
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
        {/* Botão Voltar */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-purple-200 hover:text-white mb-8 p-2 rounded-lg hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>

        {/* Cabeçalho */}
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
            Descubra a mensagem do universo para você hoje
          </p>
        </motion.div>

        {/* Mensagem se já leu hoje */}
        {alreadyReadToday && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-900/50 to-violet-900/50 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold text-amber-400">
                Você já consultou sua carta hoje
              </h3>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-purple-200 mb-4">
              <Calendar className="w-4 h-4" />
              <span>Última consulta: {lastReadingDate}</span>
            </div>
            
            <div className="text-center">
              <p className="text-purple-300 mb-2">
                ⏳ Nova carta disponível em:
              </p>
              <div className="inline-flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 font-bold">{getNextAvailableTime()}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Botão para revelar carta */}
        {!cardRevealed && !alreadyReadToday ? (
          <div className="flex justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={revealCard}
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-purple-900 font-bold text-xl px-10 py-7 rounded-full shadow-xl shadow-amber-500/20 transition-all"
            >
              🔮 Revelar Minha Carta do Dia
            </motion.button>
          </div>
        ) : null}

        {/* Carta revelada */}
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
                    <p className="text-purple-200 text-sm">
                      Carta do Dia
                    </p>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-amber-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                  🎯 Hoje
                </div>
              </div>
            </div>

            {/* Interpretação */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
              <h2 className="text-2xl font-bold text-amber-400 mb-6">
                ✨ Mensagem de {selectedCard.name}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Significado Principal:
                  </h3>
                  <p className="text-purple-100">
                    {selectedCard.meaning}. Esta carta traz uma energia especial para seu dia.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    💖 Amor e Relacionamentos:
                  </h3>
                  <p className="text-purple-100">
                    Esteja aberto(a) a conexões significativas. Ouça seu coração em questões emocionais.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    💼 Trabalho e Carreira:
                  </h3>
                  <p className="text-purple-100">
                    Um bom dia para projetos criativos. Confie em sua intuição para decisões profissionais.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    🔮 Conselho do Dia:
                  </h3>
                  <p className="text-purple-100 italic">
                    "Confie no fluxo do universo. Pequenos sinais guiarão seu caminho hoje."
                  </p>
                </div>

                {/* Informação de limite diário */}
                <div className="mt-8 pt-6 border-t border-purple-400/20">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Lock className="w-4 h-4" />
                    <p className="text-sm">
                      ⚠️ Esta é sua única leitura gratuita do dia. Volte amanhã para uma nova mensagem!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Seção de Contato */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="relative bg-gradient-to-br from-amber-500/20 via-purple-900/60 to-violet-900/60 backdrop-blur-md border-2 border-amber-400/50 rounded-3xl p-10 max-w-3xl mx-auto shadow-2xl overflow-hidden">
            <div className="absolute top-4 left-4 text-amber-400/30 text-2xl">✨</div>
            <div className="absolute top-4 right-4 text-amber-400/30 text-2xl">✨</div>
            
            <motion.div 
              className="mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-6xl drop-shadow-lg">🔮</span>
            </motion.div>
            
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent mb-4">
              Consultas Particulares
            </h3>
            <h4 className="text-xl text-purple-200 font-semibold mb-6">
              por Vídeo Chamada
            </h4>
            
            <div className="bg-black/30 rounded-2xl p-6 mb-6 border border-amber-400/30">
              <p className="text-purple-100 text-lg leading-relaxed mb-3">
                Deseja uma leitura mais profunda e personalizada?
              </p>
              <p className="text-amber-300 font-medium">
                Conecte-se diretamente com nossos especialistas!
              </p>
            </div>
            
            <a 
              href="https://wa.me/5512996764694?text=Gostaria%20de%20saber%20mais%20sobre%20a%20consulta%20particular%20por%20video%20chamada"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-10 py-5 rounded-full transition-all text-xl shadow-2xl hover:shadow-green-500/50 hover:scale-105 transform"
            >
              <span className="text-2xl">💬</span>
              <div className="text-left">
                <div className="text-sm opacity-90">WhatsApp</div>
                <div>12 99676-4694</div>
              </div>
            </a>
            
            <div className="mt-6 pt-6 border-t border-amber-400/30">
              <p className="text-amber-200 font-bold text-lg mb-2">
                ✨ Com Tuma ou Oráculo ✨
              </p>
              <p className="text-purple-300 text-sm italic">
                Especialistas em Tarô e Leituras Místicas
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
