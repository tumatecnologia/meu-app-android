import { createWorker } from 'tesseract.js';

class PaymentOCRService {
  static async getWorker() {
    const worker = await createWorker();
    await worker.loadLanguage('por');
    await worker.initialize('por');
    await worker.setParameters({
      tessedit_pageseg_mode: '6',
      tessedit_ocr_engine_mode: '1',
      preserve_interword_spaces: '1',
      user_defined_dpi: '300'
    });
    return worker;
  }

  static async extractTextFromImage(file) {
    try {
      const worker = await this.getWorker();
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      return text.toUpperCase().replace(/\s+/g, ' ').trim();
    } catch (error) {
      console.error('❌ [OCR] Erro:', error.message);
      throw error;
    }
  }

  // Extração simplificada: Apenas ID e Valor
  static async processImage(file) {
    try {
      const text = await this.extractTextFromImage(file);
      
      // Captura ID (mínimo 15 caracteres alfanuméricos)
      const idMatch = text.match(/([A-Z0-9]{15,})/);
      const transactionID = idMatch ? idMatch[0] : null;

      // Captura Valor
      const regexValor = /(?:R\$|VALOR|PAGO)?\s?(\d{1,3}(?:\.\d{3})*,\d{2})/i;
      const valorMatch = text.match(regexValor);
      let valorComprovante = 0;
      if (valorMatch) {
        valorComprovante = parseFloat(valorMatch[1].replace(/\./g, '').replace(',', '.'));
      }

      return {
        success: !!(transactionID && valorComprovante >= 10),
        data: {
          id: transactionID,
          amount: valorComprovante
        },
        text: text // Retorna o texto bruto para conferência se necessário
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default PaymentOCRService;
