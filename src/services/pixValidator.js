export const validatePayment = async (data) => {
  const minAmount = 10.0;
  const amount = parseFloat(data.amount);
  const agora = new Date().getTime();
  const noventaDiasEmMs = 90 * 24 * 60 * 60 * 1000;
  
  const texto = data.fullText ? data.fullText.toUpperCase().replace(/\n/g, " ") : "";
  const meuNome = "GUSTAVO SANTOS RIBEIRO";

  let historicoRaw = JSON.parse(localStorage.getItem('pix_history_v2') || '[]');
  let historicoFiltrado = historicoRaw.filter(item => (agora - item.timestamp) < noventaDiasEmMs);

  if (historicoFiltrado.some(item => item.id === data.transactionId)) {
    return { valid: false, details: "Este comprovante já foi utilizado." };
  }

  if (amount < minAmount) {
    return { valid: false, details: `Valor R$ ${amount.toFixed(2)} abaixo do mínimo.` };
  }

  // LISTA AMPLIADA: Incluímos DESTINO e CREDITADO
  const termosDestino = ["PARA", "FAVORECIDO", "DESTINATARIO", "DESTINATÁRIO", "RECEBEDOR", "DESTINO", "CREDITADO"];
  let encontrouSeuNomeNoLugarCerto = false;

  termosDestino.forEach(termo => {
    const posicaoTermo = texto.indexOf(termo);
    if (posicaoTermo !== -1) {
      // Olhamos os 60 caracteres após a palavra-chave (Destino, Para, etc)
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

  historicoFiltrado.push({ id: data.transactionId, timestamp: agora });
  localStorage.setItem('pix_history_v2', JSON.stringify(historicoFiltrado));

  return {
    valid: true,
    amount: amount.toFixed(2),
    payeeName: meuNome,
    details: "Pagamento confirmado com sucesso!"
  };
};
