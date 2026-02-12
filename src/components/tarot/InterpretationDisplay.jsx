import React from 'react';
import ReactMarkdown from 'react-markdown';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ cards, theme, personName, birthDate, question }) {
  if (!cards || cards.length === 0) return null;

  const getCardInterpretation = (card) => {
    const cardData = tarotDeck[card.id];
    if (!cardData) return "Texto não encontrado no banco de dados.";
    
    // Normalização rigorosa do tema
    const activeTheme = theme 
      ? theme.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
      : 'conselho';
    
    // Tenta buscar: 1. Tema específico (ex: trabalho) | 2. Upright (texto padrão) | 3. Significado geral
    return cardData.temas?.[activeTheme] || cardData.upright || cardData.meaning || "Aguardando revelação...";
  };

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto mb-20 space-y-8 animate-fadeIn">
      
      {/* 1. DADOS DA CONSULTA */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl border-l-8 border-purple-600">
        <h2 className="text-xl font-black text-gray-900 uppercase mb-4 tracking-tight">Dados da Consulta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-gray-800">
          <p><strong className="text-purple-700 font-bold uppercase text-xs block">Consulente:</strong> {personName || 'Não informado'}</p>
          <p><strong className="text-purple-700 font-bold uppercase text-xs block">Nascimento:</strong> {birthDate || 'Não informada'}</p>
          <p><strong className="text-purple-700 font-bold uppercase text-xs block">Tema Selecionado:</strong> {theme || 'Geral'}</p>
          <p className="md:col-span-2 bg-purple-50 p-3 rounded-lg border border-purple-100">
            <strong className="text-purple-700 font-bold uppercase text-xs block mb-1">Sua Pergunta:</strong> 
            <span className="text-lg italic text-gray-700">"{question || 'Vou conseguir um emprego?'}"</span>
          </p>
        </div>
      </div>

      {/* 2. ANÁLISE INDIVIDUAL DAS 3 CARTAS */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-t-8 border-amber-400">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 uppercase">Análise do Oráculo</h2>
          <div className="h-1.5 w-20 bg-amber-400 mx-auto rounded-full mt-4"></div>
        </div>
        
        <div className="space-y-12">
          {cards.map((card, index) => (
            <div key={index} className="prose prose-xl max-w-none text-gray-900 leading-relaxed border-b border-gray-100 pb-8 last:border-0">
              <h3 className="text-amber-600 font-bold uppercase text-sm mb-2 tracking-widest flex items-center gap-2">
                <span className="bg-amber-100 px-2 py-0.5 rounded text-amber-800">
                  {index === 0 ? "PASSO 1: O PASSADO" : index === 1 ? "PASSO 2: O PRESENTE" : "PASSO 3: O FUTURO"}
                </span>
                — {card.name}
              </h3>
              <div className="text-gray-800 font-medium">
                <ReactMarkdown>{getCardInterpretation(card)}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CONCLUSÃO FINAL PERSONALIZADA */}
      <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl text-white border-b-8 border-amber-500">
        <h2 className="text-2xl font-black uppercase mb-6 text-amber-400 text-center tracking-tighter">Conclusão para sua Pergunta</h2>
        <div className="prose prose-invert prose-lg max-w-none text-gray-200 text-center italic leading-relaxed">
           Para a sua pergunta: <span className="text-amber-300">"{question || 'Vou conseguir um emprego?'}"</span>, 
           a carta central <span className="text-amber-300">{cards[1]?.name}</span> indica que as energias de <strong>{theme || 'trabalho'}</strong> estão em movimento. 
           O conselho final é manter a clareza e agir conforme a sabedoria do futuro apresentada.
        </div>
      </div>
    </div>
  );
}