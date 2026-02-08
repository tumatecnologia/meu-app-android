import { createWorker } from 'tesseract.js';
import { createClient } from '@supabase/supabase-js';

// Configuração Gustavo Santos Ribeiro
const supabase = createClient(
  'https://npmdvkgsklklineqoriw.supabase.co',
  'sb_publicable_qBUSPrtnhIKTOPh7VLVig_A2yakWvU'
);

const PaymentControlService = {
  processarArquivo: async (file) => {
    try {
      // 1. OCR - Leitura do comprovante
      const reader = new FileReader();
      const imagemData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(imagemData);
      await worker.terminate();

      // 2. Extração do ID (busca 15 ou mais caracteres alfanuméricos)
      const transactionID = text.toUpperCase().match(/([A-Z0-9]{15,})/)?.[0] || "ID_" + Date.now();

      // 3. Gravação no Banco (Coluna: contemo)
      // O campo 'id' (int8) o banco gera sozinho.
      const { error } = await supabase
        .from('ids')
        .insert([{ 
          contemo: `ID: ${transactionID} | DATA: ${new Date().toLocaleString('pt-BR')}` 
        }]);

      if (error) throw error;

      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Erro na operação:", error);
      // Se o banco falhar, não travamos o cliente
      return { valido: true, idEncontrado: "OFFLINE_OK" };
    }
  }
};

export default PaymentControlService;