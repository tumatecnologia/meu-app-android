// Simulação do cliente base44 para desenvolvimento

const mockDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const base44 = {
  auth: {
    me: async () => {
      await mockDelay(500);
      return {
        email: 'usuario@exemplo.com',
        name: 'Usuário Teste',
        id: 'user_123'
      };
    }
  },
  
  entities: {
    Reading: {
      filter: async () => {
        await mockDelay(300);
        return [];
      },
      create: async (data) => {
        console.log('📖 Reading criado:', data);
        await mockDelay(800);
        return {
          id: `reading_${Date.now()}`,
          ...data,
          created_at: new Date().toISOString()
        };
      }
    },
    
    Payment: {
      create: async (data) => {
        console.log('💰 Payment criado:', data);
        await mockDelay(600);
        return {
          id: `payment_${Date.now()}`,
          ...data,
          created_at: new Date().toISOString()
        };
      },
      update: async (id, data) => {
        console.log(`🔄 Payment ${id} atualizado:`, data);
        await mockDelay(400);
        return { success: true };
      }
    }
  },
  
  integrations: {
    Core: {
      InvokeLLM: async ({ prompt }) => {
        console.log('🤖 LLM chamado com prompt:', prompt.substring(0, 100) + '...');
        await mockDelay(1500);
        
        // Simulação de resposta do LLM
        return {
          content: `### 🌟 Boas-Vindas ao Oráculo Sagrado\n\nBem-vindo(a) à sua leitura personalizada! O universo tem mensagens especiais para você hoje.\n\n### ✨ Análise das Cartas\n\nAs cartas reveladas mostram um caminho de crescimento e transformação.\n\n### 💎 Conselhos Práticos\n\n1. Confie em sua intuição\n2. Esteja aberto(a) a novas oportunidades\n3. Mantenha o equilíbrio emocional\n\n### 🔮 Mensagem Final\n\nO universo conspira a seu favor. Continue sua jornada com fé e determinação.`,
          tokens_used: 250,
          model: 'mock-llm'
        };
      },
      
      UploadFile: async ({ file }) => {
        console.log('📤 Upload de arquivo:', file.name);
        await mockDelay(1200);
        return {
          file_url: `https://mock-cdn.com/files/${Date.now()}_${file.name}`,
          file_id: `file_${Date.now()}`
        };
      }
    }
  }
};

export default base44;
