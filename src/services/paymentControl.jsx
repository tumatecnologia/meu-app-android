import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Moon, Heart, Flame, Home as HomeIcon, Eye, Briefcase, Plane, Baby, HeartPulse, Sparkles as SparklesIcon, Lightbulb, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import TarotCardComponent from '../components/tarot/TarotCardComponent';
import PaymentModal from '../components/tarot/PaymentModal';
import InterpretationDisplay from '../components/tarot/InterpretationDisplay';
import { base44 } from '../api/base44Client';
import { createClient } from '@supabase/supabase-js';
import { createWorker } from 'tesseract.js';

const SUPABASE_URL_REST = 'https://npmdvkggsklkideqoriw.supabase.co/rest/v1/ids';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbWR2a2dnc2tsa2lkZXFvcml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzMyMDAsImV4cCI6MjA4NjE0OTIwMH0.y-X0NS-_9BV7RhtSUOteLhaUPnt8Tkf24NlUikR8Ifo';

const supabase = createClient('https://npmdvkggsklkideqoriw.supabase.co', SUPABASE_KEY);

const tarotCardsFileMap = {
  'O Louco': 'o louco',
  'O Mago': 'o mago',
  'A Sacerdotisa': 'a sacerdotisa',
  'A Imperatriz': 'a imperatriz',
  'O Imperador': 'o imperador',
  'O Hierofante': 'o hierofante',
  'Os Enamorados': 'os enamorados',
  'O Carro': 'o carro',
  'A Força': 'a forca',
  'O Eremita': 'o heremita',
  'A Roda da Fortuna': 'a roda da fortuna',
  'A Justiça': 'a justica',
  'O Enforcado': 'o enforcado',
  'A Morte': 'a morte',
  'A Temperança': 'a temperanca',
  'O Diabo': 'o diabo',
  'A Torre': 'a torre',
  'A Estrela': 'a estrela',
  'A Lua': 'a lua',
  'O Sol': 'o sol',
  'O Julgamento': 'o julgamento',
  'O Mundo': 'o mundo'
};

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

const tarotCards = Object.keys(tarotCardsFileMap);

const getCardImagePath = (cardName) => {
  const fileName = tarotCardsFileMap[cardName];
  return `/assets/cartas/${fileName}.jpg`;
};

export const PaymentControlService = {
  processarArquivo: async (file) => {
    try {
      if (!file.type.startsWith('image/')) {
        alert("❌ Formato não aceito! Por favor tire print do comprovante.");
        return { valido: false };
      }
      const reader = new FileReader();
      const imagemData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(imagemData);
      await worker.terminate();
      const textoLimpo = text.toUpperCase();
      const transactionID = textoLimpo.match(/([A-Z0-9]{15,})/)?.[0];
      if (!transactionID) {
        alert("❌ ID não encontrado. Use uma imagem mais clara.");
        return { valido: false };
      }
      const checkResponse = await fetch(`${SUPABASE_URL_REST}?dado=ilike.*${transactionID}*`, {
        method: 'GET',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      const existingRecords = await checkResponse.json();
      if (existingRecords.length > 0) {
        alert("❌ COMPROVANTE JÁ UTILIZADO!");
        return { valido: false };
      }
      const palavrasRecebimento = ["PARA", "BENEFICIÁRIO", "BENEFICIARIO", "DESTINO", "DESTINATÁRIO", "DESTINATARIO", "RECEBEDOR", "FAVORECIDO"];
      const variacoesNome = ["GUSTAVO SANTOS RIBEIRO", "GUSTAVO S. RIBEIRO", "GUSTAVO S RIBEIRO"];
      let nomeValidado = false;
      for (let nome of variacoesNome) {
        if (textoLimpo.includes(nome)) {
          const indexNome = textoLimpo.indexOf(nome);
          const contextoAntes = textoLimpo.substring(Math.max(0, indexNome - 60), indexNome);
          if (palavrasRecebimento.some(palavra => contextoAntes.includes(palavra))) {
            nomeValidado = true;
            break;
          }
        }
      }
      if (!nomeValidado) {
        alert("❌ DESTINATÁRIO INCORRETO!\n\nO comprovante deve mostrar Gustavo Santos Ribeiro como recebedor.");
        return { valido: false };
      }
      const regexValor = /(?:R\$|VALOR|PAGO)?\s?(\d{1,3}(?:\.\d{3})*,\d{2})/i;
      const valorMatch = textoLimpo.match(regexValor);
      let valorComprovante = 0;
      if (valorMatch) {
        valorComprovante = parseFloat(valorMatch[1].replace(/\./g, '').replace(',', '.'));
      }
      if (valorComprovante < 10.00) {
        alert(`❌ VALOR INSUFICIENTE!\n\nValor detectado: R$ ${valorComprovante.toFixed(2)}\nValor mínimo: R$ 10,00`);
        return { valido: false };
      }
      const conteudoParaGravar = `ID: ${transactionID} | VALOR: R$ ${valorComprovante.toFixed(2)} | REGISTRO: ${new Date().toLocaleString('pt-BR')}`;
      const response = await fetch(SUPABASE_URL_REST, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ dado: conteudoParaGravar })
      });
      if (!response.ok) throw new Error("Erro ao gravar");
      alert("✅ SUCESSO! Pagamento validado.");
      return { valido: true, idEncontrado: transactionID };
    } catch (error) {
      console.error("Erro Final:", error);
      alert("❌ Falha no processamento.");
      return { valido: false };
    }
  }
};

