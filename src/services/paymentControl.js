import { createWorker } from 'tesseract.js';

const SUPABASE_URL = 'https://npmdvkggsklkideqoriw.supabase.co/rest/v1/ids';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbWR2a2dnc2tsa2lkZXFvcml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzMyMDAsImV4cCI6MjA4NjE0OTIwMH0.y-X0NS-_9BV7RhtSUOteLhaUPnt8Tkf24NlUikR8Ifo';

const PaymentControlService = {
  processarArquivo: async (file) => {
    try {
      if (!file.type.startsWith('image/')) {
        alert("❌ Formato não aceito! Por favor tire print do comprovante.");
        return { valido: false };
      }

      const reader = new FileReader();
      const imagemData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(imagemData);
      await worker.terminate();

      const textoLimpo = text.toUpperCase();

      // 1. EXTRAÇÃO DO ID (NÃO MODIFICADO)
      const transactionID = textoLimpo.match(/([A-Z0-9]{15,})/)?.[0];
      
      if (!transactionID) {
        alert("❌ ID não encontrado. Use uma imagem mais clara.");
        return { valido: false };
      }

      // 2. VERIFICAÇÃO DE DUPLICIDADE (NÃO MODIFICADO)
      const checkResponse = await fetch(`${SUPABASE_URL}?dado=ilike.*${transactionID}*`, {
        method: 'GET',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      const existingRecords = await checkResponse.json();
      if (existingRecords.length > 0) {
        alert("❌ COMPROVANTE JÁ UTILIZADO!");
        return { valido: false };
      }

      // 3. NOVA REGRA: VALIDAÇÃO DE BENEFICIÁRIO (GUSTAVO) - ESTRITA
      // Procura palavras de recebimento num raio de até 50 caracteres antes do nome
      const palavrasRecebimento = ["PARA", "BENEFICIÁRIO", "BENEFICIARIO", "DESTINO", "DESTINATÁRIO", "DESTINATARIO", "RECEBEDOR", "FAVORECIDO"];
      const variacoesNome = ["GUSTAVO SANTOS RIBEIRO", "GUSTAVO S. RIBEIRO", "GUSTAVO S RIBEIRO"];
      
      let nomeValidado = false;
      
      for (let nome of variacoesNome) {
        if (textoLimpo.includes(nome)) {
          // Encontra a posição do nome
          const indexNome = textoLimpo.indexOf(nome);
          // Pega um trecho de texto antes do nome (contexto)
          const contextoAntes = textoLimpo.substring(Math.max(0, indexNome - 60), indexNome);
          
          // Verifica se alguma palavra de recebimento está nesse contexto
          if (palavrasRecebimento.some(palavra => contextoAntes.includes(palavra))) {
            nomeValidado = true;
            break;
          }
        }
      }
      
      if (!nomeValidado) {
        alert("❌ DESTINATÁRIO INCORRETO OU NOME NÃO ENCONTRADO!\n\nO comprovante deve mostrar Gustavo Santos Ribeiro como recebedor.");
        return { valido: false };
      }

      // 4. VALIDAÇÃO DE VALOR
      const regexValor = /(?:R\$|VALOR|PAGO)?\s?(\d{1,3}(?:\.\d{3})*,\d{2})/i;
      const valorMatch = textoLimpo.match(regexValor);
      let valorComprovante = 0;

      if (valorMatch) {
        valorComprovante = parseFloat(valorMatch[1].replace(/\./g, '').replace(',', '.'));
      }

      if (valorComprovante < 10.00) {
        const valorExibicao = valorComprovante > 0 ? `R$ ${valorComprovante.toFixed(2)}` : "Não detectado";
        alert(`❌ VALOR INSUFICIENTE OU NÃO LIDO!\n\nValor detectado: ${valorExibicao}\nValor mínimo: R$ 10,00`);
        return { valido: false };
      }

      // 5. REGISTRO (BANCO DE DADOS - NÃO MODIFICADO)
      const conteudoParaGravar = `ID: ${transactionID} | VALOR: R$ ${valorComprovante.toFixed(2)} | REGISTRO: ${new Date().toLocaleString('pt-BR')}`;
      
      const response = await fetch(SUPABASE_URL, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ dado: conteudoParaGravar })
      });

      if (!response.ok) throw new Error("Erro ao gravar");

      alert("✅ SUCESSO! Pagamento validado.");
      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Erro Final:", error);
      alert("❌ Falha no processamento.");
      return { valido: false };
    }
  }
};

export default PaymentControlService;