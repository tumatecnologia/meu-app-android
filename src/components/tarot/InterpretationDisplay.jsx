import React from 'react';
import ReactMarkdown from 'react-markdown';
import { tarotDeck } from '../../services/tarotData';

export default function InterpretationDisplay({ cards, theme, personName, birthDate, question }) {
  // Proteção para garantir que temos as cartas
  if (!cards || cards.length === 0) return null;

  // Função para buscar o texto de cada carta individualmente
  const getCardText = (card) => {
    const cardData = tarotDeck[card.id];
    if (!cardData) return "A sabedoria desta carta está se revelando...";
    
    const activeTheme = theme 
      ? theme.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
      : 'conselho';
    
    return cardData.temas?.[activeTheme] || cardData.upright;
  };

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto mb-20 space-y-8 animate-fadeIn">
      
      {/* 1. DADOS DO CONSULENTE */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl border-l-8 border-purple-600">
        <h2 className="text-xl font-black text-gray-900 uppercase mb-4 tracking-tight">Dados da Consulta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-gray-800">
          <p><strong className="text-purple-700">Consulente:</strong> {personName || 'Não informado'}</p>
          <p><strong className="text-purple-700">Nascimento:</strong> {birthDate || 'Não informada'}</p>
          <p><strong className="text-purple-700">Tema:</strong> {theme || 'Geral'}</p>
          <p className="md:col-span-2"><strong className="text-purple-700">Pergunta:</strong> {question || 'Busca por orientação geral'}</p>
        </div>
      </div>

      {/* 2. INTERPRETAÇÃO DAS 3 CARTAS */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-t-8 border-amber-400">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 uppercase">Análise do Oráculo</h2>
          <div className="h-1.5 w-20 bg-amber-400 mx-auto rounded-full mt-4"></div>
        </div>
        
        <div className="space-y-12">
          {cards.map((card, index) => (
            <div key={index} className="prose prose-xl max-w-none text-gray-900 leading-relaxed border-b border-gray-100 pb-8 last:border-0">
              <h3 className="text-amber-600 font-bold uppercase text-sm mb-2 tracking-widest">
                {index === 0 ? "O Passado" : index === 1 ? "O Presente" : "O Futuro"} — {card.name}
              </h3>
              <ReactMarkdown>{getCardText(card)}</ReactMarkdown>
            </div>
          ))}
        </div>
      </div>

      {/* 3. INTERPRETAÇÃO FINAL (RESPONSIVA) */}
      <div className="bg-gray-900 rounded-[2rem] p-8 md:p-10 shadow-2xl text-white border-b-8 border-amber-500">
        <h2 className="text-2xl font-black uppercase mb-4 text-amber-400 text-center">Conclusão Final</h2>
        <div className="prose prose-invert prose-lg max-w-none text-gray-200 text-center italic">
          <p>
            Com base no {theme?.toLowerCase() || 'seu momento'}, o arcano {cards[1]?.name} (Presente) sugere que o caminho para sua pergunta sobre "{question || 'seu destino'}" depende da harmonia entre o que foi plantado no passado e as sementes do futuro. As energias estão favoráveis para o seu crescimento.
          </p>
        </div>
      </div>

    </div>
  );
}