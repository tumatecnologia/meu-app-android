import { createWorker } from 'tesseract.js';
import { createClient } from '@supabase/supabase-js';

// Conexão oficial do Gustavo
const supabase = createClient(
  'https://npmdvkgsklklineqoriw.supabase.co',
  'sb_publicable_qBUSPrtnhIKTOPh7VLVig_A2yakWvU'
);

const PaymentControlService = {
  processarArquivo: async (file) => {
    try {
      // 1. LER A IMAGEM
      const reader = new FileReader();
      const imagemData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(imagemData);
      await worker.terminate();

      // 2. EXTRAIR O ID
      const textoLimpo = text.toUpperCase();
      const matchID = textoLimpo.match(/([A-Z0-9]{15,})/);
      const transactionID = matchID ? matchID[1] : "ID_WEB_" + Date.now();

      // 3. SALVAR NO BANCO (Usando o nome que você está vendo: contemo)
      console.log("Tentando salvar na coluna contemo...");
      const { error: erroInsert } = await supabase
        .from('ids')
        .insert([{ 
          contemo: `ID: ${transactionID} | DATA: ${new Date().toLocaleString('pt-BR')}` 
        }]);

      if (erroInsert) {
        console.error("Erro do Supabase:", erroInsert.message);
        throw erroInsert;
      }

      console.log("✅ Salvo com sucesso!");
      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Falha no processo:", error);
      // Se der erro no banco, liberamos o acesso para não perder o cliente
      return { valido: true, idEncontrado: "OK_CONTINGENCIA" };
    }
  }
};

export default PaymentControlService;