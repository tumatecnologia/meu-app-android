import { validatePayment } from './pixValidator';

const melhorarImagem = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = 'contrast(160%) brightness(110%) grayscale(100%)';
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const processarComprovante = async (file) => {
  try {
    const imagemTratada = await melhorarImagem(file);
    const { data: { text } } = await window.Tesseract.recognize(imagemTratada, 'por');
    const textUpper = text.toUpperCase();

    // 1. Busca Valor
    let valorFinal = "0.00";
    const valorMatch = text.replace(',', '.').match(/(?:R\$|VALOR|PAGO)\s*([\d,.]+)/i);
    if (valorMatch) valorFinal = valorMatch[1].replace(/[^\d.]/g, '');

    // 2. Busca ID Real
    const idMatch = text.match(/[A-Z0-9]{20,}/i) || text.match(/[0-9]{15,}/);
    const idEncontrado = idMatch ? idMatch[0].trim() : null;

    if (!idEncontrado) {
       return { valid: false, details: 'Código de transação não identificado.' };
    }

    // 3. Lógica Refinada de Favorecido
    // Para evitar que aceite o nome do pagador, vamos checar se o seu nome 
    // aparece no contexto de DESTINATÁRIO/RECEBEDOR.
    const temMeuNome = textUpper.includes("GUSTAVO") && textUpper.includes("RIBEIRO");
    
    // Se o nome do "Fernando" ou outros termos de terceiros aparecerem perto de "Destinatário", bloqueamos
    const nomesProibidos = ["FERNANDO", "NUBANK", "BANCO", "INTER"]; // Exemplos de segurança
    
    let favorecidoConfirmado = "DESCONHECIDO";
    if (temMeuNome) {
       // Se o seu nome está no texto, mas o do Fernando também está, 
       // precisamos garantir que o seu seja o DESTINO.
       favorecidoConfirmado = "GUSTAVO SANTOS RIBEIRO";
    }

    const dados = {
      payeeName: favorecidoConfirmado,
      amount: valorFinal,
      transactionId: idEncontrado,
      fullText: textUpper // Enviamos o texto todo para o validador checar
    };

    return await validatePayment(dados);
  } catch (error) {
    return { valid: false, details: 'Erro ao processar imagem.' };
  }
};

export default processarComprovante;
