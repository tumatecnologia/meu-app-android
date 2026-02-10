import { createWorker } from 'tesseract.js';

const SUPABASE_URL = 'https://npmdvkggsklkideqoriw.supabase.co/rest/v1/ids';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbWR2a2dnc2tsa2lkZXFvcml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzMyMDAsImV4cCI6MjA4NjE0OTIwMH0.y-X0NS-_9BV7RhtSUOteLhaUPnt8Tkf24NlUikR8Ifo';

const PaymentControlService = {
  processarArquivo: async (file) => {
    try {
      if (!file.type.startsWith('image/')) {
        alert("❌ Formato não aceito! Por favor tire print do comprovante.");
        return { valido: false };
      }

      const reader = new FileReader();
      const imagemData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(imagemData);
      await worker.terminate();

      const textoLimpo = text.toUpperCase();

      // 1. EXTRAÇÃO DO ID (NÃO MODIFICADO)
      const transactionID = textoLimpo.match(/([A-Z0-9]{15,})/)?.[0];
      
      if (!transactionID) {
        alert("❌ ID não encontrado. Use uma imagem mais clara.");
        return { valido: false };
      }

      // 2. VERIFICAÇÃO DE DUPLICIDADE (NÃO MODIFICADO)
      const checkResponse = await fetch(`${SUPABASE_URL}?dado=ilike.*${transactionID}*`, {
        method: 'GET',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      const existingRecords = await checkResponse.json();
      if (existingRecords.length > 0) {
        alert("❌ COMPROVANTE JÁ UTILIZADO!");
        return { valido: false };
      }

      // 3. NOVA REGRA: VALIDAÇÃO DE BENEFICIÁRIO (GUSTAVO)
      // Verifica se após as palavras-chave aparece o nome do Gustavo
      const regexNome = /(?:PARA|BENEFICIÁRIO|BENEFICIARIO|DESTINO|DESTINATÁRIO|DESTINATARIO|RECEBEDOR|FAVORECIDO)\s*:?\s*(GUSTAVO SANTOS RIBEIRO|GUSTAVO S\.?\s?RIBEIRO)/i;
      
      if (!regexNome.test(textoLimpo)) {
        alert("❌ DESTINATÁRIO INCORRETO!\n\nO comprovante deve ser destinado a Gustavo Santos Ribeiro.");
        return { valido: false };
      }

      // 4. VALIDAÇÃO DE VALOR
      const regexValor = /(?:R\$|VALOR|PAGO)?\s?(\d{1,3}(?:\.\d{3})*,\d{2})/i;
      const valorMatch = textoLimpo.match(regexValor);
      let valorComprovante = 0;

      if (valorMatch) {
        valorComprovante = parseFloat(valorMatch[1].replace(/\./g, '').replace(',', '.'));
      }

      if (valorComprovante < 10.00) {
        const valorExibicao = valorComprovante > 0 ? `R$ ${valorComprovante.toFixed(2)}` : "Não detectado";
        alert(`❌ VALOR INSUFICIENTE OU NÃO LIDO!\n\nValor detectado: ${valorExibicao}\nValor mínimo: R$ 10,00`);
        return { valido: false };
      }

      // 5. REGISTRO (BANCO DE DADOS - NÃO MODIFICADO)
      const conteudoParaGravar = `ID: ${transactionID} | VALOR: R$ ${valorComprovante.toFixed(2)} | REGISTRO: ${new Date().toLocaleString('pt-BR')}`;
      
      const response = await fetch(SUPABASE_URL, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ dado: conteudoParaGravar })
      });

      if (!response.ok) throw new Error("Erro ao gravar");

      alert("✅ SUCESSO! Pagamento validado.");
      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Erro Final:", error);
      alert("❌ Falha no processamento.");
      return { valido: false };
    }
  }
};

export default PaymentControlService;