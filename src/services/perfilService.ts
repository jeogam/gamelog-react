import api from "./api";
import type { Perfil, PerfilUpdateDTO } from "../interfaces/Perfil";

export const perfilService = {
  getMeuPerfil: async (): Promise<Perfil> => {
    const response = await api.get("/perfis/meu-perfil");
    return response.data;
  },

  updateMeuPerfil: async (dados: PerfilUpdateDTO): Promise<Perfil> => {
    const response = await api.put("/perfis/meu-perfil", dados);
    return response.data;
  },

  // ✅ Perfil público (para /perfil/[usuarioId])
  getPerfilPublico: async (usuarioId: string): Promise<Perfil> => {
    const response = await api.get(`/perfis/usuario/${usuarioId}`);
    return response.data;
  },
};
