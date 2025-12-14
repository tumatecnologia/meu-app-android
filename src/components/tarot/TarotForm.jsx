import React, { useState } from 'react';
import { User, Calendar, MessageSquare, ArrowRight, ArrowLeft, Heart, Briefcase, DollarSign, Sparkles, HeartPulse, Users, Plane, Bell, MessageCircle, Scale } from 'lucide-react';

const TarotForm = ({ themes, selectedTheme, onThemeSelect, onFormSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    question: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTheme && formData.name.trim() && formData.birthDate && formData.question.trim()) {
      onFormSubmit({
        ...formData,
        theme: selectedTheme
      });
    }
  };

  const handleThemeClick = (themeId) => {
    onThemeSelect(themeId);
  };

  // Verificar se o formulário está completo
  const isFormComplete = formData.name.trim() && formData.birthDate && formData.question.trim();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-purple-800/30 to-violet-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-purple-400/30">
        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Personalize sua Leitura
          </h2>
          <p className="text-purple-300">
            Escolha um tema e preencha seus dados
          </p>
        </div>

        {/* Seção de Temas */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-amber-400">✨</span>
            Escolha um tema
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeClick(theme.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedTheme === theme.id
                    ? `${theme.color} border-amber-400 text-white`
                    : 'bg-white/10 border-white/20 text-purple-200 hover:border-purple-400'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <theme.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{theme.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Formulário Simplificado (SEM EMAIL) */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-8">
            {/* Nome */}
            <div>
              <label className="text-purple-300 text-sm mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Seu nome completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-white/10 border border-purple-400/30 rounded-lg px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                placeholder="Digite seu nome"
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="text-purple-300 text-sm mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data de nascimento *
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
                className="w-full bg-white/10 border border-purple-400/30 rounded-lg px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Pergunta */}
            <div>
              <label className="text-purple-300 text-sm mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Sua pergunta *
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                rows="3"
                required
                className="w-full bg-white/10 border border-purple-400/30 rounded-lg px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-none"
                placeholder="Qual é a sua dúvida ou questão?"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-purple-200 px-6 py-3 rounded-lg transition-colors font-medium flex-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            
            <button
              type="submit"
              disabled={!selectedTheme || !isFormComplete}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium flex-1 transition-all ${
                selectedTheme && isFormComplete
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl cursor-pointer'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continuar para Pagamento
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Informações Simplificadas */}
        <div className="mt-8 pt-6 border-t border-purple-400/30">
          <div className="flex items-center justify-center gap-2 text-purple-300 text-sm">
            <span className="text-amber-300">*</span>
            <span>Campos obrigatórios</span>
            <span className="text-purple-300">•</span>
            <span className="text-amber-300 font-bold">Mínimo R$ 10,00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotForm;
