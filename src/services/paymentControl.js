import { createWorker } from 'tesseract.js';

// URL CORRIGIDA (com o 'kgg') e CHAVE OFICIAL (extraídas dos seus prints)
const SUPABASE_URL = 'https://npmdvkggsklkideqoriw.supabase.co/rest/v1/ids';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbWR2a2dnc2tsa2lkZXFvcml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzMyMDAsImV4cCI6MjA4NjE0OTIwMH0.y-X0NS-_9BV7RhtSUOteLhaUPnt8Tkf24NlUikR8Ifo';

const PaymentControlService = {
  processarArquivo: async (file) => {
    try {
      const reader = new FileReader();
      const imagemData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      // 1. Inicia leitura da imagem
      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(imagemData);
      await worker.terminate();

      // 2. Extrai o ID
      const transactionID = text.toUpperCase().match(/([A-Z0-9]{15,})/)?.[0] || "ID_" + Date.now();
      const conteudoParaGravar = `ID: ${transactionID} | DATA: ${new Date().toLocaleString('pt-BR')}`;

      // 3. ENVIO DIRETO (Contorna erros de biblioteca e CORS)
      const response = await fetch(SUPABASE_URL, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ contemo: conteudoParaGravar })
      });

      if (!response.ok) {
        const erroTexto = await response.text();
        throw new Error(`Erro no Banco: ${response.status} - ${erroTexto}`);
      }

      alert("✅ SUCESSO! Gravado no banco de dados.");
      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Erro Final:", error);
      alert("❌ Falha na conexão. Verifique o console para mais detalhes.");
      return { valido: false };
    }
  }
};

export default PaymentControlService;