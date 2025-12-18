import React, { useState } from 'react';
import { Copy, Check, Smartphone, QrCode } from 'lucide-react';

const QRCodePix = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyPix = () => {
    navigator.clipboard.writeText('12996764694');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pixData = {
    name: 'GUSTAVO SANTOS RIBEIRO',
    key: '12996764694',
    amount: '10.00',
    city: 'SÃO PAULO'
  };

  // Gerar código PIX dinâmico (formato BR Code)
  const pixCode = `00020126580014BR.GOV.BCB.PIX013612996764694520400005303986540510.005802BR5913GUSTAVO SANTOS6009SAO PAULO6229052512967846469452301202309182301206304`;

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/20 rounded-xl border border-purple-700/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <QrCode className="w-5 h-5 text-purple-400" />
          Pague com QR Code
        </h3>
        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
          Rápido e fácil
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* QR Code */}
        <div className="bg-white p-4 rounded-lg flex flex-col items-center">
          <div className="mb-3 text-center">
            <p className="text-sm text-gray-600">Escaneie com seu banco</p>
          </div>
          
          {/* Placeholder para QR Code - Em produção, use uma biblioteca de QR Code */}
          <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-violet-100 border-4 border-purple-300 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
            {/* Padrão de QR Code simulado */}
            <div className="absolute inset-0 flex flex-col">
              {[...Array(25)].map((_, i) => (
                <div key={i} className="flex-1 flex">
                  {[...Array(25)].map((_, j) => (
                    <div 
                      key={j} 
                      className={`flex-1 border border-white ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            
            {/* Marcadores do QR Code */}
            <div className="absolute top-2 left-2 w-10 h-10 bg-black rounded-lg" />
            <div className="absolute top-2 right-2 w-10 h-10 bg-black rounded-lg" />
            <div className="absolute bottom-2 left-2 w-10 h-10 bg-black rounded-lg" />
            
            {/* Valor no centro */}
            <div className="relative z-10 bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-purple-300">
              <p className="text-sm font-bold text-purple-900">R$ 10,00</p>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            Abra o app do seu banco e escaneie
          </p>
        </div>

        {/* Informações do PIX */}
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-purple-300 mb-1">Chave PIX</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-black/30 border border-purple-600/30 rounded-lg p-3">
                  <p className="font-mono text-lg font-bold text-white text-center">
                    {pixData.key}
                  </p>
                </div>
                <button
                  onClick={handleCopyPix}
                  className={`p-3 rounded-lg transition-all ${copied ? 'bg-green-600' : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700'}`}
                  title="Copiar chave PIX"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-400 mt-1 animate-pulse">
                  ✅ Chave copiada para a área de transferência!
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-purple-300 mb-1">Nome do favorecido</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-medium text-white bg-purple-900/30 p-2 rounded flex-1">
                  {pixData.name}
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(pixData.name)}
                  className="p-2 bg-purple-700 hover:bg-purple-600 rounded transition-colors"
                  title="Copiar nome"
                >
                  <Copy className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-purple-300 mb-1">Valor</p>
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-3">
                <p className="text-2xl font-bold text-white text-center">
                  R$ {pixData.amount}
                </p>
                <p className="text-xs text-amber-300 text-center mt-1">
                  Valor mínimo para liberação
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-700/30">
            <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
              <Smartphone className="w-4 h-4" />
              <span>Como usar:</span>
            </div>
            <ul className="space-y-2 text-sm text-purple-200">
              <li className="flex items-start gap-2">
                <span className="text-amber-400">1.</span>
                <span>Abra o app do seu banco</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">2.</span>
                <span>Toque em "Pagar com PIX"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">3.</span>
                <span>Escaneie o QR Code ou cole a chave</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">4.</span>
                <span>Confirme o pagamento</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-200 flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <span><strong>Pagamento instantâneo:</strong> A confirmação é automática após enviar o comprovante</span>
        </p>
      </div>
    </div>
  );
};

export default QRCodePix;
