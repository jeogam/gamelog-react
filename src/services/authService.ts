// src/services/authService.ts
import api from './api';

// Tipagem do Login
export interface LoginDTO {
  email: string;
  senha: string;
}

// Tipagem da Resposta
export interface LoginResponse {
  token: string;
  papel?: string; // Pode vir como "papel"
  tipo?: string;  // Ou como "tipo"
}

export interface RegisterDTO {
  nome: string;
  email: string;
  senha: string;
}

export const authService = {
  // LOGIN
  login: async (dados: LoginDTO) => {
    const response = await api.post<LoginResponse>('/auth/login', dados);
    
    const data = response.data;

    // Se deu certo e tem token, salvamos tudo
    if (data.token) {
      localStorage.setItem('gamelog_token', data.token);
      localStorage.setItem('gamelog_user_email', dados.email);
      
      // Tenta pegar o papel de "papel" ou de "tipo"
      const userRole = data.papel || data.tipo || ''; 
      
      // Debug: Mostra no console o que chegou (aperte F12 para ver se precisar)
      console.log('Login efetuado. Role recebida:', userRole);

      localStorage.setItem('gamelog_user_role', userRole);
    }
    return data;
  },

  // CADASTRO
  register: async (dados: RegisterDTO) => {
    await api.post('/usuarios/usuario', dados);
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem('gamelog_token');
    localStorage.removeItem('gamelog_user_email');
    localStorage.removeItem('gamelog_user_role');
    // Redireciona para login e limpa estado
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
  }
};