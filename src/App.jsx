import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DailyCard from './pages/DailyCard';
import ThreeCardsReading from './pages/ThreeCardsReading';


function App() {
  return (
    <Router basename="/meu-app-android">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily-card" element={<DailyCard />} />
        <Route path="/three-cards-reading" element={<ThreeCardsReading />} />
      </Routes>
    </Router>
  );
}

export default App;
