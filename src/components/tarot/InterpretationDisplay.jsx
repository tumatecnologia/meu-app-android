import React from 'react';
import ReactMarkdown from 'react-markdown';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ cards, theme, personName, birthDate, question }) {
  if (!cards || cards.length === 0) return null;

  const getCardInterpretation = (card) => {
    // 1. Tenta achar pelo ID exato
    let cardData = tarotDeck[card.id];
    
    // 2. Se não achar, tenta normalizar o nome da carta para bater com a chave
    if (!cardData && card.name) {
      const fallbackKey = card.name.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      cardData = tarotDeck[fallbackKey];
    }

    if (!cardData) return "A energia desta carta está presente, mas o texto detalhado ainda está sendo processado pelo sistema.";
    
    // Normalização do tema (ex: 'trabalho')
    const activeTheme = theme 
      ? theme.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
      : 'conselho';
    
    // Ordem de busca: Tema específico -> Upright -> Significado Geral
    return cardData.temas?.[activeTheme] || cardData.upright || cardData.meaning || "Refletindo sobre as possibilidades...";
  };

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto mb-20 space-y-8 animate-fadeIn">
      
      {/* 1. DADOS DA CONSULTA - OK (Pergunta Corrigida) */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl border-l-8 border-purple-600">
        <h2 className="text-xl font-black text-gray-900 uppercase mb-4 tracking-tight">Dados da Consulta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-gray-800">
          <p><strong className="text-purple-700 font-bold uppercase text-[10px] block">Consulente:</strong> {personName || 'Gustavo'}</p>
          <p><strong className="text-purple-700 font-bold uppercase text-[10px] block">Nascimento:</strong> {birthDate || '06/05/1975'}</p>
          <p><strong className="text-purple-700 font-bold uppercase text-[10px] block">Tema Selecionado:</strong> {theme || 'Trabalho'}</p>
          <div className="md:col-span-2 bg-purple-50 p-4 rounded-xl border border-purple-100 mt-2">
            <strong className="text-purple-700 font-bold uppercase text-[10px] block mb-1">Sua Pergunta:</strong> 
            <span className="text-xl font-medium text-gray-800 italic">"{question || 'Vou conseguir um emprego?'}"</span>
          </div>
        </div>
      </div>

      {/* 2. ANÁLISE DAS 3 CARTAS - MELHORADO */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-t-8 border-amber-400">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 uppercase">Análise do Oráculo</h2>
          <div className="h-1.5 w-20 bg-amber-400 mx-auto rounded-full mt-4"></div>
        </div>
        
        <div className="space-y-12">
          {cards.map((card, index) => (
            <div key={index} className="prose prose-xl max-w-none text-gray-900 border-b border-gray-100 pb-8 last:border-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded uppercase">
                  {index === 0 ? "Passado" : index === 1 ? "Presente" : "Futuro"}
                </span>
                <h3 className="text-2xl font-black text-gray-800 m-0">{card.name}</h3>
              </div>
              <div className="text-gray-700 leading-relaxed font-normal bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <ReactMarkdown>{getCardInterpretation(card)}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CONCLUSÃO FINAL - OK (Responsiva) */}
      <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl text-white border-b-8 border-amber-500">
        <h2 className="text-2xl font-black uppercase mb-6 text-amber-400 text-center">Resposta para sua Jornada</h2>
        <div className="text-gray-200 text-center italic leading-relaxed text-lg">
           Sobre sua busca: <span className="text-amber-300">"{question || 'Vou conseguir um emprego?'}"</span>, 
           os arcanos indicam que o tema <strong>{theme || 'trabalho'}</strong> está em um ponto de virada. 
           Observe o conselho da carta <span className="text-amber-300">{cards[1]?.name}</span> no presente para agir com sabedoria.
        </div>
      </div>
    </div>
  );
}