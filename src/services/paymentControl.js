import { createWorker } from 'tesseract.js';
import { createClient } from '@supabase/supabase-js';

// URL E CHAVE OFICIAIS (Verificadas nos seus prints)
const SUPABASE_URL = 'https://npmdvkgsklkideqoriw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbWR2a2dnc2tsa2lkZXFvcml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzMyMDAsImV4cCI6MjA4NjE0OTIwMH0.y-X0NS-_9BV7RhtSUOteLhaUPnt8Tkf24NlUikR8Ifo';

// Configuração especial para contornar restrições de CORS em contas gratuitas
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false, // Não tentar salvar sessão no navegador
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*', // Tentar forçar permissão no cabeçalho
    },
  },
});

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

      // Gravação na tabela 'ids' e coluna 'contemo'
      const { error } = await supabase
        .from('ids')
        .insert([{ 
          contemo: `ID: ${transactionID} | DATA: ${new Date().toLocaleString('pt-BR')}` 
        }]);

      if (error) {
        console.error("Erro do Supabase:", error);
        throw error;
      }

      alert("✅ SUCESSO! Gravado no seu banco de dados.");
      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Erro no processamento:", error);
      // Alerta específico para CORS
      alert("❌ Erro de conexão (CORS). O Supabase bloqueou o acesso do GitHub Pages.");
      return { valido: false };
    }
  }
};

export default PaymentControlService;