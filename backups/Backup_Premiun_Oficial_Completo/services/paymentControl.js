const PaymentControlService = {
  processarArquivo: async (file) => {
    // Aqui você integraria com o OCR real. 
    // Para teste, simulamos a validação do seu nome e data.
    return {
      valido: true,
      mensagem: "PAGAMENTO VALIDADO COM SUCESSO!",
      paymentId: Date.now()
    };
  }
};
export default PaymentControlService;
