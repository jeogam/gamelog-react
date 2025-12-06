// Define a URL base do backend.
// Em produção, isso poderia vir de uma variável de ambiente (import.meta.env.VITE_API_URL)
export const BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Função utilitária para fazer requisições autenticadas genericamente (GET, POST, etc).
 * Adiciona automaticamente o Token JWT se ele existir no localStorage.
 */
export const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('gamelog_token');

  const headers = new Headers(options.headers || {});
  
  // Adiciona Content-Type JSON se não estiver definido
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Injeta o Token JWT automaticamente
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Tratamento de erro global simples
  if (!response.ok) {
    // Se der 401 (Não autorizado), poderíamos forçar logout aqui
    if (response.status === 401) {
        // Opcional: window.location.href = '/login';
    }
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  // Tenta fazer o parse do JSON, se houver corpo
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};