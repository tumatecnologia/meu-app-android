export const validatePixReceipt = (ocrText) => {
  const cleanText = ocrText.toUpperCase().replace(/\n/g, ' ').replace(/\s+/g, ' ');
  const idPattern = /[A-Z0-9]{32}/;
  const idMatch = cleanText.match(idPattern);
  if (!idMatch) return { success: false, error: "❌ ID não detectado." };

  const keywords = ["DESTINO", "DESTINATÁRIO", "FAVORECIDO", "RECEBEDOR", "BENEFICIÁRIO"];
  const nomes = ["GUSTAVO SANTOS RIBEIRO", "GUSTAVO S RIBEIRO", "GUSTAVO S. RIBEIRO"];
  let nomeValido = false;
  for (const k of keywords) {
    if (cleanText.includes(k)) {
      const p = cleanText.indexOf(k);
      const s = cleanText.substring(p, p + 200);
      if (nomes.some(n => s.includes(n))) { nomeValido = true; break; }
    }
  }
  if (!nomeValido) return { success: false, error: "❌ Destinatário incorreto." };

  if (!cleanText.includes("10,00") && !cleanText.includes("10.00")) return { success: false, error: "❌ Valor incorreto." };

  const temData = cleanText.includes("09") && (cleanText.includes("FEV") || cleanText.includes("/02/")) && cleanText.includes("2026");
  if (!temData) return { success: false, error: "❌ Data não detectada." };

  return { success: true, idEncontrado: idMatch[0] };
};
