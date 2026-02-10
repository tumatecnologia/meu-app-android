export const validatePixReceipt = (ocrText) => {
  // Converte para maiúsculas e normaliza espaços para evitar erros de leitura
  const cleanText = ocrText.toUpperCase().replace(/\s+/g, ' ');
  
  // 1. VALIDAÇÃO DE ID (32 caracteres alfanuméricos)
  const idPattern = /[A-Z0-9]{32}/;
  const idMatch = cleanText.match(idPattern);
  if (!idMatch) {
    return { success: false, error: "❌ ID da transação não encontrado." };
  }

  // 2. VALIDAÇÃO DE DATA (Universal: aceita 09/02/2026, 09-02-2026, 09 FEV 2026, etc)
  const datePattern = /(\d{2})[\/\-\s](?:\d{2}|[A-Z]{3,9})[\/\-\s](\d{4})/;
  const dateMatch = cleanText.match(datePattern);
  if (!dateMatch) {
    return { success: false, error: "❌ Data não detectada ou inválida." };
  }

  // 3. VALIDAÇÃO DE VALOR (R$ 10,00)
  // Aceita "10,00" ou "10.00"
  if (!cleanText.includes("10,00") && !cleanText.includes("10.00")) {
    return { success: false, error: "❌ Valor incorreto. O valor deve ser R$ 10,00." };
  }

  // 4. VALIDAÇÃO DE NOME (Filtro após palavras de destino)
  const keywordsDestino = ["DESTINO", "DESTINATÁRIO", "FAVORECIDO", "RECEBEDOR", "BENEFICIÁRIO"];
  const nomesAutorizados = [
    "GUSTAVO SANTOS RIBEIRO",
    "GUSTAVO S RIBEIRO",
    "GUSTAVO S. RIBEIRO",
    "Gustavo Santos Ribeiro",
    "Gustavo S Ribeiro",
    "Gustavo S. Ribeiro"
  ];

  let nomeValido = false;

  for (const keyword of keywordsDestino) {
    if (cleanText.includes(keyword)) {
      const posicao = cleanText.indexOf(keyword);
      // Pega os 150 caracteres após a palavra-chave para garantir que o nome é o do Destinatário
      const trechoPosKeyword = cleanText.substring(posicao, posicao + 150);
      
      if (nomesAutorizados.some(nome => trechoPosKeyword.includes(nome))) {
        nomeValido = true;
        break;
      }
    }
  }

  if (!nomeValido) {
    return { success: false, error: "❌ Destinatário incorreto. O favorecido deve ser GUSTAVO SANTOS RIBEIRO." };
  }

  return { 
    success: true, 
    idEncontrado: idMatch[0],
    msg: "✅ Pagamento validado com sucesso!" 
  };
};