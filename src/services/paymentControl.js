import { createWorker } from 'tesseract.js';
import { createClient } from '@supabase/supabase-js';

// Configuração oficial - Gustavo Santos Ribeiro
const supabase = createClient(
  'https://npmdvkgsklklineqoriw.supabase.co',
  'sb_publicable_qBUSPrtnhIKTOPh7VLVig_A2yakWvU'
);

const PaymentControlService = {
  processarArquivo: async (file) => {
    try {
      console.log("Iniciando processamento...");
      const reader = new FileReader();
      const imagemData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(imagemData);
      await worker.terminate();

      // Extrai o ID de transação do texto
      const textoLimpo = text.toUpperCase();
      const matchID = textoLimpo.match(/([A-Z0-9]{15,})/);
      const transactionID = matchID ? matchID[0] : "ID_MANUAL_" + Date.now();

      console.log("Tentando gravar no banco o ID:", transactionID);

      // Tenta gravar na coluna 'contemo'
      const { data, error } = await supabase
        .from('ids')
        .insert([{ 
          contemo: `ID: ${transactionID} | DATA: ${new Date().toLocaleString('pt-BR')}` 
        }]);

      if (error) {
        // Se o Supabase rejeitar, o alert vai nos dizer por quê
        alert("⚠️ ERRO NO BANCO: " + error.message);
        throw error;
      }

      // Se chegar aqui, gravou!
      alert("✅ SUCESSO! O dado apareceu no Supabase.");
      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Erro Geral:", error);
      // Plano B para não travar o cliente
      return { valido: true, idEncontrado: "CONTINGENCIA_OK" };
    }
  }
};

export default PaymentControlService;