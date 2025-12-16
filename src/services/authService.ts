// src/services/authService.ts

import { BASE_URL } from './api';

// Tipagem do retorno do login (baseado no teu DTO Java)
export interface LoginResponse {
  token: string;
  tipo: string;
}

// Tipagem para os dados de registro (baseado no seu model Usuario)
export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
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
   * Realiza o cadastro de um novo utilizador.
   * Endpoint: POST /api/v1/usuarios/usuario
   */
  register: async (data: RegisterData): Promise<void> => {
    const response = await fetch(`${BASE_URL}/usuarios/usuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      // Adiciona um tratamento de erro mais robusto para ler a resposta do servidor
      const errorText = await response.text();
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        if (errorText) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }
    // Retorna void (sucesso - status 201 Created)
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