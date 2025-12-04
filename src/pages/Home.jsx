import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Sun, Moon, Sparkles, History } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFMwIDguMDYgMCAxOHM4LjA2IDE4IDE4IDE4IDE4LTguMDYgMTgtMTh6IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMC4zIiBvcGFjaXR5PSIwLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-16 h-16 text-amber-400" />
            </motion.div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-300 to-amber-400 mb-4">
            Oráculo Místico
          </h1>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Desvende os segredos do seu destino através das cartas sagradas do tarô
          </p>
        </motion.div>

        {/* Main cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
          {/* Daily Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to={createPageUrl('DailyCard')}>
              <div className="group h-full bg-gradient-to-br from-amber-400/10 to-orange-500/10 backdrop-blur-sm border-2 border-amber-400/30 rounded-2xl p-8 hover:border-amber-400 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer">
                <div className="flex flex-col items-center text-center h-full justify-between">
                  <div>
                    <div className="inline-block p-4 bg-amber-400/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Sun className="w-12 h-12 text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Carta do Dia</h2>
                    <p className="text-purple-200 mb-6">
                      Receba uma mensagem diária do universo para guiar seu caminho
                    </p>
                  </div>
                  <div className="space-y-2 w-full">
                    <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-semibold">GRÁTIS</span>
                    </div>
                    <p className="text-sm text-purple-300">Uma vez por dia</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Three Cards Reading */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to={createPageUrl('ThreeCardsReading')}>
              <div className="group h-full bg-gradient-to-br from-purple-500/10 to-violet-600/10 backdrop-blur-sm border-2 border-purple-400/30 rounded-2xl p-8 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer">
                <div className="flex flex-col items-center text-center h-full justify-between">
                  <div>
                    <div className="inline-block p-4 bg-purple-400/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Moon className="w-12 h-12 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Leitura de 3 Cartas</h2>
                    <p className="text-purple-200 mb-6">
                      Aprofunde-se em temas específicos com uma leitura completa e personalizada
                    </p>
                  </div>
                  <div className="space-y-2 w-full">
                    <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-400 font-semibold">R$ 10,00</span>
                    </div>
                    <p className="text-sm text-purple-300">Pagamento via PIX</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* History button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link to={createPageUrl('ReadingHistory')}>
            <Button 
              variant="outline" 
              className="bg-white/5 border-purple-400/30 text-purple-200 hover:bg-white/10 hover:text-white hover:border-purple-400"
            >
              <History className="w-4 h-4 mr-2" />
              Ver Histórico de Leituras
            </Button>
          </Link>
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-purple-300 text-sm max-w-xl mx-auto">
            ✨ Todas as leituras são interpretadas com sabedoria ancestral e conexão espiritual ✨
          </p>
        </motion.div>

        {/* Contact Section on Home */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <div className="relative bg-gradient-to-br from-amber-500/20 via-purple-900/60 to-violet-900/60 backdrop-blur-md border-2 border-amber-400/50 rounded-3xl p-10 max-w-3xl mx-auto shadow-2xl overflow-hidden">
            <div className="absolute top-4 left-4 text-amber-400/30 text-2xl">✨</div>
            <div className="absolute top-4 right-4 text-amber-400/30 text-2xl">✨</div>
            <div className="absolute bottom-4 left-8 text-purple-400/30 text-xl">⭐</div>
            <div className="absolute bottom-4 right-8 text-purple-400/30 text-xl">⭐</div>
            
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