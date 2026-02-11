import React from 'react';
import { motion } from 'framer-motion';

export default function TarotCardComponent({ card, reversed = false, position }) {
  if (!card) return null;

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
    'o-eremita': 'o heremita.jpg',
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

  const imageName = imageMap[card.id] || 'o louco.jpg';
  const imagePath = `/assets/cartas/${imageName}`;
  
  // Isso vai nos ajudar a saber onde ele está procurando
  console.log("Tentando carregar imagem:", imagePath);

  return (
    <div className="flex flex-col items-center">
      {position && (
        <span className="mb-4 px-6 py-1.5 rounded-full bg-purple-900/50 text-amber-400 text-sm font-bold border border-amber-500/30 uppercase tracking-tighter">
          {position}
        </span>
      )}
      
      <div className="relative w-48 h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-gray-900">
        <img 
          src={imagePath} 
          alt={card.name}
          className={`w-full h-full object-cover ${reversed ? 'rotate-180' : ''}`}
          onError={(e) => {
            console.error("Erro ao carregar imagem:", imagePath);
            e.target.src = "https://via.placeholder.com/200x350?text=Erro+Imagem";
          }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-black/60 backdrop-blur-sm">
           <p className="text-white font-bold text-xs uppercase">{card.name}</p>
        </div>
      </div>
    </div>
  );
}
