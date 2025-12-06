import { BASE_URL } from './api';

// Tipagem do retorno do login (baseado no teu DTO Java)
export interface LoginResponse {
  token: string;
  tipo: string;
}

export const authService = {
  /**
   * Realiza o login do utilizador.
   * Nota: Este endpoint é público, por isso usamos fetch direto com BASE_URL
   * em vez da função 'request' genérica (que exige token).
   */
  login: async (email: string, senha: string): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
      throw new Error('Credenciais inválidas ou erro no servidor.');
    }

    return response.json();
  },

  /**
   * Remove os dados de autenticação (Logout).
   */
  logout: () => {
    localStorage.removeItem('gamelog_token');
    localStorage.removeItem('gamelog_user');
  },

  /**
   * Verifica se o utilizador está autenticado.
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('gamelog_token');
  }
};