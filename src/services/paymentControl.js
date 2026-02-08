import { createWorker } from 'tesseract.js';

const API_URL = 'https://meu-cofre-pix.onrender.com/ids_utilizados'; // Ajuste para sua URL de produção se necessário

const PaymentControlService = {
  processarArquivo: async (file) => {
    console.log("🔍 Verificando ID no Banco de Dados Central...");
    
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

      // 2. CONSULTA AO COFRE (Servidor)
      // Buscamos no servidor se esse ID já existe
      const resposta = await fetch(`${API_URL}?id=${transactionID}`);
      const idEncontrado = await resposta.json();

      if (idEncontrado.length > 0) {
        return {
          valido: false,
          motivo: "Recusado - Este comprovante ja foi utilizado! Por favor faça um novo pagamento!"
        };
      }

      // 3. REGISTRO NO COFRE
      // Se chegou aqui, o ID é inédito. Vamos salvar para ninguém usar de novo.
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: transactionID,
          dataRegistro: new Date().toISOString()
        })
      });

      return {
        valido: true,
        idEncontrado: transactionID,
        mensagem: "ID Validado e Registrado!"
      };

    } catch (error) {
      console.error("Erro na validação centralizada:", error);
      return { valido: false, motivo: "Erro ao conectar ao servidor de segurança." };
    }
  }
};

export default PaymentControlService;
