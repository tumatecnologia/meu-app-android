export const validatePix = (ocrText) => {
  const cleanText = ocrText.toUpperCase().replace(/\n/g, ' ').replace(/\s+/g, ' ');
  const idPattern = /[A-Z0-9]{32}/;
  const idMatch = cleanText.match(idPattern);
  
  if (!idMatch) return { success: false, error: "❌ ID não encontrado." };
  if (!cleanText.includes("5,00") && !cleanText.includes("5.00")) return { success: false, error: "❌ Valor incorreto." };

  return { success: true, idEncontrado: idMatch[0] };
};
