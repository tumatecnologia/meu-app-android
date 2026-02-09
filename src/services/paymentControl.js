import { createWorker } from 'tesseract.js';
import { createClient } from '@supabase/supabase-js';

// URL CORRIGIDA (sem o 'n') e CHAVE OFICIAL
const supabase = createClient(
  'https://npmdvkgsklkideqoriw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbWR2a2dnc2tsa2lkZXFvcml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzMyMDAsImV4cCI6MjA4NjE0OTIwMH0.y-X0NS-_9BV7RhtSUOteLhaUPnt8Tkf24NlUikR8Ifo'
);

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

      // USANDO 'contemo' QUE É O NOME CERTO DA SUA COLUNA
      const { error } = await supabase
        .from('ids')
        .insert([{ 
          contemo: `ID: ${transactionID} | DATA: ${new Date().toLocaleString('pt-BR')}` 
        }]);

      if (error) throw error;

      alert("✅ SUCESSO! Gravado no Supabase.");
      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão. Verifique se o site atualizou.");
      return { valido: false };
    }
  }
};

export default PaymentControlService;