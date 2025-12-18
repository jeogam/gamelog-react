import axios from 'axios';

// Cria a instância do Axios apontando para o seu Back-end
const api = axios.create({
  // Tenta pegar do .env, se não achar, usa o localhost como garantia
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Antes de cada requisição, ele insere o Token automaticamente
api.interceptors.request.use(
  (config) => {
    // Tenta pegar o token do navegador
    // Nota: Verificamos "typeof window" para não quebrar no servidor do Next.js
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('gamelog_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;