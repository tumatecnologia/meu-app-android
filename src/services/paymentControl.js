import { createWorker } from 'tesseract.js';
import { createClient } from '@supabase/supabase-js';

// Configuração do seu Supabase
const supabaseUrl = 'https://pydfytfjsnsvayzlyoxh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZGZ5dGZqc25zdmF5emx5b3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNjE2MDksImV4cCI6MjA1MDczNzYwOX0.Bv_vR7H1C3qPjD_XF-y1U-xP-kE-y1U-xP-kE-y1U-xP-kE'; 
const supabase = createClient(supabaseUrl, supabaseKey);

const PaymentControlService = {
  processarArquivo: async (file) => {
    try {
      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Limpeza geral do texto
      const cleanText = text.toUpperCase().replace(/\n/g, ' ').replace(/\s+/g, ' ');

      // 1. VALIDAÇÃO DE ID (Regex de 32 caracteres)
      const idPattern = /[A-Z0-9]{32}/;
      const idMatch = cleanText.match(idPattern);
      
      if (!idMatch) {
        return { valido: false, motivo: '❌ ID não encontrado no comprovante.' };
      }

      // 2. VALIDAÇÃO DE VALOR
      if (!cleanText.includes("10,00") && !cleanText.includes("10.00") && !cleanText.includes("1000")) {
        return { valido: false, motivo: '❌ Valor de R$ 10,00 não detectado.' };
      }

      // --- CORREÇÃO AQUI: Limpeza rigorosa do ID ---
      // .replace(/[^A-Z0-9]/g, '') remove qualquer coisa que não seja letra ou número
      const idFinal = idMatch[0].trim().replace(/[^A-Z0-9]/g, '');

      // 3. GRAVAÇÃO NA TABELA "ids" NO CAMPO "dado"
      const { error } = await supabase
        .from('ids') 
        .insert([{ 
          dado: idFinal 
        }]);

      if (error) {
        // Erro 23505 significa que o ID já existe no banco (duplicado)
        if (error.code === '23505') {
          return { valido: false, motivo: '❌ Este comprovante já foi utilizado.' };
        }
        console.error("Erro Supabase:", error.message);
        return { valido: false, motivo: '❌ Erro ao gravar no banco.' };
      }

      return { valido: true, id: idFinal };

    } catch (err) {
      console.error("Erro Geral:", err);
      return { valido: false, motivo: '❌ Falha no processamento.' };
    }
  }
};

export default PaymentControlService;
