export const validatePixReceipt = (ocrText) => {
  const cleanText = ocrText.toUpperCase();
  
  // 1. VALIDAÇÃO DE ID (Já existente)
  const idPattern = /[A-Z0-9]{32}/;
  const idEncontrado = cleanText.match(idPattern);
  if (!idEncontrado) return { success: false, error: "ID da transação não encontrado." };

  // 2. VALIDAÇÃO DE DATA (Hoje ou Ontem)
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);
  
  const formatarData = (d) => d.toLocaleDateString('pt-BR');
  const dataHoje = formatarData(hoje);
  const dataOntem = formatarData(ontem);
  
  if (!cleanText.includes(dataHoje) && !cleanText.includes(dataOntem)) {
    return { success: false, error: "Data do comprovante inválida ou antiga." };
  }

  // 3. VALIDAÇÃO DE VALOR (R$ 10,00)
  if (!cleanText.includes("10,00")) {
    return { success: false, error: "Valor incorreto. A consulta custa R$ 10,00." };
  }

  // 4. VALIDAÇÃO DE NOME (O NOVO FILTRO)
  const nomesAutorizados = [
    "GUSTAVO SANTOS RIBEIRO",
    "GUSTAVO S RIBEIRO"
  ];

  const keywordsDestino = ["DESTINO", "DESTINATÁRIO", "FAVORECIDO", "RECEBEDOR", "BENEFICIÁRIO"];
  
  // Verifica se algum dos nomes autorizados aparece no texto
  // Para maior precisão, verificamos se ele aparece após uma das keywords ou no contexto geral do recebedor
  const nomeValido = nomesAutorizados.some(nome => cleanText.includes(nome));

  if (!nomeValido) {
    return { success: false, error: "Destinatário do PIX incorreto. Verifique o favorecido." };
  }

  return { 
    success: true, 
    idEncontrado: idEncontrado[0],
    msg: "Pagamento validado com sucesso!" 
  };
};
