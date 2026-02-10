export const validatePixReceipt = (ocrText) => {
  const cleanText = ocrText.toUpperCase().replace(/\n/g, ' ').replace(/\s+/g, ' ');
  
  // 1. VALIDAÇÃO DE ID (Mantido)
  const idPattern = /[A-Z0-9]{32}/;
  const idMatch = cleanText.match(idPattern);
  if (!idMatch) return { success: false, error: "❌ ID não detectado." };

  // 2. VALIDAÇÃO DE DATA (Regex Corrigida para alta precisão)
  // Procura por: DD/MM/AAAA ou DD FEV AAAA
  const datePattern = /(\d{2})[\/\-\.\s]{1,3}(?:\d{2}|[A-Z]{3,9})[\/\-\.\s]{1,3}(\d{2,4})/;
  const dateMatch = cleanText.match(datePattern);
  if (!dateMatch) return { success: false, error: "❌ Data não detectada ou inválida." };

  // 3. VALIDAÇÃO DE VALOR (R$ 10,00)
  if (!cleanText.includes("10,00") && !cleanText.includes("10.00")) {
    return { success: false, error: "❌ Valor incorreto." };
  }

  // 4. VALIDAÇÃO DE NOME (Filtro Rigoroso após Palavras-Chave)
  const keywords = ["DESTINO", "DESTINATÁRIO", "FAVORECIDO", "RECEBEDOR", "BENEFICIÁRIO"];
  const nomes = ["GUSTAVO SANTOS RIBEIRO", "GUSTAVO S RIBEIRO", "GUSTAVO S. RIBEIRO"];
  
  let nomeValido = false;
  for (const k of keywords) {
    if (cleanText.includes(k)) {
      const pos = cleanText.indexOf(k);
      const sub = cleanText.substring(pos, pos + 250); 
      if (nomes.some(n => sub.includes(n))) {
        nomeValido = true;
        break;
      }
    }
  }
  if (!nomeValido) return { success: false, error: "❌ Destinatário incorreto." };

  return { success: true, idEncontrado: idMatch[0] };
};