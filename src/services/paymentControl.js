import { createWorker } from 'tesseract.js';

// URL E CHAVE OFICIAIS (Verificadas nos seus prints)
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
      const transactionID = text.toUpperCase().match(/([A-Z0-9]{15,})/)?.[0];
      
      if (!transactionID) {
        alert("❌ Não foi possível ler o ID do comprovante. Tente tirar uma foto melhor.");
        return { valido: false };
      }

      // 3. VERIFICAÇÃO DE DUPLICIDADE (Consulta antes de gravar)
      // Buscamos na coluna 'dado' se o texto do transactionID já existe
      const checkResponse = await fetch(`${SUPABASE_URL}?dado=ilike.*${transactionID}*`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        }
      });

      const existingRecords = await checkResponse.json();

      if (existingRecords.length > 0) {
        alert("❌ COMPROVANTE INVÁLIDO!\n\nEste comprovante já foi utilizado anteriormente ou o ID já consta no banco de dados.\n\nPor favor, realize um novo pagamento.");
        return { valido: false, duplicado: true };
      }

      // 4. Se não existe, PROSSEGUE COM A GRAVAÇÃO
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

      if (!response.ok) {
        throw new Error(`Erro ao gravar: ${response.status}`);
      }

      alert("✅ SUCESSO! Comprovante validado e registrado.");
      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Erro Final:", error);
      alert("❌ Ocorreu um erro ao verificar o comprovante. Tente novamente.");
      return { valido: false };
    }
  }
};

export default PaymentControlService;