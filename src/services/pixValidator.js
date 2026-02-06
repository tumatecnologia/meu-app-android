export const validatePayment = async (data) => {
  const minAmount = 10.0;
  const amount = parseFloat(data.amount);
  const texto = data.fullText ? data.fullText.toUpperCase().replace(/\s+/g, ' ') : "";
  const nomeObrigatorio = "GUSTAVO SANTOS RIBEIRO";

  // Item 4: Regra dos 90 dias real (Não limpa ao atualizar)
  const agora = new Date().getTime();
  const noventaDiasMs = 90 * 24 * 60 * 60 * 1000;
  let historico = JSON.parse(localStorage.getItem('pix_history_v2') || '[]');
  
  // Filtra APENAS o que expirou. O que é novo permanece.
  historico = historico.filter(item => (agora - item.timestamp) < noventaDiasMs);

  if (historico.some(item => item.id === data.transactionId)) {
    return { valid: false, details: "Este comprovante já foi utilizado." };
  }

  // Item 2: Lista exaustiva de palavras-chave
  const termosDestino = [
    "DESTINATARIO", "DESTINATÁRIO", "RECEBEDOR", "FAVORECIDO", 
    "PARA", "DESTINO", "BENEFICIARIO", "BENEFICIÁRIO", "CREDITADO"
  ];
  
  let nomeConfirmado = false;
  for (const termo of termosDestino) {
    const posicao = texto.indexOf(termo);
    if (posicao !== -1) {
      // Analisa os 80 caracteres após a palavra-chave
      const trecho = texto.substring(posicao, posicao + 80);
      if (trecho.includes("GUSTAVO") && trecho.includes("RIBEIRO")) {
        nomeConfirmado = true;
        break;
      }
    }
  }

  if (!nomeConfirmado) {
    return { valid: false, details: "Comprovante inválido: Destinatário deve ser GUSTAVO SANTOS RIBEIRO." };
  }

  if (amount < minAmount) {
    return { valid: false, details: `Valor insuficiente (Mínimo R$ 10,00).` };
  }

  // Grava o novo ID no histórico
  historico.push({ id: data.transactionId, timestamp: agora });
  localStorage.setItem('pix_history_v2', JSON.stringify(historico));

  return { valid: true, amount: amount.toFixed(2), details: "Pagamento confirmado!" };
};
