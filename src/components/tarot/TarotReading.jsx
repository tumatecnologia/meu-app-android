import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCw, Calendar } from 'lucide-react';

const TarotReading = ({ paymentId, theme, userData, onNewReading }) => {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapear temas
  const themeLabels = {
    'amor': 'Amor',
    'carreira': 'Carreira',
    'financas': 'Finanças',
    'espiritualidade': 'Espiritualidade',
    'saude': 'Saúde',
    'traicao': 'Traição',
    'casamento': 'Casamento',
    'viagem': 'Viagem',
    'noivado': 'Noivado',
    'conselho': 'Conselho',
    'justica': 'Justiça'
  };

  // Função para extrair primeiro nome
  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  // Formatar data de nascimento CORRIGIDA - lendo do formato YYYY-MM-DD
  const formatBirthDate = (dateString) => {
    if (!dateString) return '';
    
    // O input date retorna no formato YYYY-MM-DD
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    
    // Fallback para tentar parsear
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
    }
  };

  useEffect(() => {
    // Gerar leitura
    const generateReading = () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Gerar cartas aleatórias
      const allCards = [
        { name: 'O Louco', upright: 'Novos começos, aventura, liberdade', reversed: 'Imprudência, risco excessivo' },
        { name: 'O Mago', upright: 'Vontade, habilidade, recurso', reversed: 'Manipulação, falta de habilidade' },
        { name: 'A Sacerdotisa', upright: 'Intuição, mistério, sabedoria', reversed: 'Ignorar a intuição, superficialidade' },
        { name: 'A Imperatriz', upright: 'Fertilidade, beleza, natureza', reversed: 'Dependência, negligência' },
        { name: 'O Imperador', upright: 'Autoridade, estrutura, controle', reversed: 'Rigidez, dominação' },
        { name: 'O Hierofante', upright: 'Tradição, espiritualidade, conformidade', reversed: 'Rebelião, não-conformidade' },
        { name: 'Os Amantes', upright: 'Amor, harmonia, relacionamentos', reversed: 'Desequilíbrio, escolhas difíceis' },
        { name: 'O Carro', upright: 'Determinação, vitória, vontade', reversed: 'Falta de direção, agressão' },
        { name: 'A Força', upright: 'Coragem, paciência, controle', reversed: 'Fraqueza, insegurança' },
        { name: 'O Eremita', upright: 'Introspecção, prudência, orientação', reversed: 'Isolamento, ignorância' },
        { name: 'A Roda da Fortuna', upright: 'Destino, sorte, ciclos', reversed: 'Má sorte, resistência à mudança' },
        { name: 'A Justiça', upright: 'Equilíbrio, justiça, verdade', reversed: 'Injustiça, falta de responsabilidade' },
        { name: 'O Pendurado', upright: 'Sacrifício, perspectiva, rendição', reversed: 'Estagnação, resistência' },
        { name: 'A Morte', upright: 'Fim, mudança, transformação', reversed: 'Medo de mudar, estagnação' },
        { name: 'A Temperança', upright: 'Equilíbrio, moderação, paciência', reversed: 'Desequilíbrio, excessos' },
        { name: 'O Diabo', upright: 'Escravidão, materialismo, ignorância', reversed: 'Libertação, esclarecimento' },
        { name: 'A Torre', upright: 'Mudança repentina, revelação', reversed: 'Medo de mudança, desastre evitado' },
        { name: 'A Estrela', upright: 'Esperança, inspiração, serenidade', reversed: 'Desespero, falta de fé' },
        { name: 'A Lua', upright: 'Ilusão, intuição, inconsciente', reversed: 'Confusão, medo' },
        { name: 'O Sol', upright: 'Alegria, sucesso, vitalidade', reversed: 'Tristeza, falta de sucesso' },
        { name: 'O Julgamento', upright: 'Renascimento, absolvição, decisão', reversed: 'Dúvida, culpa' },
        { name: 'O Mundo', upright: 'Realização, viagem, integração', reversed: 'Incompletude, falta de realização' }
      ];

      // Sortear 3 cartas únicas
      const selectedCards = [];
      const usedIndexes = new Set();
      
      while (selectedCards.length < 3) {
        const randomIndex = Math.floor(Math.random() * allCards.length);
        if (!usedIndexes.has(randomIndex)) {
          usedIndexes.add(randomIndex);
          const card = allCards[randomIndex];
          const reversed = Math.random() > 0.7; // 30% chance de ser reversa
          
          selectedCards.push({
            card_name: card.name,
            position: selectedCards.length === 0 ? 'Passado' : selectedCards.length === 1 ? 'Presente' : 'Futuro',
            reversed: reversed,
            meaning: reversed ? card.reversed : card.upright
          });
        }
      }

      // Gerar interpretação com dados do usuário no Conselho Final
      const interpretation = generateInterpretation(theme, selectedCards, userData);

      const readingData = {
        cards: selectedCards,
        interpretation: interpretation,
        date: today,
        theme: theme,
        type: 'three_cards'
      };

      setTimeout(() => {
        setReading(readingData);
        setLoading(false);
      }, 2000);
    };

    generateReading();
  }, [theme, userData]);

  const generateInterpretation = (theme, cards, userData) => {
    const themeTexts = {
      'amor': `Baseado nas cartas sorteadas, sua jornada amorosa revela insights profundos. `,
      'carreira': `Suas cartas indicam caminhos profissionais e oportunidades. `,
      'financas': `A sabedoria das cartas ilumina sua situação financeira. `,
      'espiritualidade': `Sua conexão espiritual é fortalecida pelas mensagens destas cartas. `,
      'saude': `As cartas trazem reflexões sobre seu bem-estar e saúde. `,
      'traicao': `Estas cartas revelam verdades sobre confiança e lealdade. `,
      'casamento': `O destino do seu relacionamento é revelado pelas cartas. `,
      'viagem': `Sua jornada física e espiritual é iluminada. `,
      'noivado': `O futuro do seu compromisso amoroso é revelado. `,
      'conselho': `As cartas oferecem orientação sábia para sua situação. `,
      'justica': `Equilíbrio e justiça são os temas centrais desta leitura. `
    };

    let interpretation = themeTexts[theme] || `Suas cartas revelam mensagens importantes sobre sua jornada. `;
    
    interpretation += `\n\n🔮 ${cards[0].card_name} (Passado${cards[0].reversed ? ' - Invertida' : ''}):\n${cards[0].meaning}\n\n`;
    interpretation += `🔮 ${cards[1].card_name} (Presente${cards[1].reversed ? ' - Invertida' : ''}):\n${cards[1].meaning}\n\n`;
    interpretation += `🔮 ${cards[2].card_name} (Futuro${cards[2].reversed ? ' - Invertida' : ''}):\n${cards[2].meaning}\n\n`;
    
    // CONCELHO FINAL COM DADOS DO USUÁRIO
    const firstName = getFirstName(userData?.name || '');
    const birthDate = formatBirthDate(userData?.birthDate || '');
    const question = userData?.question || '';
    
    interpretation += `�� CONSELHO FINAL:\n`;
    
    if (firstName && birthDate && question) {
      interpretation += `Para ${firstName}, nascido(a) em ${birthDate}, que pergunta sobre "${question}", `;
    } else if (firstName && birthDate) {
      interpretation += `Para ${firstName}, nascido(a) em ${birthDate}, `;
    } else if (firstName && question) {
      interpretation += `Para ${firstName}, que pergunta sobre "${question}", `;
    } else if (birthDate && question) {
      interpretation += `Para quem nasceu em ${birthDate} e pergunta sobre "${question}", `;
    } else if (firstName) {
      interpretation += `Para ${firstName}, `;
    } else if (birthDate) {
      interpretation += `Para quem nasceu em ${birthDate}, `;
    } else if (question) {
      interpretation += `Para quem pergunta sobre "${question}", `;
    }
    
    interpretation += `o conselho das cartas é: ${getFinalAdvice(theme, cards)}\n\n`;
    
    interpretation += `✨ Que esta leitura ilumine seu caminho!`;

    return interpretation;
  };

  const getFinalAdvice = (theme, cards) => {
    const advices = {
      'amor': 'mantenha seu coração aberto e confie no processo do amor. A paciência revelará os sentimentos verdadeiros.',
      'carreira': 'siga sua intuição profissional e esteja aberto a novas oportunidades que surgirão em breve.',
      'financas': 'equilíbrio e planejamento são chaves para sua segurança financeira. Evite impulsos.',
      'espiritualidade': 'conecte-se com sua essência e busque a paz interior através da meditação e autoconhecimento.',
      'saude': 'cuide de seu corpo e mente com amor e atenção. Pequenos hábitos fazem grande diferença.',
      'traicao': 'a verdade sempre vem à tona. Confie em sua intuição e não tema enfrentar a realidade.',
      'casamento': 'comunicação e respeito são fundamentais para qualquer união. Dialogue com sinceridade.',
      'viagem': 'esteja aberto a novas experiências e aprendizados. Cada jornada traz crescimento.',
      'noivado': 'o amor verdadeiro é construído com paciência e compreensão mútua. Valorize cada etapa.',
      'conselho': 'ouça sua voz interior antes de tomar decisões importantes. Seu instinto é sábio.',
      'justica': 'busque o equilíbrio em todas as áreas de sua vida. A justiça chegará no momento certo.'
    };
    
    return advices[theme] || 'confie no processo e mantenha-se fiel aos seus valores. O universo conspira a seu favor.';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
        <p className="text-purple-300">Preparando sua leitura personalizada...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Cabeçalho da Leitura */}
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-amber-400/20 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Leitura de 3 Cartas
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 text-purple-300">
          <div className="flex items-center gap-1 bg-purple-800/40 px-3 py-1 rounded-full">
            <span className="text-amber-300">🎴</span>
            <span>{themeLabels[reading.theme] || reading.theme}</span>
          </div>
          <div className="flex items-center gap-1 bg-purple-800/40 px-3 py-1 rounded-full">
            <Calendar className="w-3 h-3" />
            <span>{reading.date}</span>
          </div>
        </div>
      </div>

      {/* Cartas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {reading.cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-purple-800/40 to-violet-800/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30"
          >
            <div className="text-center">
              {/* Posição da carta */}
              <div className="mb-4">
                <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
                  card.position === 'Passado' ? 'bg-blue-500/20 text-blue-300' :
                  card.position === 'Presente' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {card.position}
                </span>
              </div>
              
              {/* Nome da carta */}
              <h3 className="text-xl font-bold text-white mb-3">{card.card_name}</h3>
              
              {/* Status reverso */}
              <div className="mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                  card.reversed 
                    ? 'bg-red-500/20 text-red-300' 
                    : 'bg-green-500/20 text-green-300'
                }`}>
                  {card.reversed ? '🔄 Invertida' : '⬆️ Direta'}
                </span>
              </div>
              
              {/* Significado */}
              <div className="mt-4 pt-4 border-t border-purple-400/30">
                <p className="text-purple-200 text-sm">
                  {card.meaning}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interpretação */}
      <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-amber-400/30 mb-8">
        <h3 className="text-xl font-bold text-white mb-6">
          Interpretação Completa
        </h3>
        
        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <pre className="text-purple-100 leading-relaxed whitespace-pre-line font-sans">
              {reading.interpretation}
            </pre>
          </div>
          
          {/* Dados do usuário já estão incluídos no Conselho Final acima */}
        </div>
      </div>

      {/* Botões de Ação - REMOVIDO "Salvar Leitura" */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <button
          onClick={onNewReading}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
        >
          <RotateCw className="w-4 h-4" />
          Nova Leitura
        </button>
        
        {/* REMOVIDO: Botão "Salvar Leitura" */}
      </div>

      {/* Seção de Consultas Particulares Centralizada */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 mb-8"
      >
        <div className="relative bg-gradient-to-br from-amber-500/20 via-purple-900/60 to-violet-900/60 backdrop-blur-md border-2 border-amber-400/50 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl overflow-hidden text-center">
          <div className="absolute top-4 left-4 text-amber-400/30 text-2xl">✨</div>
          <div className="absolute top-4 right-4 text-amber-400/30 text-2xl">✨</div>
          
          <motion.div 
            className="mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-6xl drop-shadow-lg">🔮</span>
          </motion.div>
          
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent mb-2">
            Consultas Particulares
          </h3>
          <h4 className="text-lg text-purple-200 font-semibold mb-4">
            por Vídeo Chamada
          </h4>
          
          <div className="bg-black/30 rounded-2xl p-4 mb-6 border border-amber-400/30 mx-auto max-w-md">
            <p className="text-purple-100 leading-relaxed mb-2">
              Deseja uma leitura mais profunda e personalizada?
            </p>
            <p className="text-amber-300 font-medium">
              Conecte-se diretamente com nossos especialistas!
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <a 
              href="https://wa.me/5512996764694?text=Gostaria%20de%20saber%20mais%20sobre%20a%20consulta%20particular%20por%20video%20chamada"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-full transition-all text-lg shadow-2xl hover:shadow-green-500/50 hover:scale-105 transform mb-4"
            >
              <span className="text-2xl">💬</span>
              <div className="text-center">
                <div className="text-sm opacity-90">WhatsApp</div>
                <div>12 99676-4694</div>
              </div>
            </a>
            
            <div className="mt-4 pt-4 border-t border-amber-400/30 w-full max-w-md">
              <p className="text-amber-200 font-bold text-base mb-2">
                ✨ Com Tuma ou Oráculo ✨
              </p>
              <p className="text-purple-300 text-sm italic">
                Especialistas em Tarô e Leituras Místicas
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TarotReading;
