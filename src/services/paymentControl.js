import { createWorker } from 'tesseract.js';

export const processPaymentImage = async (file) => {
  try {
    const optimizedImage = await optimizeImageForOCR(file);
    const worker = await createWorker('por');
    const { data: { text } } = await worker.recognize(optimizedImage);
    await worker.terminate();

    const cleanText = text.toUpperCase().replace(/\s+/g, ' ');

    // --- LÓGICA DE DATA DINÂMICA (HOJE) ---
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    const anoCurto = String(ano).slice(-2);

    const hojeCompleto = `${dia}/${mes}/${ano}`;      // Ex: 07/02/2026
    const hojeCurto = `${dia}/${mes}/${anoCurto}`;   // Ex: 07/02/26
    const hojeSimples = `${dia}/${mes}`;             // Ex: 07/02

    // 1. REGRA DA DATA (Comparação com a data atual do sistema)
    const temDataHoje = cleanText.includes(hojeCompleto) || 
                       cleanText.includes(hojeCurto) || 
                       (cleanText.includes(hojeSimples) && cleanText.includes(String(ano)));

    if (!temDataHoje) {
      return { 
        valid: false, 
        details: `ESTE COMPROVANTE NÃO É DE HOJE (${hojeSimples}). POR FAVOR, USE UM PIX REALIZADO AGORA.` 
      };
    }

    // 2. REGRA: ID DE TRANSAÇÃO (Mínimo 15 caracteres, letras e números)
    const idMatch = cleanText.match(/[A-Z0-9]{15,}/);
    const transactionId = idMatch ? idMatch[0] : null;

    if (transactionId && /[A-Z]/.test(transactionId) && /[0-9]/.test(transactionId)) {
      const usedIds = JSON.parse(localStorage.getItem('used_pix_ids') || '[]');
      if (usedIds.includes(transactionId)) {
        return { valid: false, details: 'ESTE COMPROVANTE JÁ FOI UTILIZADO ANTES.' };
      }
    }

    // 3. REGRA: DESTINATÁRIO
    if (!cleanText.includes('GUSTAVO') || !cleanText.includes('RIBEIRO')) {
      return { valid: false, details: 'O DESTINATÁRIO DEVE SER GUSTAVO SANTOS RIBEIRO.' };
    }

    // 4. REGRA: VALOR (R$ 10,00)
    const matchValor = cleanText.match(/(\d+[,.]\d{2})/);
    if (matchValor) {
      const valor = parseFloat(matchValor[1].replace(',', '.'));
      if (valor < 10.00) return { valid: false, details: 'VALOR ABAIXO DE R$ 10,00.' };
    }

    // SUCESSO: SALVAR ID
    if (transactionId) {
      const usedIds = JSON.parse(localStorage.getItem('used_pix_ids') || '[]');
      usedIds.push(transactionId);
      localStorage.setItem('used_pix_ids', JSON.stringify(usedIds));
    }

    return { valid: true, details: 'PAGAMENTO APROVADO!' };

  } catch (error) {
    return { valid: false, details: 'ERRO AO LER IMAGEM. TENTE NOVAMENTE.' };
  }
};

async function optimizeImageForOCR(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width; canvas.height = img.height;
        ctx.filter = 'grayscale(100%) contrast(180%) brightness(100%)';
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
