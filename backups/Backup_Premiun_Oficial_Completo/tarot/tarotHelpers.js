// Funções auxiliares para análise detalhada do tarô

export const getThemeDisplayName = (theme) => {
  const themeNames = {
    'amor': 'Amor e Relacionamentos 💖',
    'carreira': 'Carreira e Profissão 💼',
    'financas': 'Finanças e Prosperidade 💰',
    'espiritualidade': 'Espiritualidade e Crescimento 🙏',
    'saude': 'Saúde e Bem-estar 🌿',
    'traicao': 'Confiança e Traição ⚖️',
    'casamento': 'Casamento e União 💍',
    'viagem': 'Viagens e Jornadas ✈️',
    'noivado': 'Noivado e Compromisso 💑',
    'conselho': 'Conselho e Orientação 🧭',
    'justica': 'Justiça e Equilíbrio ⚖️'
  };
  return themeNames[theme] || 'Consulta Geral 🔮';
};

export const getPositionImpact = (card, positionIndex) => {
  const positionImpacts = [
    'como experiências passadas influenciam sua situação atual',
    'como esta energia se manifesta em sua vida presente',
    'potenciais desdobramentos e oportunidades futuras'
  ];
  
  const baseImpact = positionImpacts[positionIndex];
  const reversal = card.reversed ? ' (com desafios a superar)' : ' (de forma fluida e harmoniosa)';
  
  return `Esta carta atua ${baseImpact}${reversal}`;
};

export const getCardLesson = (card, theme) => {
  const lessons = {
    'O Louco': 'Abrace o novo com coragem, mas mantenha seus pés no chão.',
    'O Mago': 'Use seus recursos criativos para manifestar seus desejos.',
    'A Sacerdotisa': 'Confie em sua intuição e sabedoria interior.',
    'A Imperatriz': 'Nutra seus projetos com paciência e amor.',
    'O Imperador': 'Estabeleça estruturas sólidas para seu crescimento.',
    'O Hierofante': 'Busque orientação espiritual e tradições que façam sentido.',
    'Os Amantes': 'Faça escolhas alinhadas com seus valores mais profundos.',
    'O Carro': 'Avance com determinação, mas mantenha o equilíbrio.',
    'A Força': 'Use sua força interior com gentileza e compaixão.',
    'O Eremita': 'Reserve momentos de solitude para reflexão profunda.',
    'A Roda da Fortuna': 'Aceite os ciclos da vida com sabedoria.',
    'A Justiça': 'Busque equilíbrio e justiça em todas as decisões.',
    'O Enforcado': 'Às vezes, uma nova perspectiva surge da paciência.',
    'A Morte': 'Permita que velhos padrões se transformem em novos começos.',
    'A Temperança': 'Encontre o ponto de equilíbrio entre extremos.',
    'O Diabo': 'Liberte-se de apegos e limitações autoimpostas.',
    'A Torre': 'Mudanças bruscas podem trazer novas fundações.',
    'A Estrela': 'Mantenha a esperança e a fé em seu caminho.',
    'A Lua': 'Confie em sua intuição para navegar pela incerteza.',
    'O Sol': 'Celebre a alegria e a vitalidade em sua vida.',
    'O Julgamento': 'Esteja pronto para renascer e recomeçar.',
    'O Mundo': 'Comemore conclusões e prepare-se para novos ciclos.'
  };
  
  return lessons[card.card_name] || 'Cada experiência traz aprendizados únicos para sua jornada.';
};

export const getCardEnergy = (card) => {
  const energies = {
    'O Louco': 'Energia de novos começos e aventura',
    'O Mago': 'Energia de manifestação e criatividade',
    'A Sacerdotisa': 'Energia intuitiva e misteriosa',
    'A Imperatriz': 'Energia criativa e nutritiva',
    'O Imperador': 'Energia estrutural e de autoridade',
    'O Hierofante': 'Energia espiritual e tradicional',
    'Os Amantes': 'Energia de escolhas e relacionamentos',
    'O Carro': 'Energia de movimento e progresso',
    'A Força': 'Energia de força interior e coragem',
    'O Eremita': 'Energia introspectiva e sábia',
    'A Roda da Fortuna': 'Energia cíclica e de mudanças',
    'A Justiça': 'Energia de equilíbrio e justiça',
    'O Enforcado': 'Energia de paciência e nova perspectiva',
    'A Morte': 'Energia transformadora e de renovação',
    'A Temperança': 'Energia de equilíbrio e moderação',
    'O Diabo': 'Energia de apego e libertação',
    'A Torre': 'Energia de mudança abrupta e revelação',
    'A Estrela': 'Energia de esperança e inspiração',
    'A Lua': 'Energia intuitiva e misteriosa',
    'O Sol': 'Energia de alegria e vitalidade',
    'O Julgamento': 'Energia de renascimento e clareza',
    'O Mundo': 'Energia de realização e completude'
  };
  
  const baseEnergy = energies[card.card_name] || 'Energia única para sua jornada';
  return card.reversed ? `${baseEnergy} (em processo de integração)` : baseEnergy;
};

