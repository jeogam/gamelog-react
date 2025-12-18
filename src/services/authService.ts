// src/services/authService.ts
<<<<<<< Updated upstream

import { BASE_URL } from './api';

// Tipagem do retorno do login (baseado no teu DTO Java)
=======
import api from './api';

// Tipagem do Login
export interface LoginDTO {
  email: string;
  senha: string;
}

// Tipagem flexível para a resposta
>>>>>>> Stashed changes
export interface LoginResponse {
  token: string;
  tipo?: string;     // Token Type (Geralmente "Bearer")
  papel?: string;    // Papel direto na raiz?
  usuario?: {        // Papel dentro de um objeto usuario?
    papel: string;
    nome: string;
  };
  user?: {           // Ou user?
    role: string;
    papel: string;
  };
  [key: string]: any; // Permite outros campos
}

<<<<<<< Updated upstream
// Tipagem para os dados de registro (baseado no seu model Usuario)
export interface RegisterData {
=======
export interface RegisterDTO {
>>>>>>> Stashed changes
  nome: string;
  email: string;
  senha: string;
}

export const authService = {
<<<<<<< Updated upstream
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
=======
  // LOGIN
  login: async (dados: LoginDTO) => {
    const response = await api.post<LoginResponse>('/auth/login', dados);
    const data = response.data;

    // DEBUG: Mostra exatamente o que o servidor mandou
    console.log('--- RESPOSTA DO LOGIN (JSON) ---', data);

    if (data.token) {
      localStorage.setItem('gamelog_token', data.token);
      localStorage.setItem('gamelog_user_email', dados.email);
      
      // Tenta encontrar o papel em vários lugares possíveis
      // 1. data.papel (na raiz)
      // 2. data.usuario.papel (dentro de objeto usuario)
      // 3. data.user.papel (dentro de objeto user)
      let userRole = data.papel;

      if (!userRole && data.usuario) {
        userRole = data.usuario.papel;
      }
      if (!userRole && data.user) {
        userRole = data.user.papel;
      }

      // Se ainda for undefined, evita salvar "Bearer" (que vem do data.tipo)
      if (!userRole) {
          console.warn('AVISO: Não foi possível encontrar o campo de papel/role no JSON.');
          userRole = ''; 
      }
      
      console.log('Papel identificado para salvar:', userRole);
      localStorage.setItem('gamelog_user_role', userRole || '');
    }
    return data;
  },

  // CADASTRO
  register: async (dados: RegisterDTO) => {
    await api.post('/usuarios/usuario', dados);
>>>>>>> Stashed changes
  },

  /**
   * Remove os dados de autenticação (Logout).
   */
  logout: () => {
    localStorage.removeItem('gamelog_token');
<<<<<<< Updated upstream
    localStorage.removeItem('gamelog_user');
  },

  /**
   * Verifica se o utilizador está autenticado.
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('gamelog_token');
=======
    localStorage.removeItem('gamelog_user_email');
    localStorage.removeItem('gamelog_user_role');
    window.location.href = '/login'; 
  },

  // VERIFICA SE ESTÁ LOGADO
  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('gamelog_token');
    }
    return false;
  },

  // PEGA O PAPEL
  getRole: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gamelog_user_role');
    }
    return null;
>>>>>>> Stashed changes
  }
};