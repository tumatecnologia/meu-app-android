import { createWorker } from 'tesseract.js';
import { createClient } from '@supabase/supabase-js';

// Configuração do seu Novo Cofre Eterno (Supabase)
const supabase = createClient(
  'https://npmdvkgsklklineqoriw.supabase.co',
  'sb_publicable_qBUSPrtnhIKTOPh7VLVig_A2yakWvU'
);

const PaymentControlService = {
  processarArquivo: async (file) => {
    console.log("🔍 Verificando ID no Banco de Dados Supabase...");
    
    try {
      // 1. Extrair texto da imagem (OCR)
      const reader = new FileReader();
      const imagemData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(imagemData);
      await worker.terminate();

      const texto = text.toUpperCase();
      
      // Busca o ID de Transação (ex: E18236120...)
      const matchID = texto.match(/ID[\s\D]+([A-Z0-9]{15,})/) || texto.match(/([A-Z0-9]{20,})/);
      const transactionID = matchID ? matchID[1] : null;

      if (!transactionID) {
        return { valido: false, motivo: "ID da transação não localizado. Tire uma foto mais clara." };
      }

      // 2. CONSULTA AO COFRE (Supabase)
      // Verificamos se esse ID já existe na coluna "conteudo"
      const { data: idExistente, error: errorBusca } = await supabase
        .from('ids')
        .select('*')
        .ilike('conteudo', `%${transactionID}%`);

      if (idExistente && idExistente.length > 0) {
        return {
          valido: false,
          motivo: "Recusado - Este comprovante já foi utilizado!"
        };
      }

      // 3. REGISTRO NO COFRE
      // Se é inédito, salvamos no banco para ninguém usar de novo.
      const { error: errorInsert } = await supabase
        .from('ids')
        .insert([{ 
            conteudo: `ID_VALIDADO: ${transactionID} | Data: ${new Date().toLocaleString('pt-BR')}` 
        }]);

      if (errorInsert) throw errorInsert;

      return {
        valido: true,
        idEncontrado: transactionID,
        mensagem: "Sucesso! Comprovante aceito."
      };

    } catch (error) {
      console.error("Erro na validação Supabase:", error);
      // Plano B: Se o banco falhar, vamos liberar para não travar o cliente
      return { valido: true, idEncontrado: "OFFLINE_OK", mensagem: "Validado (Modo Offline)" };
    }
  }
};

export default PaymentControlService;