export const analyzeCardsSynergy = (cards) => {
  const cardNames = cards.map(c => c.card_name);
  
  if (cardNames.includes('O Louco') && cardNames.includes('O Mundo')) {
    return 'Um ciclo completo está se fechando, trazendo novas oportunidades de começo.';
  }
  
  if (cardNames.includes('A Morte') && cardNames.includes('O Sol')) {
    return 'Transformações dolorosas levam a renovação e alegria autêntica.';
  }
  
  if (cardNames.includes('O Diabo') && cardNames.includes('A Temperança')) {
    return 'Libertar-se de limitações permite encontrar equilíbrio verdadeiro.';
  }
  
  if (cardNames.includes('A Torre') && cardNames.includes('A Estrela')) {
    return 'Mudanças abruptas abrem espaço para esperança renovada.';
  }
  
  return 'Estas cartas trabalham juntas para guiar você através de diferentes aspectos de sua jornada, criando uma narrativa única de crescimento e aprendizado.';
};

export const generateSpecificWarnings = (cards, theme) => {
  const warnings = [];
  
  cards.forEach(card => {
    if (card.reversed) {
      warnings.push(`• Atenção a bloqueios relacionados a ${card.card_name.toLowerCase()}`);
    }
    
    if (card.card_name === 'O Diabo') {
      warnings.push('• Cuidado com apegos materiais ou relacionamentos limitantes');
    }
    
    if (card.card_name === 'A Torre') {
      warnings.push('• Prepare-se para mudanças inesperadas, mas necessárias');
    }
    
    if (card.card_name === 'A Lua') {
      warnings.push('• Confie na intuição, mas verifique fatos antes de decisões importantes');
    }
  });
  
  if (theme === 'financas' && cards.some(c => c.reversed)) {
    warnings.push('• Revisão cuidadosa de gastos e investimentos é recomendada');
  }
  
  if (theme === 'amor' && cards.some(c => c.card_name === 'Os Amantes' && c.reversed)) {
    warnings.push('• Comunicação clara é essencial para evitar mal-entendidos');
  }
  
  return warnings.length > 0 ? warnings.join('\n') : '• Continue com a atenção e cuidado que já demonstra';
};

export const generateOpportunities = (cards, theme) => {
  const opportunities = [];
  
  cards.forEach(card => {
    if (!card.reversed) {
      if (card.card_name === 'O Sol' || card.card_name === 'A Estrela') {
        opportunities.push('• Momento favorável para iniciar novos projetos');
      }
      
      if (card.card_name === 'A Imperatriz' || card.card_name === 'O Mago') {
        opportunities.push('• Criatividade e manifestação estão ampliadas');
      }
      
      if (card.card_name === 'O Carro' || card.card_name === 'O Mundo') {
        opportunities.push('• Progresso significativo em direção aos objetivos');
      }
    }
  });
  
  if (theme === 'carreira' && cards.some(c => !c.reversed && (c.card_name === 'O Imperador' || c.card_name === 'A Justiça'))) {
    opportunities.push('• Reconhecimento profissional e oportunidades de liderança');
  }
  
  if (theme === 'espiritualidade') {
    opportunities.push('• Conexão espiritual mais profunda e insights intuitivos');
  }
  
  return opportunities.length > 0 ? opportunities.join('\n') : '• Pequenas ações consistentes criam grandes transformações';
};

export const generateChallengesAndSolutions = (cards) => {
  const challenges = [];
  
  cards.forEach(card => {
    if (card.reversed) {
      challenges.push(`• ${card.card_name} invertida: Trabalhe os bloqueios com paciência e auto-reflexão`);
    }
    
    if (card.card_name === 'O Eremita') {
      challenges.push('• Encontrar equilíbrio entre solitude e conexão social');
    }
    
    if (card.card_name === 'A Força') {
      challenges.push('• Usar força interior com gentileza e compaixão');
    }
  });
  
  return challenges.length > 0 ? challenges.join('\n') : '• Desafios atuais são oportunidades disfarçadas de crescimento';
};

export const generatePracticalActions = (cards, firstName) => {
  const actions = [];
  const name = firstName ? `${firstName}, ` : '';
  
  actions.push(`• ${name}reserve 10 minutos diários para meditação ou reflexão`);
  actions.push('• Anote insights e sonhos em um diário espiritual');
  actions.push('• Pratique gratidão por três coisas específicas cada dia');
  
  if (cards.some(c => c.card_name === 'O Diabo' || c.card_name === 'A Torre')) {
    actions.push('• Identifique e libere um padrão limitante esta semana');
  }
  
  if (cards.some(c => c.card_name === 'O Sol' || c.card_name === 'A Estrela')) {
    actions.push('• Compartilhe sua luz com alguém que precise de apoio');
  }
  
  return actions.join('\n');
};

