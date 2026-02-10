import { createWorker } from 'tesseract.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pydfytfjsnsvayzlyoxh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZGZ5dGZqc25zdmF5emx5b3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNjE2MDksImV4cCI6MjA1MDczNzYwOX0.Bv_vR7H1C3qPjD_XF-y1U-xP-kE-y1U-xP-kE-y1U-xP-kE'; 
const supabase = createClient(supabaseUrl, supabaseKey);

const PaymentControlService = {
  processarArquivo: async (file) => {
    try {
      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      const cleanText = text.toUpperCase().replace(/\n/g, ' ').replace(/\s+/g, ' ');

      // 1. Busca o ID (32 caracteres)
      const idPattern = /[A-Z0-9]{32}/;
      const idMatch = cleanText.match(idPattern);
      
      if (!idMatch) return { valido: false, motivo: '❌ ID não encontrado.' };
      
      // 2. Valida Valor
      if (!cleanText.includes("10,00") && !cleanText.includes("10.00")) {
        return { valido: false, motivo: '❌ Valor de R$ 10,00 não detectado.' };
      }

      const idFinal = idMatch[0];

      // 3. Tenta gravar na tabela 'ids' no campo 'dado'
      // O Supabase vai negar se o ID já existir (Regra de Unique Key)
      const { error } = await supabase
        .from('ids') 
        .insert([{ dado: idFinal }]);

      if (error) {
        // Se o erro for de duplicidade (ID já registrado)
        if (error.code === '23505' || error.message.includes('unique')) {
          return { 
            valido: false, 
            motivo: '❌ Comprovante já utilizado. Por favor, realize um novo pagamento.' 
          };
        }
        return { valido: false, motivo: '❌ Erro ao validar no banco.' };
      }

      // Se chegou aqui, o ID é novo, foi gravado e as cartas serão liberadas
      return { valido: true, id: idFinal };

    } catch (err) {
      return { valido: false, motivo: '❌ Falha ao processar arquivo.' };
    }
  }
};

export default PaymentControlService;
