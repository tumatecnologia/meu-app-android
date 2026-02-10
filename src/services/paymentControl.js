import { createWorker } from 'tesseract.js';
import { createClient } from '@supabase/supabase-js';

// Sua configuração original do Supabase
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

      // 1. VALIDAÇÃO DE ID (Padrão 32 caracteres do seu Banco)
      const idPattern = /[A-Z0-9]{32}/;
      const idMatch = cleanText.match(idPattern);
      
      if (!idMatch) {
        return { valido: false, motivo: '❌ ID não encontrado no comprovante.' };
      }

      // 2. VALIDAÇÃO DE VALOR (R$ 10,00)
      if (!cleanText.includes("10,00") && !cleanText.includes("10.00") && !cleanText.includes("1000")) {
        return { valido: false, motivo: '❌ Valor de R$ 10,00 não detectado.' };
      }

      const idFinal = idMatch[0];

      // 3. GRAVAÇÃO NO BANCO (SUPABASE)
      // Ajustado para o nome da sua tabela e coluna de ID
      const { data, error } = await supabase
        .from('payments') 
        .insert([{ 
          pix_id: idFinal, 
          status: 'completed',
          amount: 10.00,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        // Se o ID já existir, o banco bloqueia (23505 = unique violation)
        if (error.code === '23505') {
          return { valido: false, motivo: '❌ Este comprovante já foi utilizado.' };
        }
        console.error("Erro Supabase:", error.message);
        return { valido: false, motivo: '❌ Erro ao salvar no banco.' };
      }

      return { valido: true, id: idFinal };

    } catch (err) {
      console.error("Erro no Processamento:", err);
      return { valido: false, motivo: '❌ Falha ao ler imagem.' };
    }
  }
};

export default PaymentControlService;
