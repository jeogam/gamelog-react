import api from "./api";

// Tipagem do Login (O que enviamos)
export interface LoginDTO {
  email: string;
  senha: string;
}

// Tipagem da Resposta do Login (O que recebemos)
export interface LoginResponse {
  token: string;
  tipo: string;
  papel: string; // ✅ Adicionado para bater com o Backend
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
    const response = await api.post<LoginResponse>("/auth/login", dados);

    // Se deu certo, salvamos o token e o papel
    if (response.data.token) {
      localStorage.setItem("gamelog_token", response.data.token);
      localStorage.setItem("gamelog_user_email", dados.email); 
      
      // ✅ Salva o papel (role) se vier na resposta
      if (response.data.papel) {
        localStorage.setItem("gamelog_user_role", response.data.papel);
      }
    }
    return response.data;
  },

  // CADASTRO
  register: async (dados: RegisterDTO) => {
    // POST /usuarios/usuario
    await api.post("/usuarios/usuario", dados);
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem("gamelog_token");
    localStorage.removeItem("gamelog_user_email");
    localStorage.removeItem("gamelog_user_role"); // ✅ Limpa o papel também
    window.location.href = "/login"; 
  },

  // Retorna o papel salvo (ex: "ADMINISTRADOR")
  getRole: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("gamelog_user_role");
    }
    return null;
  },

  // Obtém o ID do usuário (usando o perfilService como auxiliar)
  getUsuarioId: async (): Promise<string | null> => {
    if (!authService.isAuthenticated()) return null;
    try {
      const perfil = await (
        await import("./perfilService")
      ).perfilService.getMeuPerfil();
      // O perfil geralmente tem { id: ..., usuarioId: ... }
      // Ajuste conforme seu DTO de perfil
      return String((perfil as any).usuarioId || (perfil as any).id);
    } catch {
      return null;
    }
  },

  // VERIFICA SE ESTÁ LOGADO
  isAuthenticated: () => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("gamelog_token");
    }
    return false;
  },
};