const ConsultasParticulares = () => (
  <div className="mt-20 relative bg-gradient-to-br from-amber-500/20 via-purple-900/60 to-violet-900/60 backdrop-blur-md border-2 border-amber-400/50 rounded-[2.5rem] p-10 max-w-4xl mx-auto shadow-2xl text-center">
    <div className="absolute top-4 left-4 text-amber-400/30 text-2xl">✨</div>
    <div className="absolute top-4 right-4 text-amber-400/30 text-2xl">✨</div>
    <div className="text-5xl mb-6">🔮</div>
    <h3 className="text-3xl font-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent mb-4 uppercase tracking-tighter">Consultas Particulares</h3>
    <p className="text-purple-100 text-lg mb-8 leading-relaxed font-medium">Deseja uma tiragem personalizada e profunda? Agende sua consulta diretamente pelo WhatsApp!</p>
    <a href="https://wa.me/5512996764694" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-purple-950 px-12 py-5 rounded-full font-black text-xl shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:scale-105 transition-all uppercase tracking-tight">
      <MessageSquare className="w-8 h-8" /> WhatsApp
    </a>
  </div>
);

export default function ThreeCardsReading() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [personInfo, setPersonInfo] = useState(null);
  const [reading, setReading] = useState(null);
  const [revealedCards, setRevealedCards] = useState([false, false, false]);
  const [generating, setGenerating] = useState(false);
  const [birthDate, setBirthDate] = useState('');

  const handleDateChange = (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5);
    setBirthDate(v.slice(0, 10));
  };

  const handlePaymentConfirmed = async (paymentData) => {
    setShowPayment(false);
    setGenerating(true);
    try {
      const selectedCards = [];
      const usedIndices = new Set();
      while (selectedCards.length < 3) {
        const index = Math.floor(Math.random() * tarotCards.length);
        if (!usedIndices.has(index)) {
          usedIndices.add(index);
          selectedCards.push({
            card_name: tarotCards[index],
            position: ['Passado', 'Presente', 'Futuro'][selectedCards.length],
            reversed: Math.random() > 0.5
          });
        }
      }
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Leitura de tarô para ${personInfo.name}. Pergunta: ${personInfo.question}. Tema: ${selectedTheme}`
      });
      const newReading = await base44.entities.Reading.create({
        type: 'three_cards',
        person_name: personInfo.name,
        birth_date: personInfo.birthDate,
        theme: selectedTheme,
        cards: selectedCards,
        interpretation: response.content
      });
      setReading(newReading);
      setTimeout(() => setRevealedCards([true, true, true]), 1000);
    } catch (e) {
      console.error("Erro na leitura:", e);
      alert("Erro ao consultar o oráculo.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 py-8 px-4 font-sans text-white">
      <div className="container mx-auto max-w-6xl">
        <Link to="/"><Button variant="ghost" className="text-purple-200 mb-8"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button></Link>
        {!reading && !generating && !showForm && !showPayment && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-12 text-white">Selecione o seu Tema</h1>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {themes.map((t) => (
                <button key={t.id} onClick={() => { setSelectedTheme(t.id); setShowForm(true); }} className={`bg-gradient-to-br ${t.color} p-6 rounded-3xl shadow-xl hover:scale-105 transition-all`}>
                  <t.icon className="w-8 h-8 mx-auto mb-2 text-white" />
                  <p className="font-bold text-white">{t.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">Seus Dados</h2>
            <form onSubmit={(e) => { e.preventDefault(); const d = new FormData(e.target); setPersonInfo({ name: d.get('name'), birthDate, question: d.get('question') }); setShowForm(false); setShowPayment(true); }} className="space-y-4">
              <input name="name" required placeholder="Nome Completo" className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white outline-none focus:border-purple-500" />
              <input value={birthDate} onChange={handleDateChange} required placeholder="Nascimento (DD/MM/AAAA)" className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white outline-none focus:border-purple-500" />
              <textarea name="question" required placeholder="Sua pergunta..." className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white outline-none focus:border-purple-500 h-32" />
              <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all">CONTINUAR</button>
            </form>
          </motion.div>
        )}
        {generating && <div className="text-center py-20 animate-pulse text-2xl font-bold">🔮 Consultando o Oráculo...</div>}
        {reading && (
          <div className="space-y-12">
            <div className="flex flex-wrap justify-center gap-8">
              {reading.cards.map((c, i) => (
                <TarotCardComponent key={i} card={{ name: c.card_name, image: getCardImagePath(c.card_name) }} reversed={c.reversed} revealed={revealedCards[i]} onReveal={() => {}} position={c.position} autoReveal={true} />
              ))}
            </div>
            {revealedCards.every(r => r) && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md max-w-4xl mx-auto mb-12">
                <InterpretationDisplay interpretation={reading.interpretation} cards={reading.cards} theme={selectedTheme} personName={reading.person_name} birthDate={reading.birth_date} />
              </div>
            )}
            <div className="text-center"><button onClick={() => window.location.reload()} className="bg-white/10 text-white px-8 py-3 rounded-full hover:bg-white/20 transition-all">Nova Consulta</button></div>
          </div>
        )}
        {!generating && <ConsultasParticulares />}
        {showPayment && <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} onPaymentConfirmed={handlePaymentConfirmed} theme={selectedTheme} />}
      </div>
    </div>
  );
}