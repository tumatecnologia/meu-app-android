import React from 'react';
import ReactMarkdown from 'react-markdown';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ cards, theme, personName, birthDate, question }) {
  // Se não houver cartas, não renderiza nada
  if (!cards || cards.length === 0) return null;

  // Função para buscar o texto no banco de dados com "tradutor" de IDs
  const getCardInterpretation = (card) => {
    // Tenta encontrar por ID direto ou gera um ID a partir do nome da carta
    const cardKey = card.id || card.name?.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-');

    const cardData = tarotDeck[cardKey];
    
    if (!cardData) return `Interpretação detalhada para "${card.name}" está sendo carregada...`;
    
    // Normaliza o tema (ex: 'GRAVIDEZ' -> 'gravidez')
    const activeTheme = theme 
      ? theme.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
      : 'geral';
    
    // Busca: 1. Tema Específico | 2. Texto Padrão (Upright) | 3. Significado Geral
    return cardData.temas?.[activeTheme] || cardData.upright || cardData.meaning || "A energia desta carta traz clareza para o seu momento.";
  };

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto mb-20 space-y-8 animate-fadeIn text-left">
      
      {/* 1. DADOS DA CONSULTA - REFORÇADO */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl border-l-8 border-purple-600">
        <h2 className="text-xl font-black text-gray-900 uppercase mb-4 tracking-tight text-center">Resumo da Consulta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-gray-800">
          <p><strong className="text-purple-700 font-bold uppercase text-[10px] block font-sans">Consulente:</strong> {personName || 'Visitante'}</p>
          <p><strong className="text-purple-700 font-bold uppercase text-[10px] block font-sans">Nascimento:</strong> {birthDate || 'Não informado'}</p>
          <p><strong className="text-purple-700 font-bold uppercase text-[10px] block font-sans">Tema Escolhido:</strong> <span className="font-bold text-purple-900 uppercase italic">{theme || 'Geral'}</span></p>
          
          <div className="md:col-span-2 bg-purple-50 p-4 rounded-xl border border-purple-100 mt-2">
            <strong className="text-purple-700 font-bold uppercase text-[10px] block mb-1 font-sans">Sua Pergunta:</strong> 
            <span className="text-xl font-medium text-gray-800 italic">
              {question && question.length > 2 ? `"${question}"` : "Buscando orientação para o seu caminho."}
            </span>
          </div>
        </div>
      </div>

      {/* 2. ANÁLISE DAS 3 CARTAS */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-t-8 border-amber-400">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 uppercase font-sans">Análise do Oráculo</h2>
          <div className="h-1.5 w-20 bg-amber-400 mx-auto rounded-full mt-4"></div>
        </div>
        
        <div className="space-y-12">
          {cards.map((card, index) => (
            <div key={index} className="prose prose-xl max-w-none text-gray-900 border-b border-gray-100 pb-8 last:border-0">
              <div className="flex items-center gap-3 mb-4 font-sans">
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded uppercase">
                  {index === 0 ? "Passado" : index === 1 ? "Presente" : "Futuro"}
                </span>
                <h3 className="text-2xl font-black text-gray-800 m-0 uppercase">{card.name}</h3>
                {card.reversed && <span className="text-red-500 text-xs font-bold">(INVERTIDA)</span>}
              </div>
              <div className="text-gray-700 leading-relaxed font-normal bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <ReactMarkdown>{getCardInterpretation(card)}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CONCLUSÃO FINAL - RESPONSIVA E DIRETA */}
      <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl text-white border-b-8 border-amber-500">
        <h2 className="text-2xl font-black uppercase mb-6 text-amber-400 text-center font-sans">Conclusão Final</h2>
        <div className="text-gray-200 text-center italic leading-relaxed text-lg font-sans">
           Para sua pergunta: <span className="text-amber-300 font-bold">"{question || 'Sua jornada'}"</span>, 
           as energias de <span className="text-amber-300 font-bold uppercase">{theme || 'vida'}</span> mostram que a carta central 
           <span className="text-amber-300"> {cards[1]?.name}</span> guia seu passo agora.
        </div>
      </div>
    </div>
  );
}