export const getExpandedFinalAdvice = (theme, cards, firstName) => {
  const name = firstName ? `${firstName}, ` : '';
  const genderSuffix = firstName ? (firstName.toLowerCase().endsWith('a') ? 'a' : 'o') : 'o';
  
  const expandedAdvice = {
    'amor': `${name}mantenha seu coração aberto às lições que cada relacionamento traz. O amor verdadeiro floresce quando você ama primeiro a si mesm${genderSuffix}. Paciência e autenticidade atrairão conexões significativas.`,
    'carreira': `${name}siga não apenas oportunidades, mas também sua paixão. Seu caminho profissional se ilumina quando alinha talentos com propósito. Novas portas se abrem para quem se prepara com excelência.`,
    'financas': `${name}equilíbrio é a chave da prosperidade. Planeje com sabedoria, invista com discernimento e celebre cada conquista. A abundância flui para quem gerencia recursos com gratidão.`,
    'espiritualidade': `${name}sua jornada espiritual é única e preciosa. Conecte-se com o sagrado em pequenos momentos diários. Cada passo em direção à luz interior transforma sua realidade externa.`,
    'saude': `${name}cuide do templo que é seu corpo com amor e respeito. Pequenos hábitos de autocuidado criam grandes transformações. Escute os sinais que seu corpo gentilmente oferece.`,
    'traicao': `${name}a verdade sempre encontra seu caminho para a luz. Confie em sua intuição para discernir lealdade genuína. A cura vem quando você libera o que não lhe serve mais.`,
    'casamento': `${name}comunicação sincera e respeito mútuo são alicerces duradouros. Cada desafio superado fortalece os laços. Lembre-se de nutrir a amizade dentro do amor.`,
    'viagem': `${name}esteja aberto a transformações que cada jornada traz. As maiores viagens começam com um passo corajoso. Cada novo horizonte expande sua compreensão do mundo e de si mesm${genderSuffix}.`,
    'noivado': `${name}o verdadeiro compromisso nasce da compreensão profunda e respeito mútuo. Valorize cada etapa do processo, pois o caminho é tão importante quanto o destino.`,
    'conselho': `${name}ouça a sabedoria que já reside dentro de você. Sua voz interior é seu guia mais confiável. Quando em dúvida, respire fundo e confie no timing perfeito do universo.`,
    'justica': `${name}busque equilíbrio em todas as áreas da vida. A justiça divina age com perfeição, mesmo quando não compreendemos seu timing. Sua integridade é seu maior patrimônio.`
  };
  
  return expandedAdvice[theme] || `${name}confie no processo único de sua jornada. Cada experiência, alegre ou desafiadora, contribui para o belo mosaico de sua vida. O universo conspira a favor de quem caminha com fé e autenticidade.`;
};

export const generateEnergyProtections = (cards) => {
  const protections = [];
  
  protections.push('• Visualize uma luz dourada envolvendo seu corpo e aura');
  protections.push('• Use cristais como quartzo branco ou turmalina negra para proteção');
  protections.push('• Limpe seu espaço regularmente com incenso ou essências');
  
  if (cards.some(c => c.card_name === 'A Lua' || c.card_name === 'O Diabo')) {
    protections.push('• Pratique banimentos energéticos suaves com água e sal marinho');
  }
  
  if (cards.some(c => c.reversed)) {
    protections.push('• Meditação de corte de laços energéticos pode ser benéfica');
  }
  
  return protections.join('\n');
};

export const generateKeywords = (cards) => {
  const keywords = [];
  
  cards.forEach(card => {
    if (!card.reversed) {
      if (card.card_name === 'O Sol') keywords.push('Alegria', 'Vitalidade', 'Sucesso');
      if (card.card_name === 'A Estrela') keywords.push('Esperança', 'Inspiração', 'Fé');
      if (card.card_name === 'O Mago') keywords.push('Criatividade', 'Manifestação', 'Habilidade');
      if (card.card_name === 'A Imperatriz') keywords.push('Abundância', 'Criação', 'Nutrição');
      if (card.card_name === 'O Mundo') keywords.push('Realização', 'Completude', 'Viagem');
    } else {
      if (card.card_name === 'A Lua') keywords.push('Intuição', 'Mistério', 'Reflexão');
      if (card.card_name === 'O Eremita') keywords.push('Sabedoria', 'Introspecção', 'Guia');
      if (card.card_name === 'A Temperança') keywords.push('Equilíbrio', 'Paciência', 'Moderação');
    }
  });
  
  // Garantir pelo menos algumas keywords
  if (keywords.length < 3) {
    keywords.push('Crescimento', 'Transformação', 'Aprendizado', 'Jornada', 'Descoberta');
  }
  
  // Pegar até 5 keywords únicas
  const uniqueKeywords = [...new Set(keywords)].slice(0, 5);
  return uniqueKeywords.map(kw => `**${kw}**`).join(' • ');
};
