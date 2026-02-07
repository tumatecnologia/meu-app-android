import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Moon, Heart, Flame, Home as HomeIcon, Eye, Briefcase, Plane, Baby, HeartPulse, Sparkles as SparklesIcon, Lightbulb } from 'lucide-react';
import { Button } from '../components/ui/button';
import PaymentModal from '../components/tarot/PaymentModal';
import TarotReading from '../components/tarot/TarotReading';
import BirthDateInput from '../components/BirthDateInput';

const themes = [
  { id: 'amor', label: 'Amor', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'sexo', label: 'Sexo', icon: Flame, color: 'from-red-500 to-orange-500' },
  { id: 'casamento', label: 'Casamento', icon: HomeIcon, color: 'from-purple-500 to-pink-500' },
  { id: 'traicao', label: 'Traição', icon: Eye, color: 'from-slate-600 to-slate-800' },
  { id: 'trabalho', label: 'Trabalho', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
  { id: 'viagem', label: 'Viagem', icon: Plane, color: 'from-sky-500 to-blue-500' },
  { id: 'gravidez', label: 'Gravidez', icon: Baby, color: 'from-green-400 to-emerald-500' },
  { id: 'saude', label: 'Saúde', icon: HeartPulse, color: 'from-green-500 to-teal-500' },
  { id: 'espiritualidade', label: 'Espiritualidade', icon: SparklesIcon, color: 'from-violet-500 to-purple-500' },
  { id: 'conselho', label: 'Conselho', icon: Lightbulb, color: 'from-amber-500 to-yellow-500' }
];

export default function ThreeCardsReading() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isReadingReady, setIsReadingReady] = useState(false);
  const [birthDate, setBirthDate] = useState("");

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setUserData({
      name: new FormData(e.target).get('name'),
      birthDate: birthDate,
      question: new FormData(e.target).get('question')
    });
    setShowForm(false);
    setShowPayment(true);
  };

  const handlePaymentConfirmed = () => {
    setShowPayment(false);
    setIsReadingReady(true);
  };

  const handleNewReading = () => {
    setIsReadingReady(false);
    setSelectedTheme(null);
    setUserData(null);
    setShowForm(false);
    setBirthDate("");
  };

  const getTheme = () => themes.find(t => t.id === selectedTheme) || themes[0];

  if (isReadingReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 py-8 px-4">
        <TarotReading theme={selectedTheme} userData={userData} onNewReading={handleNewReading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 py-8 px-4 text-white">
      <div className="container mx-auto max-w-6xl">
        <Link to="/"><Button variant="ghost" className="text-purple-200 hover:text-white mb-8"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button></Link>
        {!showForm && !showPayment && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {themes.map((theme) => (
              <button key={theme.id} onClick={() => handleThemeSelect(theme.id)} className="group relative transition-all hover:scale-105">
                <div className={`bg-gradient-to-br ${theme.color} p-6 rounded-2xl shadow-xl`}>
                  <theme.icon className="w-8 h-8 text-white mx-auto mb-3" />
                  <p className="text-white font-semibold text-center">{theme.label}</p>
                </div>
              </button>
            ))}
          </div>
        )}
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur-sm border-2 border-purple-400/30 rounded-2xl p-8 max-w-md mx-auto shadow-2xl text-center">
            <h3 className="text-2xl font-bold mb-6">Dados da Consulta</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input name="name" placeholder="Seu Nome Completo" required className="w-full bg-white/10 border border-purple-400/30 text-white rounded-lg px-4 py-3 outline-none focus:border-amber-400 placeholder-white/50" />
              <BirthDateInput value={birthDate} onChange={setBirthDate} />
              <textarea name="question" placeholder="Sua dúvida para as cartas..." required className="w-full bg-white/10 border border-purple-400/30 text-white rounded-lg px-4 py-3 outline-none focus:border-amber-400 min-h-[100px] placeholder-white/50" />
              <button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-purple-900 font-bold py-4 rounded-lg shadow-xl">✨ Continuar</button>
              <button type="button" onClick={() => setShowForm(false)} className="w-full text-purple-300 text-sm mt-4">Voltar</button>
            </form>
          </motion.div>
        )}
        {showPayment && (
          <PaymentModal 
            isOpen={showPayment} 
            onClose={() => setShowPayment(false)} 
            onPaymentConfirmed={handlePaymentConfirmed} 
            theme={getTheme().label} 
          />
        )}
      </div>
    </div>
  );
}
