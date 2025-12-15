import React, { useState, useRef } from 'react';
import { Contrast, Sun, Crop, RotateCw, Check, X } from 'lucide-react';

const ImageEnhancer = ({ imageSrc, onEnhanced, onCancel }) => {
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const applyFilters = () => {
    if (!canvasRef.current || !imgRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Aplicar rotação
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
    
    // Aplicar filtros de brilho e contraste
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const brightnessAdjust = brightness - 100;
    
    for (let i = 0; i < data.length; i += 4) {
      // Contraste
      data[i] = contrastFactor * (data[i] - 128) + 128;
      data[i + 1] = contrastFactor * (data[i + 1] - 128) + 128;
      data[i + 2] = contrastFactor * (data[i + 2] - 128) + 128;
      
      // Brilho
      data[i] = Math.min(255, Math.max(0, data[i] + brightnessAdjust));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightnessAdjust));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightnessAdjust));
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Retornar imagem melhorada
    canvas.toBlob((blob) => {
      if (onEnhanced) {
        onEnhanced(blob);
      }
    }, 'image/jpeg', 0.9);
  };

  const handleEnhance = () => {
    applyFilters();
  };

  const resetFilters = () => {
    setContrast(100);
    setBrightness(100);
    setRotation(0);
    setIsCropping(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-purple-500/20">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Contrast className="w-5 h-5 text-purple-400" />
          Otimizador para Android
        </h3>
        
        <p className="text-gray-300 text-sm mb-4">
          Ajuste a imagem para melhorar o reconhecimento do OCR:
        </p>
        
        {/* Preview da imagem com filtros */}
        <div className="relative mb-4">
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Imagem para otimizar"
            className="w-full rounded-lg border border-gray-700"
            crossOrigin="anonymous"
            onLoad={() => {
              if (imgRef.current) {
                const canvas = document.createElement('canvas');
                canvas.width = imgRef.current.width;
                canvas.height = imgRef.current.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgRef.current, 0, 0);
                canvasRef.current = canvas;
              }
            }}
          />
        </div>
        
        {/* Controles de ajuste */}
        <div className="space-y-4">
          {/* Contraste */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Contrast className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300 text-sm">Contraste</span>
              </div>
              <span className="text-purple-300 text-sm">{contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
            />
          </div>
          
          {/* Brilho */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-gray-300 text-sm">Brilho</span>
              </div>
              <span className="text-amber-300 text-sm">{brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
            />
          </div>
          
          {/* Rotação */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Rotação</span>
              </div>
              <span className="text-blue-300 text-sm">{rotation}°</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRotation(prev => prev - 90)}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
              >
                -90°
              </button>
              <button
                onClick={() => setRotation(0)}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
              >
                Resetar
              </button>
              <button
                onClick={() => setRotation(prev => prev + 90)}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
              >
                +90°
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botões de ação */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleEnhance}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          <Check className="w-5 h-5" />
          Aplicar Melhorias
        </button>
        
        <button
          onClick={onCancel}
          className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          <X className="w-5 h-5" />
          Cancelar
        </button>
      </div>
      
      {/* Dicas */}
      <div className="bg-gradient-to-r from-blue-900/10 to-purple-900/10 rounded-xl p-3 border border-blue-500/20">
        <p className="text-blue-300 font-medium text-sm mb-1">💡 Dicas para Android:</p>
        <ul className="text-gray-300 text-xs space-y-1">
          <li>• <strong>Aumente contraste</strong> se texto estiver fraco</li>
          <li>• <strong>Aumente brilho</strong> se imagem estiver escura</li>
          <li>• <strong>Rotacione</strong> se texto estiver torto</li>
          <li>• Melhor: <strong>Contraste 120% + Brilho 130%</strong></li>
        </ul>
      </div>
    </div>
  );
};

export default ImageEnhancer;
