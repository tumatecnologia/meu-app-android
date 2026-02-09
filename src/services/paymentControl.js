import { createWorker } from 'tesseract.js';
import { createClient } from '@supabase/supabase-js';

// URL E CHAVE OFICIAIS COM AJUSTES DE SEGURANÇA (CORS/SESSION)
const supabase = createClient(
  'https://npmdvkgsklkideqoriw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbWR2a2dnc2tsa2lkZXFvcml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzMyMDAsImV4cCI6MjA4NjE0OTIwMH0.y-X0NS-_9BV7RhtSUOteLhaUPnt8Tkf24NlUikR8Ifo',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

const PaymentControlService = {
  processarArquivo: async (file) => {
    try {
      const reader = new FileReader();
      const imagemData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      // Inicializa o leitor de imagem (Tesseract)
      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(imagemData);
      await worker.terminate();

      // Extrai o ID da transação ou gera um temporário
      const transactionID = text.toUpperCase().match(/([A-Z0-9]{15,})/)?.[0] || "ID_" + Date.now();

      // GRAVAÇÃO NO BANCO - Tabela 'ids' e Coluna 'contemo'
      const { data, error } = await supabase
        .from('ids')
        .insert([{ 
          contemo: `ID: ${transactionID} | DATA: ${new Date().toLocaleString('pt-BR')}` 
        }]);

      if (error) {
        console.error("Erro detalhado do Supabase:", error);
        throw error;
      }

      alert("✅ SUCESSO! Gravado no seu banco de dados.");
      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Erro no processamento:", error);
      // Se o erro for de rede (CORS), damos um aviso mais específico
      if (error.message && error.message.includes('fetch')) {
        alert("❌ Erro de CORS: O Supabase bloqueou a conexão. Verifique o painel 'Settings -> API'.");
      } else {
        alert("❌ Erro de conexão. Verifique se o site atualizou ou se o Supabase está online.");
      }
      return { valido: false };
    }
  }
};

export default PaymentControlService;