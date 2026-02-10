export const validatePixReceipt = (ocrText) => {
  // Limpeza para evitar erros com quebras de linha e espaços duplos
  const cleanText = ocrText.toUpperCase().replace(/\n/g, ' ').replace(/\s+/g, ' ');
  
  // 1. VALIDAÇÃO DE ID (Aceita strings alfanuméricas longas)
  const idPattern = /[A-Z0-9]{20,45}/;
  const idMatch = cleanText.match(idPattern);
  if (!idMatch) return { success: false, error: "❌ ID não detectado." };

  // 2. VALIDAÇÃO DE VALOR (R$ 10,00)
  if (!cleanText.includes("10,00") && !cleanText.includes("10.00")) {
    return { success: false, error: "❌ Valor incorreto. O valor deve ser R$ 10,00." };
  }

  // 3. VALIDAÇÃO DE NOME (Filtro Rigoroso após Palavras-Chave de Destino)
  const keywordsDestino = ["DESTINO", "DESTINATÁRIO", "FAVORECIDO", "RECEBEDOR", "BENEFICIÁRIO","PARA"];
  const nomesAutorizados = [
    "GUSTAVO SANTOS RIBEIRO",
    "GUSTAVO S RIBEIRO",
    "GUSTAVO S. RIBEIRO"
  ];

  let nomeValido = false;

  for (const keyword of keywordsDestino) {
    if (cleanText.includes(keyword)) {
      const posicao = cleanText.indexOf(keyword);
      // Analisamos os 500 caracteres após a palavra-chave para garantir que é o destinatário
      const trechoDestinatario = cleanText.substring(posicao, posicao + 500);
      
      if (nomesAutorizados.some(nome => trechoDestinatario.includes(nome))) {
        nomeValido = true;
        break;
      }
    }
  }

  if (!nomeValido) {
    return { success: false, error: "❌ Destinatário incorreto. O PIX deve ser para GUSTAVO SANTOS RIBEIRO." };
  }

  return { 
    success: true, 
    idEncontrado: idMatch[0],
    msg: "✅ Pagamento validado com sucesso!" 
  };
};
