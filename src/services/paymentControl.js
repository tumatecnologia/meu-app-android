import { createWorker } from 'tesseract.js';

// URL E CHAVE OFICIAIS (Ajustadas com o 'kgg' e a chave correta)
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

      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(imagemData);
      await worker.terminate();

      const transactionID = text.toUpperCase().match(/([A-Z0-9]{15,})/)?.[0] || "ID_" + Date.now();
      const conteudoParaGravar = `ID: ${transactionID} | DATA: ${new Date().toLocaleString('pt-BR')}`;

      // ENVIO PARA A COLUNA 'dado'
      const response = await fetch(SUPABASE_URL, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ dado: conteudoParaGravar }) // Nome da coluna alterado aqui
      });

      if (!response.ok) {
        const erroTexto = await response.text();
        throw new Error(`Erro no Banco: ${response.status} - ${erroTexto}`);
      }

      alert("✅ SUCESSO! Gravado no banco de dados.");
      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Erro Final:", error);
      alert("❌ Falha na conexão ou coluna não encontrada. Verifique o Supabase.");
      return { valido: false };
    }
  }
};

export default PaymentControlService;