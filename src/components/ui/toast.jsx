// Este é apenas um wrapper, usaremos o sonner diretamente
export const toast = {
  success: (message) => {
    console.log('✅ ' + message);
    // Em ambiente real, usar: import { toast } from 'sonner';
  },
  error: (message) => {
    console.log('❌ ' + message);
  },
  info: (message) => {
    console.log('ℹ️ ' + message);
  }
};
