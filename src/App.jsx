import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DailyCard from './pages/DailyCard';
import ThreeCardsReading from './pages/ThreeCardsReading';

// Página ReadingHistory (vamos criar depois)
function ReadingHistory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 p-8 text-white">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-amber-300">Histórico de Leituras</h1>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/30">
          <p className="text-xl mb-4">📜 Seu histórico de consultas 📜</p>
          <p className="text-purple-200">Página em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily-card" element={<DailyCard />} />
        <Route path="/three-cards-reading" element={<ThreeCardsReading />} />
        <Route path="/reading-history" element={<ReadingHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
