import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Briefcase, 
  DollarSign,
  HeartPulse,
  Users,
  Plane,
  Bell,
  MessageCircle,
  Scale,
  Home
} from 'lucide-react';
import TarotForm from '../components/tarot/TarotForm';
import TarotReading from '../components/tarot/TarotReading';
import PaymentModal from '../components/tarot/PaymentModal';

const ThreeCardsReading = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('form');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const [userData, setUserData] = useState(null);

  const themes = [
    { id: 'amor', name: 'Amor', icon: Heart, color: 'from-pink-500 to-rose-600' },
    { id: 'carreira', name: 'Carreira', icon: Briefcase, color: 'from-blue-500 to-cyan-600' },
    { id: 'financas', name: 'Finanças', icon: DollarSign, color: 'from-emerald-500 to-green-600' },
    { id: 'espiritualidade', name: 'Espiritualidade', icon: Sparkles, color: 'from-purple-500 to-violet-600' },
    { id: 'saude', name: 'Saúde', icon: HeartPulse, color: 'from-teal-500 to-emerald-600' },
    { id: 'traicao', name: 'Traição', icon: Users, color: 'from-red-500 to-pink-600' },
    { id: 'casamento', name: 'Casamento', icon: Heart, color: 'from-pink-600 to-rose-700' },
    { id: 'viagem', name: 'Viagem', icon: Plane, color: 'from-sky-500 to-blue-600' },
    { id: 'noivado', name: 'Noivado', icon: Bell, color: 'from-amber-500 to-yellow-600' },
    { id: 'conselho', name: 'Conselho', icon: MessageCircle, color: 'from-indigo-500 to-purple-600' },
    { id: 'justica', name: 'Justiça', icon: Scale, color: 'from-gray-500 to-slate-600' }
  ];

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };

  const handleFormSubmit = (data) => {
    setUserData(data);
    setStep('payment');
  };

  const handlePaymentConfirmed = (id) => {
    setPaymentId(id);
    setStep('reading');
  };

  const handleBackToHome = () => {
    setStep('form');
    setSelectedTheme('');
    setUserData(null);
    setPaymentId(null);
  };

  const handleBackToAppHome = () => {
    navigate('/');
  };

  const handleNewReading = () => {
    setStep('form');
    setSelectedTheme('');
    setPaymentId(null);
    setUserData(null);
  };

  const currentTheme = themes.find(t => t.id === selectedTheme);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 p-4 md:p-8">
      <button
        onClick={handleBackToAppHome}
        className="absolute top-4 left-4 flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
      >
        <Home className="w-5 h-5" />
        <span>Voltar para Home</span>
      </button>

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 md:mb-12 pt-8">
          <div className="inline-block p-3 bg-amber-400/20 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300">
            Leitura de 3 Cartas
          </h1>
          
          <p className="text-purple-300 text-sm md:text-base">
            {step === 'form' && 'Escolha um tema para sua consulta personalizada'}
            {step === 'payment' && 'Complete o pagamento para receber sua leitura'}
            {step === 'reading' && 'Sua leitura personalizada está pronta!'}
          </p>
        </header>

        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8"
          >
            <TarotForm 
              themes={themes}
              selectedTheme={selectedTheme}
              onThemeSelect={handleThemeSelect}
              onFormSubmit={handleFormSubmit}
              onBack={handleBackToAppHome}
            />
          </motion.div>
        )}

        {step === 'payment' && userData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <PaymentModal
              isOpen={step === 'payment'}
              onClose={() => setStep('form')}
              onPaymentConfirmed={handlePaymentConfirmed}
              onBackToHome={handleBackToHome}
              theme={selectedTheme}
            />
          </motion.div>
        )}

        {step === 'reading' && paymentId && userData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <TarotReading 
              paymentId={paymentId}
              theme={selectedTheme}
              userData={userData}
              onNewReading={handleNewReading}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ThreeCardsReading;
