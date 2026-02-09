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

      // 1. EXTRAÇÃO DO ID
      const transactionID = textoLimpo.match(/([A-Z0-9]{15,})/)?.[0];
      
      if (!transactionID) {
        alert("❌ ID não encontrado. Use uma imagem mais clara.");
        return { valido: false };
      }

      // 2. VERIFICAÇÃO DE DUPLICIDADE
      const checkResponse = await fetch(`${SUPABASE_URL}?dado=ilike.*${transactionID}*`, {
        method: 'GET',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      const existingRecords = await checkResponse.json();
      if (existingRecords.length > 0) {
        alert("❌ COMPROVANTE JÁ UTILIZADO!");
        return { valido: false };
      }

      // 3. VALIDAÇÃO DE DATA SUPER ROBUSTA (NOVIDADE)
      const hoje = new Date();
      const dataFormatada = (data) => data.toLocaleDateString('pt-BR');
      const d1 = dataFormatada(hoje); // DD/MM/AAAA
      const d2 = d1.replace(/\//g, '.'); // DD.MM.AAAA
      const d3 = d1.replace(/\//g, '-'); // DD-MM-AAAA
      const d4 = d1.slice(0, 5); // DD/MM

      // MAPEAMENTO DE MESES POR EXTENSO
      const meses = {
        "JAN": "01", "FEV": "02", "MAR": "03", "ABR": "04", "MAI": "05", "JUN": "06",
        "JUL": "07", "AGO": "08", "SET": "09", "OUT": "10", "NOV": "11", "DEZ": "12"
      };

      // Regex para procurar formatos: DD/MM/AAAA, DD.MM.AAAA, DD-MM-AAAA, DD/MM/AA E DD MES AAAA
      // Tenta achar padrões numéricos ou alfanuméricos de data
      const regexData = /(\d{2}[\/\.-]\d{2}[\/\.-]\d{2,4})|(\d{2}\s+(JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\s+\d{2,4})/i;
      const dataMatch = textoLimpo.match(regexData);
      let dataNoComprovante = dataMatch ? dataMatch[0] : null;

      // CONVERSÃO DE MÊS POR EXTENSO PARA NÚMERO
      if (dataNoComprovante) {
        for (const [key, value] of Object.entries(meses)) {
          if (dataNoComprovante.includes(key)) {
            dataNoComprovante = dataNoComprovante.replace(new RegExp(key, 'i'), value).replace(/\s+/g, '/');
            break;
          }
        }
      }

      // Verifica se a data lida corresponde a alguma variação da data de hoje
      const dataValida = [d1, d2, d3, d4].some(variacao => dataNoComprovante?.includes(variacao));

      if (!dataValida) {
        alert(`❌ DATA INVÁLIDA!\n\nComprovante: ${dataNoComprovante || "Não detectada"}\nData atual: ${d1}\n\nO comprovante deve ser de hoje.`);
        return { valido: false };
      }

      // 4. REGISTRO
      const conteudoParaGravar = `ID: ${transactionID} | DATA_OCR: ${dataNoComprovante} | REGISTRO: ${new Date().toLocaleString('pt-BR')}`;
      
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

      alert("✅ SUCESSO! ID e Data validados.");
      return { valido: true, idEncontrado: transactionID };

    } catch (error) {
      console.error("Erro Final:", error);
      alert("❌ Falha no processamento.");
      return { valido: false };
    }
  }
};

export default PaymentControlService;