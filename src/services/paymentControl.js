export const validatePixReceipt = (ocrText) => {
  // Limpeza profunda do texto
  const cleanText = ocrText.toUpperCase().replace(/\n/g, ' ').replace(/\s+/g, ' ');
  
  // 1. VALIDAÇÃO DE ID (Mantido)
  const idPattern = /[A-Z0-9]{32}/;
  const idMatch = cleanText.match(idPattern);
  if (!idMatch) return { success: false, error: "❌ ID não detectado." };

  // 2. VALIDAÇÃO DE NOME (Mantido - Prioridade Máxima)
  const keywordsDestino = ["DESTINO", "DESTINATÁRIO", "FAVORECIDO", "RECEBEDOR", "BENEFICIÁRIO"];
  const nomesAutorizados = ["GUSTAVO SANTOS RIBEIRO", "GUSTAVO S RIBEIRO", "GUSTAVO S. RIBEIRO"];
  
  let nomeValido = false;
  for (const keyword of keywordsDestino) {
    if (cleanText.includes(keyword)) {
      const pos = cleanText.indexOf(keyword);
      const sub = cleanText.substring(pos, pos + 200);
      if (nomesAutorizados.some(n => sub.includes(n))) {
        nomeValido = true;
        break;
      }
    }
  }
  if (!nomeValido) return { success: false, error: "❌ Destinatário incorreto." };

  // 3. VALIDAÇÃO DE VALOR (Mantido)
  if (!cleanText.includes("10,00") && !cleanText.includes("10.00")) {
    return { success: false, error: "❌ Valor incorreto." };
  }

  // 4. VALIDAÇÃO DE DATA UNIVERSAL (Regex para qualquer formato de data)
  // Aceita: DD/MM/AAAA, DD-MM-AAAA, DD.MM.AAAA, DD/MM/AA, DD FEV AAAA
  const universalDatePattern = /(\d{2})[\/\-\.\s](?:\d{2}|[A-Z]{3,9})[\/\-\.\s](\d{2,4})/;
  const dateMatch = cleanText.match(universalDatePattern);
  
  if (!dateMatch) {
    return { success: false, error: "❌ Data não detectada ou inválida." };
  }

  return { success: true, idEncontrado: idMatch[0] };
};