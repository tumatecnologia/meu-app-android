import React from 'react';
import ReactMarkdown from 'react-markdown';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ cards, theme, personName, birthDate, question }) {
  if (!cards || cards.length === 0) return null;

  // Função para buscar o texto no seu banco de dados (tarotData.js)
  const getCardInterpretation = (card) => {
    // Tenta achar pelo ID ou pelo nome normalizado
    const cardId = card.id || card.name?.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const cardData = tarotDeck[cardId];
    
    if (!cardData) return "Oculto: Verifique se o ID da carta no banco de dados está correto.";
    
    // Normaliza o tema (saude, amor, trabalho)
    const activeTheme = theme 
      ? theme.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
      : 'geral';
    
    // Busca: 1. Tema específico | 2. Texto padrão (upright)
    return cardData.temas?.[activeTheme] || cardData.upright || "A sabedoria desta carta está guardada no momento.";
  };

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto mb-20 space-y-8 animate-fadeIn text-left">
      
      {/* 1. DADOS DA CONSULTA - FORÇANDO EXIBIÇÃO */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl border-l-8 border-purple-600">
        <h2 className="text-xl font-black text-gray-900 uppercase mb-4 tracking-tight text-center">Dados da Consulta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-gray-800">
          <p><strong className="text-purple-700 font-bold uppercase text-[10px] block">Consulente:</strong> {personName || 'Não identificado'}</p>
          <p><strong className="text-purple-700 font-bold uppercase text-[10px] block">Nascimento:</strong> {birthDate || 'Não informado'}</p>
          <p><strong className="text-purple-700 font-bold uppercase text-[10px] block">Tema Escolhido:</strong> <span className="font-bold text-purple-900 uppercase">{theme || 'Geral'}</span></p>
          
          <div className="md:col-span-2 bg-purple-50 p-4 rounded-xl border border-purple-100 mt-2">
            <strong className="text-purple-700 font-bold uppercase text-[10px] block mb-1">Sua Pergunta Realizada:</strong> 
            <span className="text-xl font-medium text-gray-800 italic">
              {question && question.trim() !== "" ? `"${question}"` : "Pergunta não capturada pelo sistema."}
            </span>
          </div>
        </div>
      </div>

      {/* 2. ANÁLISE DAS 3 CARTAS */}
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
                  {index === 0 ? "O Passado" : index === 1 ? "O Presente" : "O Futuro"}
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

      {/* 3. CONCLUSÃO FINAL - TRAVADA NO TEMA E PERGUNTA */}
      <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl text-white border-b-8 border-amber-500">
        <h2 className="text-2xl font-black uppercase mb-6 text-amber-400 text-center text-white">Conclusão Final</h2>
        <div className="text-gray-200 text-center italic leading-relaxed text-lg">
           Para a questão: <span className="text-amber-300 font-bold">"{question || 'Sua jornada'}"</span>, 
           o oráculo revela que as energias de <span className="text-amber-300 font-bold uppercase">{theme || 'vida'}</span> estão em movimento. 
           A carta central <span className="text-amber-300">{cards[1]?.name}</span> é o seu guia principal agora.
        </div>
      </div>
    </div>
  );
}