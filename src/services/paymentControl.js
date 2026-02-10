export const validatePixReceipt = (ocrText) => {
  const cleanText = ocrText.toUpperCase().replace(/\n/g, ' ').replace(/\s+/g, ' ');
  
  const idPattern = /[A-Z0-9]{32}/;
  const idMatch = cleanText.match(idPattern);
  if (!idMatch) return { success: false, error: "❌ ID de transação não encontrado." };

  if (!cleanText.includes("10,00") && !cleanText.includes("10.00")) return { success: false, error: "❌ Valor incorreto." };

  const keywordsDestino = ["PARA", "DESTINO", "DESTINATÁRIO", "FAVORECIDO", "RECEBEDOR", "BENEFICIÁRIO"];
  const nomesAutorizados = ["GUSTAVO SANTOS RIBEIRO", "GUSTAVO S RIBEIRO", "GUSTAVO S. RIBEIRO"];
  
  let nomeValido = false;
  for (const keyword of keywordsDestino) {
    if (cleanText.includes(keyword)) {
      const posicao = cleanText.indexOf(keyword);
      const trechoDestinatario = cleanText.substring(posicao, posicao + 500);
      if (nomesAutorizados.some(nome => trechoDestinatario.includes(nome))) {
        nomeValido = true;
        break;
      }
    }
  }

  if (!nomeValido) return { success: false, error: "❌ Destinatário incorreto." };
  return { success: true, idEncontrado: idMatch[0] };
};
