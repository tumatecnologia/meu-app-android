import React, { useState } from 'react';
import { validatePixReceipt } from '../../services/paymentControl';
import { createWorker } from 'tesseract.js';

export default function PaymentUploader({ onValidationComplete, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const worker = await createWorker('por');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Aqui chamamos o serviço que já limpamos (ID + VALOR + NOME)
      const result = validatePixReceipt(text);

      if (result.success) {
        onValidationComplete(result);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Erro ao ler a imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-black/20 p-6 rounded-2xl border-2 border-dashed border-white/10 text-center">
        {loading ? (
          <div className="py-4">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-white">Lendo comprovante...</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-4 text-sm">Tire um print ou foto do comprovante</p>
            <input
              type="file"
              accept="image/*"
              onChange={processImage}
              className="hidden"
              id="upload-input"
            />
            <label
              htmlFor="upload-input"
              className="inline-block px-6 py-3 bg-white text-black font-bold rounded-xl cursor-pointer hover:bg-gray-200 transition-colors"
            >
              SELECIONAR IMAGEM
            </label>
          </>
        )}
      </div>
      {error && <p className="text-red-400 text-center font-bold bg-red-400/10 p-2 rounded-lg">{error}</p>}
      <button onClick={onCancel} className="w-full text-gray-500 text-sm">Voltar</button>
    </div>
  );
}
