import api from "./api";
import { ListaPersonalizada, ListaPersonalizadaCriarDTO } from "@/interfaces/ListaPersonalizada";

// Definindo a interface de atualização aqui (ou você pode mover para o arquivo de interfaces se preferir)
export interface ListaPersonalizadaAtualizarDTO {
  id: string;
  nome: string;
  publica: boolean;
  jogosIds: string[];
}

export const listaService = {
  // Criar nova lista
  criar: async (dto: ListaPersonalizadaCriarDTO): Promise<ListaPersonalizada> => {
    const response = await api.post("/listas/lista", dto);
    return response.data;
  },

  // Buscar listas de um usuário específico
  getByUsuario: async (usuarioId: string): Promise<ListaPersonalizada[]> => {
    const response = await api.get(`/listas/usuario/${usuarioId}`);
    return response.data;
  },

  // Buscar detalhes de uma lista específica
  getById: async (id: string): Promise<ListaPersonalizada> => {
    const response = await api.get(`/listas/lista/${id}`);
    return response.data;
  },

  // Atualizar a lista (Adicionar/Remover jogos, mudar nome, etc)
  atualizar: async (dto: ListaPersonalizadaAtualizarDTO): Promise<ListaPersonalizada> => {
    const response = await api.put(`/listas/lista/${dto.id}`, dto);
    return response.data;
  },

  // Deletar lista
  deletar: async (id: string): Promise<{ id: string }> => {
    const response = await api.delete(`/listas/lista/${id}`);
    return response.data;
  }
};