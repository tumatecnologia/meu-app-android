export const validatePayment = async (data) => {
  const minAmount = 10.0;
  const amount = parseFloat(data.amount);
  const texto = data.fullText ? data.fullText.toUpperCase().replace(/\s+/g, ' ') : "";
  const nomeObrigatorio = "GUSTAVO SANTOS RIBEIRO";

  const agora = new Date().getTime();
  const noventaDiasMs = 90 * 24 * 60 * 60 * 1000;
  let historico = JSON.parse(localStorage.getItem('pix_history_v2') || '[]');
  historico = historico.filter(item => (agora - item.timestamp) < noventaDiasMs);

  // 1. Erro de Duplicidade
  if (historico.some(item => item.id === data.transactionId)) {
    return { valid: false, details: "ID JÁ USADO: Este comprovante já foi validado antes." };
  }

  // 2. Erro de Valor
  if (amount < minAmount) {
    return { valid: false, details: `VALOR BAIXO: Identificado R$ ${amount.toFixed(2)}, mas o mínimo é R$ 10,00.` };
  }

  // 3. Erro de Nome (Aumentamos o alcance para 100 caracteres)
  const termosDestino = ["DESTINATARIO", "DESTINATÁRIO", "RECEBEDOR", "FAVORECIDO", "PARA", "DESTINO", "BENEFICIARIO", "BENEFICIÁRIO", "CREDITADO"];
  
  let nomeConfirmado = false;
  let termoEncontrado = "";

  for (const termo of termosDestino) {
    const posicao = texto.indexOf(termo);
    if (posicao !== -1) {
      termoEncontrado = termo;
      const trecho = texto.substring(posicao, posicao + 100);
      // Procuramos apenas por partes do nome para evitar erros de leitura (OCR)
      if (trecho.includes("GUSTAVO") || trecho.includes("SANTOS") || trecho.includes("RIBEIRO")) {
        nomeConfirmado = true;
        break;
      }
    }
  }

  if (!nomeConfirmado) {
    return { 
      valid: false, 
      details: termoEncontrado 
        ? `DESTINATÁRIO INCORRETO: Identificamos o termo "${termoEncontrado}", mas seu nome não está logo após ele.` 
        : "DADOS NÃO LOCALIZADOS: Não conseguimos ler o destinatário. Tente uma foto mais clara." 
    };
  }

  historico.push({ id: data.transactionId, timestamp: agora });
  localStorage.setItem('pix_history_v2', JSON.stringify(historico));

  return { valid: true, amount: amount.toFixed(2), details: "Pagamento confirmado!" };
};
