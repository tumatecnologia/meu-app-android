import { createWorker } from 'tesseract.js';

const SUPABASE_URL = 'https://npmdvkggsklkideqoriw.supabase.co/rest/v1/ids';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbWR2a2dnc2tsa2lkZXFvcml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzMyMDAsImV4cCI6MjA4NjE0OTIwMH0.y-X0NS-_9BV7RhtSUOteLhaUPnt8Tkf24NlUikR8Ifo';

const PaymentControlService = {
  processarArquivo: async (file) => {
    try {
      // 1. VERIFICAÇÃO DE FORMATO (Bloqueia PDF e outros)
      if (!file.type.startsWith('image/')) {
        alert("❌ Formato não aceito! Por favor tire print do comprovante e envie a imagem (JPG/PNG).");
        return { valido: false };
      }

      // 2. PROCESSAMENTO DE IMAGEM
      const reader = new FileReader();
      const imagemData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(imagemData);
      await worker.terminate();

      const transactionID = text.toUpperCase().match(/([A-Z0-9]{15,})/)?.[0];
      
      if (!transactionID) {
        alert("❌ Não lemos o ID. Dica: Tente tirar uma foto mais clara e nítida do comprovante!");
        return { valido: false };
      }

      // 3. VERIFICAÇÃO DE DUPLICIDADE
      const checkResponse = await fetch(`${SUPABASE_URL}?dado=ilike.*${transactionID}*`, {
        method: 'GET',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });

      const existingRecords = await checkResponse.json();
      if (existingRecords.length > 0) {
        alert("❌ COMPROVANTE JÁ UTILIZADO!");
        return { valido: false, duplicado: true };
      }

      // 4. GRAVAÇÃO
      const conteudoParaGravar = `ID: ${transactionID} | DATA: ${new Date().toLocaleString('pt-BR')}`;
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

      alert("✅ SUCESSO! Validado e registrado.");
      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Erro Final:", error);
      alert("❌ Erro no processamento. Tente novamente com uma imagem clara.");
      return { valido: false };
    }
  }
};

export default PaymentControlService;