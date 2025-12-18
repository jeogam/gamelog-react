import api from './api';

// Tipagem do Login (O que enviamos)
export interface LoginDTO {
  email: string;
  senha: string;
}

// Tipagem da Resposta do Login (O que recebemos)
export interface LoginResponse {
  token: string;
  tipo: string;
}

// Tipagem do Cadastro
export interface RegisterDTO {
  nome: string;
  email: string;
  senha: string;
}

export const authService = {
  // LOGIN
  login: async (dados: LoginDTO) => {
    // POST /auth/login
    const response = await api.post<LoginResponse>('/auth/login', dados);
    
    // Se deu certo, salvamos o token
    if (response.data.token) {
      localStorage.setItem('gamelog_token', response.data.token);
      localStorage.setItem('gamelog_user_email', dados.email); // Opcional: salvar email
    }
    return response.data;
  },

  // CADASTRO
  register: async (dados: RegisterDTO) => {
    // POST /usuarios/usuario
    await api.post('/usuarios/usuario', dados);
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem('gamelog_token');
    localStorage.removeItem('gamelog_user_email');
    window.location.href = '/login'; // Redireciona forçado para login
  },

  // ADICIONE ESTA FUNÇÃO:
  getRole: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gamelog_user_role');
    }
    return null;
  },
  
  // VERIFICA SE ESTÁ LOGADO
  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('gamelog_token');
    }
    return false;
  }
};