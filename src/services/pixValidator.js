export const validatePayment = async (data) => {
  const minAmount = 10.0;
  const amount = parseFloat(data.amount);
  const agora = new Date().getTime();
  const noventaDiasEmMs = 90 * 24 * 60 * 60 * 1000;
  
  // Limpeza do texto para busca precisa
  const texto = data.fullText ? data.fullText.toUpperCase().replace(/\n/g, " ") : "";
  
  // 1. Histórico de 90 dias
  let historicoRaw = JSON.parse(localStorage.getItem('pix_history_v2') || '[]');
  let historicoFiltrado = historicoRaw.filter(item => (agora - item.timestamp) < noventaDiasEmMs);

  if (historicoFiltrado.some(item => item.id === data.transactionId)) {
    return { valid: false, details: "Comprovante já utilizado." };
  }

  // 2. Validação de Valor
  if (amount < minAmount) {
    return { valid: false, details: `Valor R$ ${amount.toFixed(2)} abaixo do mínimo.` };
  }

  // 3. LÓGICA DE PROXIMIDADE (A "Mira")
  const termosDestino = ["PARA", "FAVORECIDO", "DESTINATARIO", "DESTINATÁRIO", "RECEBEDOR"];
  let encontrouSeuNomeNoLugarCerto = false;

  termosDestino.forEach(termo => {
    const posicaoTermo = texto.indexOf(termo);
    if (posicaoTermo !== -1) {
      // Pega os 60 caracteres logo APÓS a palavra chave
      const trechoDestinatario = texto.substring(posicaoTermo, posicaoTermo + 60);
      if (trechoDestinatario.includes("GUSTAVO") || trechoDestinatario.includes("RIBEIRO")) {
        encontrouSeuNomeNoLugarCerto = true;
      }
    }
  });

  if (!encontrouSeuNomeNoLugarCerto) {
    return { 
      valid: false, 
      details: "Destinatário inválido. O PIX deve ser para GUSTAVO SANTOS RIBEIRO." 
    };
  }

  // 4. Sucesso: Grava e Libera
  historicoFiltrado.push({ id: data.transactionId, timestamp: agora });
  localStorage.setItem('pix_history_v2', JSON.stringify(historicoFiltrado));

  return {
    valid: true,
    amount: amount.toFixed(2),
    payeeName: "GUSTAVO SANTOS RIBEIRO",
    details: "Pagamento validado com sucesso!"
  };
};
