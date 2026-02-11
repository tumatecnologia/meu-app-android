import React from 'react';
import { motion } from 'framer-motion';

export default function TarotCardComponent({ card, reversed = false, position }) {
  if (!card) return null;

  // Mapeamento dos nomes dos arquivos exatamente como estão na sua pasta assets/cartas
  const imageMap = {
    'o-louco': 'o louco.jpg',
    'o-mago': 'o mago.jpg',
    'a-sacerdotisa': 'a sacerdotisa.jpg',
    'a-imperatriz': 'a imperatriz.jpg',
    'o-imperador': 'o imperador.jpg',
    'o-hierofante': 'o hierofante.jpg',
    'os-enamorados': 'os enamorados.jpg',
    'o-carro': 'o carro.jpg',
    'a-justica': 'a justica.jpg',
    'o-eremita': 'o heremita.jpg', // Ajustado para 'heremita' com H conforme seu ls
    'a-roda-da-fortuna': 'a roda-da-fortuna.jpg',
    'a-forca': 'a forca.jpg',
    'o-enforcado': 'o enforcado.jpg',
    'a-morte': 'a morte.jpg',
    'a-temperanca': 'a temperanca.jpg',
    'o-diabo': 'o diabo.jpg',
    'a-torre': 'a torre.jpg',
    'a-estrela': 'a estrela.jpg',
    'a-lua': 'a lua.jpg',
    'o-sol': 'o sol.jpg',
    'o-julgamento': 'o julgamento.jpg',
    'o-mundo': 'o mundo.jpg'
  };

  const imageName = imageMap[card.id];
  const imagePath = `/assets/cartas/${imageName}`;

  return (
    <div className="flex flex-col items-center">
      {position && (
        <span className="mb-4 px-6 py-1.5 rounded-full bg-purple-900/50 text-amber-400 text-sm font-bold border border-amber-500/30 uppercase tracking-tighter">
          {position}
        </span>
      )}
      
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="relative group"
      >
        <div className="relative w-48 h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] bg-gray-900">
          <img 
            src={imagePath} 
            alt={card.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${reversed ? 'rotate-180' : ''}`}
            onError={(e) => {
                e.target.src = "https://via.placeholder.com/200x350?text=Carta+Nao+Encontrada";
                console.error("Erro ao carregar imagem:", imagePath);
            }}
          />
          
          {/* Overlay de brilho */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
          
          {/* Nome da carta na parte inferior da imagem */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/40 backdrop-blur-sm">
             <p className="text-white font-bold text-sm uppercase">{card.name}</p>
          </div>
        </div>

        {reversed && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg z-20">
            INVERTIDA
          </div>
        )}
      </motion.div>
    </div>
  );
}
